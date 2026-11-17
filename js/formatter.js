/* DramaKit — Script Formatter: parses plain-text scripts into structured storyboard JSON. Local only. */
(function () {
  const ZH_NUM = { 零: 0, 一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  const SPEAKER_STOP = new Set(['场景', '备注', '提示', '音效', 'BGM', '画面', '镜头', '旁白', '画外音', 'note', 'scene', 'sfx', 'bgm', 'camera', 'narrator', 'narration', 'voiceover']);

  function zhNumToInt(s) {
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    let n = 0, cur = 0;
    for (const ch of s) {
      if (ch === '十') { n += (cur || 1) * 10; cur = 0; }
      else if (ch === '百') { n += (cur || 1) * 100; cur = 0; }
      else if (ch in ZH_NUM) { cur = ZH_NUM[ch]; }
    }
    return n + cur;
  }

  const EP_RE = /^\s*【?(?:第\s*([0-9０-９一二三四五六七八九十百零两]+)\s*[集话話章]|(?:EP|ep|Ep|episode|Episode)\.?\s*[:：.]?\s*(\d+))】?\s*(.*)$/;
  const SCENE_RE = /^(?:【?\s*)?(内景|外景|INT\.?|EXT\.?|INT\/EXT|INT\/OUT)\.?\s*[,，、\s]*([^—\-日夜景晨傍晚黄昏阴雨早晚\s]+.*?)\s*(?:[—\-]\s*(日|夜|景|晨|清晨|傍晚|黄昏|阴|雨|早|DAY|NIGHT|DAWN|DUSK|MORNING|EVENING))?】?\s*$/i;
  const SCENE_CN_RE = /^场景\s*\d*\s*[:：]\s*(.+)$/;
  const DIA_ZH_RE = /^([^\s：:]{1,14})\s*(?:[（(][^)）]*[)）])?\s*[:：]\s*(.+)$/;
  const DIA_EN_RE = /^([A-Z][A-Z0-9 .'\-]{1,24})\s*(?:\([^)]*\))?\s*[:：]\s*(.+)$/;

  const SHOT_CYCLE = ['medium', 'close-up', 'medium', 'wide', 'close-up', 'medium'];

  function detectTime(s) {
    if (/日|DAY|晨|清晨|MORNING|早/i.test(s)) return 'day';
    if (/夜|NIGHT/i.test(s)) return 'night';
    if (/黄昏|傍晚|DUSK|EVENING/i.test(s)) return 'dusk';
    if (/雨/i.test(s)) return 'rain';
    return '';
  }
  function detectIntExt(s) {
    if (/内|INT(?![\/])/i.test(s)) return 'INT';
    if (/外|EXT/i.test(s)) return 'EXT';
    return '';
  }
  function estSeconds(line, isZh) {
    if (isZh) return Math.max(2, Math.ceil(line.length / 4));
    const words = line.split(/\s+/).length;
    return Math.max(2, Math.ceil(words / 2.5));
  }
  function typeOfShot(t) {
    const map = { 'medium': '中景 Medium shot', 'close-up': '特写 Close-up', 'wide': '远景 Wide shot' };
    return map[t] || t;
  }

  function parse(text, opts) {
    const isZh = /[\u4e00-\u9fa5]/.test(text.slice(0, 2000));
    const lines = text.split(/\r?\n/);
    const drama = {
      meta: {
        title: opts.title || '', language: isZh ? 'zh' : 'en', genre: opts.genre || '',
        style: opts.style || '', generator: 'DramaKit Script Formatter v1',
        generatedAt: new Date().toISOString()
      },
      characters: [], scenes: [], hooks: [], stats: {}
    };
    const charMap = new Map(); const seen = new Set();
    let ep = 1, scene = null, sceneNo = 0, shotIdx = 0;

    function addCharacter(name, note) {
      const key = name.toLowerCase();
      if (!charMap.has(key)) {
        charMap.set(key, { id: 'c' + (charMap.size + 1), name, aliases: [], visualTags: '', personality: '', note: note || '' });
      } else if (note && !charMap.get(key).note) {
        charMap.get(key).note = note;
      }
    }
    function newScene(location, intExt, time) {
      sceneNo++;
      scene = {
        id: 's' + sceneNo, episode: ep,
        location: location || '', intExt: intExt || '', time: time || '',
        characters: [], dialogue: [], narration: '',
        shots: [], hook: ''
      };
      drama.scenes.push(scene);
      shotIdx = 0;
    }
    function addShot(type, dur, desc) {
      if (!scene) newScene('', '', '');
      shotIdx++;
      scene.shots.push({
        shotId: `${scene.id}-${shotIdx}`, type,
        durationSec: dur, description: desc || '',
        videoPrompt: buildPrompt(type, dur, desc)
      });
    }
    function buildPrompt(type, dur, desc) {
      const style = opts.style || (isZh ? '写实电影感' : 'cinematic realism');
      return isZh
        ? `${typeOfShot(type)}，${style}。画面内容：${desc || '（本场戏当前画面）'}。时长约 ${dur} 秒。保持角色面部与服装与已设定的人物圣经一致。`
        : `${typeOfShot(type)}, ${style}. Content: ${desc || '(current scene visual)'}. Duration ~${dur}s. Keep character face and outfit consistent with the character bible.`;
    }

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]; const line = raw.trim();
      if (!line) continue;

      const epM = line.match(EP_RE);
      if (epM) {
        if (epM[1]) ep = zhNumToInt(epM[1].replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 65296)));
        else ep = parseInt(epM[2], 10);
        scene = null;
        if (epM[3] && epM[3].trim()) drama.hooks.push({ episode: ep, hook: epM[3].trim() });
        continue;
      }

      const scM = line.match(SCENE_RE);
      const scCN = line.match(SCENE_CN_RE);
      if (scM && /^(?:[【\[]\s*)?(内景|外景|INT|EXT)/i.test(line)) {
        newScene((scM[2] || '').replace(/[【】\[\]]/g, '').trim(), detectIntExt(scM[1]), detectTime(scM[3] || line));
        continue;
      }
      if (scCN) { newScene(scCN[1].trim(), '', ''); continue; }
      if (/^场景[:：]/.test(line) && line.length <= 40) { newScene(line.replace(/^场景[:：]\s*/, ''), '', ''); continue; }

      let dia = null, speaker = '', text2 = '';
      if (isZh && DIA_ZH_RE.test(line)) { const m = line.match(DIA_ZH_RE); speaker = m[1].trim(); text2 = m[2].trim(); }
      else if (!isZh && DIA_EN_RE.test(line)) { const m = line.match(DIA_EN_RE); speaker = m[1].trim(); text2 = m[2].trim(); }
      if (speaker && !SPEAKER_STOP.has(speaker.toLowerCase()) && speaker.length <= 14) {
        dia = { character: speaker, line: text2 };
      }

      if (dia) {
        if (!scene) newScene('', '', '');
        scene.dialogue.push(dia);
        if (!SPEAKER_STOP.has(dia.character.toLowerCase())) {
          addCharacter(dia.character);
          if (!scene.characters.includes(dia.character)) scene.characters.push(dia.character);
        }
        addShot(shotIdx === 0 ? 'medium' : SHOT_CYCLE[(scene.dialogue.length) % SHOT_CYCLE.length],
          estSeconds(dia.line, isZh), `${dia.character}：${dia.line.slice(0, 40)}${dia.line.length > 40 ? '…' : ''}`);
      } else {
        if (!scene) newScene('', '', '');
        if (!scene.narration) scene.narration = line;
        else scene.narration += '\n' + line;
        if (!scene.shots.length) addShot('wide', 3, line.slice(0, 50));
      }
    }

    drama.characters = [...charMap.values()];
    drama.scenes = drama.scenes.filter(s => s.dialogue.length || s.narration || s.shots.length);
    if (opts.hook) drama.hooks.unshift({ episode: drama.scenes[0] ? drama.scenes[0].episode : 1, hook: opts.hook });

    const est = drama.scenes.reduce((a, s) => a + s.shots.reduce((b, sh) => b + sh.durationSec, 0), 0);
    drama.stats = {
      episodes: new Set(drama.scenes.map(s => s.episode)).size,
      scenes: drama.scenes.length,
      dialogueLines: drama.scenes.reduce((a, s) => a + s.dialogue.length, 0),
      characters: drama.characters.length,
      estimatedSeconds: est
    };
    return drama;
  }

  function loadSample() {
    return DK.L(
`第一集 电梯里的陌生人
【内景 写字楼电梯 — 日】
旁白：凌晨两点，整栋写字楼只剩顶楼还亮着灯。
林晚：（攥紧工牌）加班到这个点的人，到底在怕什么？
陈总：怕明天的股价，还是怕三年前的那把火？

第二集 会议室的对峙
【内景 顶层会议室 — 夜】
林晚：这份合同，三年前就签过字。签字的人不是你。
陈总：你查到多少，我就能删掉多少。
林晚：删得掉服务器，删不掉备份。
旁白：窗外，一辆黑色轿车缓缓停在了楼下。`,
`Episode 1  The Stranger in the Elevator
INT. OFFICE BUILDING ELEVATOR - DAY
NARRATOR: The whole tower is dark, except the top floor.
LIN WAN: (clutching her badge) Who is still afraid at 2 a.m.?
CHEN: Afraid of tomorrow's stock price, or the fire three years ago?

Episode 2  The Boardroom Standoff
INT. BOARDROOM - NIGHT
LIN WAN: This contract was signed three years ago. Not by you.
CHEN: Whatever you found, I can erase.
LIN WAN: You can erase servers. Not backups.
NARRATOR: Outside, a black sedan stops below the tower.`);
  }

  // ---------- UI wiring ----------
  let currentJson = null;

  function renderTable(d) {
    const rows = d.scenes.map(s => {
      const est = s.shots.reduce((a, x) => a + x.durationSec, 0);
      return `<tr><td class="mono">${s.id}</td><td>${s.episode}</td><td>${s.location || '-'}</td><td>${s.intExt || '-'}/${s.time || '-'}</td><td>${s.dialogue.length}</td><td>${s.shots.length}</td><td>${est}s</td></tr>`;
    }).join('');
    return `<div class="table-wrap"><table><thead><tr>
      <th>${DK.L('场次', 'Scene')}</th><th>${DK.L('集', 'Ep')}</th><th>${DK.L('地点', 'Location')}</th>
      <th>${DK.L('内外/时间', 'INT/EXT · Time')}</th><th>${DK.L('台词', 'Lines')}</th>
      <th>${DK.L('镜头', 'Shots')}</th><th>${DK.L('估时', 'Est.')}</th>
    </tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function run() {
    const text = document.getElementById('input').value.trim();
    if (!text) { alert(DK.L('请先粘贴剧本内容', 'Paste a script first')); return; }
    const opts = {
      title: document.getElementById('optTitle').value.trim(),
      genre: document.getElementById('optGenre').value.trim(),
      style: document.getElementById('optStyle').value.trim(),
      hook: document.getElementById('optHook').value.trim()
    };
    currentJson = parse(text, opts);
    const d = currentJson;
    document.getElementById('stats').innerHTML =
      `<div class="stat"><b>${d.stats.episodes}</b><span>${DK.L('集数', 'Episodes')}</span></div>
       <div class="stat"><b>${d.stats.scenes}</b><span>${DK.L('场景', 'Scenes')}</span></div>
       <div class="stat"><b>${d.stats.dialogueLines}</b><span>${DK.L('台词', 'Lines')}</span></div>
       <div class="stat"><b>${d.stats.characters}</b><span>${DK.L('角色', 'Characters')}</span></div>
       <div class="stat"><b>${Math.round(d.stats.estimatedSeconds / 60) || 1}</b><span>${DK.L('预估分钟', 'Est. minutes')}</span></div>`;
    document.getElementById('tableOut').innerHTML = renderTable(d);
    document.getElementById('jsonOut').textContent = JSON.stringify(d, null, 2);
    document.getElementById('result').style.display = '';
  }

  function switchTab(which) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + which).classList.add('active');
    document.getElementById('pane-json').style.display = which === 'json' ? '' : 'none';
    document.getElementById('pane-table').style.display = which === 'table' ? '' : 'none';
  }

  function copyJson() {
    if (!currentJson) return;
    navigator.clipboard.writeText(JSON.stringify(currentJson, null, 2))
      .then(() => DK.L('已复制到剪贴板', 'Copied to clipboard'))
      .then(m => alert(m));
  }
  function downloadJson() {
    if (!currentJson) return;
    const blob = new Blob([JSON.stringify(currentJson, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (currentJson.meta.title || 'dramakit-script').replace(/[\\/:*?"<>|\s]+/g, '-') + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('run').addEventListener('click', run);
    document.getElementById('sample').addEventListener('click', () => { document.getElementById('input').value = loadSample(); });
    document.getElementById('copy').addEventListener('click', copyJson);
    document.getElementById('download').addEventListener('click', downloadJson);
    document.getElementById('tab-json').addEventListener('click', () => switchTab('json'));
    document.getElementById('tab-table').addEventListener('click', () => switchTab('table'));
  });
})();
