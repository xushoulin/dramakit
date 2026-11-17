/**
 * DramaKit script parser — converts plain-text scripts (zh/en) into
 * structured storyboard JSON. Pure & isomorphic: used by the /api/parse
 * route now, and swappable for an LLM-backed implementation later.
 */

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  visualTags: string;
  personality: string;
  note: string;
}

export interface Shot {
  shotId: string;
  type: string;
  durationSec: number;
  description: string;
  videoPrompt: string;
}

export interface DialogueLine {
  character: string;
  line: string;
}

export interface Scene {
  id: string;
  episode: number;
  location: string;
  intExt: string;
  time: string;
  characters: string[];
  dialogue: DialogueLine[];
  narration: string;
  shots: Shot[];
  hook: string;
}

export interface Drama {
  meta: {
    title: string;
    language: "zh" | "en";
    genre: string;
    style: string;
    generator: string;
    generatedAt: string;
  };
  characters: Character[];
  scenes: Scene[];
  hooks: { episode: number; hook: string }[];
  stats: {
    episodes: number;
    scenes: number;
    dialogueLines: number;
    characters: number;
    estimatedSeconds: number;
  };
}

export interface ParseOptions {
  title?: string;
  genre?: string;
  style?: string;
  hook?: string;
}

const ZH_NUM: Record<string, number> = {
  零: 0, 一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
};

const SPEAKER_STOP = new Set([
  "场景", "备注", "提示", "音效", "bgm", "画面", "镜头", "旁白", "画外音",
  "note", "scene", "sfx", "camera", "narrator", "narration", "voiceover",
]);

const EP_RE =
  /^\s*【?(?:第\s*([0-9０-９一二三四五六七八九十百零两]+)\s*[集话話章]|(?:EP|ep|Ep|episode|Episode)\.?\s*[:：.]?\s*(\d+))】?\s*(.*)$/;
const SCENE_RE =
  /^(?:【?\s*)?(内景|外景|INT\.?|EXT\.?|INT\/EXT|INT\/OUT)\.?\s*[,，、\s]*([^—\-日夜景晨傍晚黄昏阴雨早晚\s]+.*?)\s*(?:[—\-]\s*(日|夜|景|晨|清晨|傍晚|黄昏|阴|雨|早|DAY|NIGHT|DAWN|DUSK|MORNING|EVENING))?】?\s*$/i;
const SCENE_CN_RE = /^场景\s*\d*\s*[:：]\s*(.+)$/;
const DIA_ZH_RE = /^([^\s：:]{1,14})\s*(?:[（(][^)）]*[)）])?\s*[:：]\s*(.+)$/;
const DIA_EN_RE = /^([A-Z][A-Z0-9 .'\-]{1,24})\s*(?:\([^)]*\))?\s*[:：]\s*(.+)$/;

const SHOT_CYCLE = ["medium", "close-up", "medium", "wide", "close-up", "medium"];

function zhNumToInt(s: string): number {
  const ascii = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 65296));
  if (/^\d+$/.test(ascii)) return parseInt(ascii, 10);
  let n = 0;
  let cur = 0;
  for (const ch of ascii) {
    if (ch === "十") { n += (cur || 1) * 10; cur = 0; }
    else if (ch === "百") { n += (cur || 1) * 100; cur = 0; }
    else if (ch in ZH_NUM) { cur = ZH_NUM[ch]; }
  }
  return n + cur;
}

function detectTime(s: string): string {
  if (/日|DAY|晨|清晨|MORNING|早/i.test(s)) return "day";
  if (/夜|NIGHT/i.test(s)) return "night";
  if (/黄昏|傍晚|DUSK|EVENING/i.test(s)) return "dusk";
  if (/雨/i.test(s)) return "rain";
  return "";
}

function detectIntExt(s: string): string {
  if (/内|INT(?![\/])/i.test(s)) return "INT";
  if (/外|EXT/i.test(s)) return "EXT";
  return "";
}

function estSeconds(line: string, isZh: boolean): number {
  if (isZh) return Math.max(2, Math.ceil(line.length / 4));
  const words = line.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 2.5));
}

function typeOfShot(t: string): string {
  const map: Record<string, string> = {
    medium: "中景 Medium shot",
    "close-up": "特写 Close-up",
    wide: "远景 Wide shot",
  };
  return map[t] || t;
}

export function parseScript(text: string, opts: ParseOptions = {}): Drama {
  const isZh = /[\u4e00-\u9fa5]/.test(text.slice(0, 2000));
  const lines = text.split(/\r?\n/);

  const drama: Drama = {
    meta: {
      title: opts.title || "",
      language: isZh ? "zh" : "en",
      genre: opts.genre || "",
      style: opts.style || "",
      generator: "DramaKit Script Formatter v1",
      generatedAt: new Date().toISOString(),
    },
    characters: [],
    scenes: [],
    hooks: [],
    stats: {
      episodes: 0, scenes: 0, dialogueLines: 0, characters: 0, estimatedSeconds: 0,
    },
  };

  const charMap = new Map<string, Character>();
  let ep = 1;
  let scene: Scene | null = null;
  let sceneNo = 0;
  let shotIdx = 0;

  const addCharacter = (name: string, note?: string) => {
    const key = name.toLowerCase();
    const existing = charMap.get(key);
    if (!existing) {
      charMap.set(key, {
        id: "c" + (charMap.size + 1),
        name,
        aliases: [],
        visualTags: "",
        personality: "",
        note: note || "",
      });
    } else if (note && !existing.note) {
      existing.note = note;
    }
  };

  const buildPrompt = (type: string, dur: number, desc: string): string => {
    const style = opts.style || (isZh ? "写实电影感" : "cinematic realism");
    return isZh
      ? `${typeOfShot(type)}，${style}。画面内容：${desc || "（本场戏当前画面）"}。时长约 ${dur} 秒。保持角色面部与服装与已设定的人物圣经一致。`
      : `${typeOfShot(type)}, ${style}. Content: ${desc || "(current scene visual)"}. Duration ~${dur}s. Keep character face and outfit consistent with the character bible.`;
  };

  const addShot = (sc: Scene, type: string, dur: number, desc: string) => {
    shotIdx++;
    sc.shots.push({
      shotId: `${sc.id}-${shotIdx}`,
      type,
      durationSec: dur,
      description: desc || "",
      videoPrompt: buildPrompt(type, dur, desc),
    });
  };

  function newScene(location: string, intExt: string, time: string): Scene {
    sceneNo++;
    const s: Scene = {
      id: "s" + sceneNo,
      episode: ep,
      location: location || "",
      intExt: intExt || "",
      time: time || "",
      characters: [],
      dialogue: [],
      narration: "",
      shots: [],
      hook: "",
    };
    drama.scenes.push(s);
    shotIdx = 0;
    return s;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const epM = line.match(EP_RE);
    if (epM) {
      ep = epM[1] ? zhNumToInt(epM[1]) : parseInt(epM[2], 10);
      scene = null;
      if (epM[3] && epM[3].trim()) drama.hooks.push({ episode: ep, hook: epM[3].trim() });
      continue;
    }

    const scM = line.match(SCENE_RE);
    const scCN = line.match(SCENE_CN_RE);
    if (scM && /^(?:[【\[]\s*)?(内景|外景|INT|EXT)/i.test(line)) {
      scene = newScene((scM[2] || "").replace(/[【】[\]]/g, "").trim(), detectIntExt(scM[1]), detectTime(scM[3] || line));
      continue;
    }
    if (scCN) { scene = newScene(scCN[1].trim(), "", ""); continue; }
    if (/^场景[:：]/.test(line) && line.length <= 40) {
      scene = newScene(line.replace(/^场景[:：]\s*/, ""), "", "");
      continue;
    }

    let speaker = "";
    let text2 = "";
    if (isZh && DIA_ZH_RE.test(line)) {
      const m = line.match(DIA_ZH_RE)!;
      speaker = m[1].trim();
      text2 = m[2].trim();
    } else if (!isZh && DIA_EN_RE.test(line)) {
      const m = line.match(DIA_EN_RE)!;
      speaker = m[1].trim();
      text2 = m[2].trim();
    }
    const isDialogue = speaker.length > 0 && speaker.length <= 14 && !SPEAKER_STOP.has(speaker.toLowerCase());

    if (isDialogue) {
      if (!scene) scene = newScene("", "", "");
      scene.dialogue.push({ character: speaker, line: text2 });
      if (!SPEAKER_STOP.has(speaker.toLowerCase())) {
        addCharacter(speaker);
        if (!scene.characters.includes(speaker)) scene.characters.push(speaker);
      }
      addShot(
        scene,
        shotIdx === 0 ? "medium" : SHOT_CYCLE[scene.dialogue.length % SHOT_CYCLE.length],
        estSeconds(text2, isZh),
        `${speaker}：${text2.slice(0, 40)}${text2.length > 40 ? "…" : ""}`
      );
    } else {
      if (!scene) scene = newScene("", "", "");
      scene.narration = scene.narration ? scene.narration + "\n" + line : line;
      if (!scene.shots.length) addShot(scene, "wide", 3, line.slice(0, 50));
    }
  }

  drama.characters = [...charMap.values()];
  drama.scenes = drama.scenes.filter((s) => s.dialogue.length || s.narration || s.shots.length);
  if (opts.hook) {
    drama.hooks.unshift({ episode: drama.scenes[0] ? drama.scenes[0].episode : 1, hook: opts.hook });
  }

  const est = drama.scenes.reduce(
    (a, s) => a + s.shots.reduce((b, sh) => b + sh.durationSec, 0),
    0
  );
  drama.stats = {
    episodes: new Set(drama.scenes.map((s) => s.episode)).size,
    scenes: drama.scenes.length,
    dialogueLines: drama.scenes.reduce((a, s) => a + s.dialogue.length, 0),
    characters: drama.characters.length,
    estimatedSeconds: est,
  };
  return drama;
}

export function loadSample(lang: "zh" | "en"): string {
  return lang === "zh"
    ? `第一集 电梯里的陌生人
【内景 写字楼电梯 — 日】
旁白：凌晨两点，整栋写字楼只剩顶楼还亮着灯。
林晚：（攥紧工牌）加班到这个点的人，到底在怕什么？
陈总：怕明天的股价，还是怕三年前的那把火？

第二集 会议室的对峙
【内景 顶层会议室 — 夜】
林晚：这份合同，三年前就签过字。签字的人不是你。
陈总：你查到多少，我就能删掉多少。
林晚：删得掉服务器，删不掉备份。
旁白：窗外，一辆黑色轿车缓缓停在了楼下。`
    : `Episode 1  The Stranger in the Elevator
INT. OFFICE BUILDING ELEVATOR - DAY
NARRATOR: The whole tower is dark, except the top floor.
LIN WAN: (clutching her badge) Who is still afraid at 2 a.m.?
CHEN: Afraid of tomorrow's stock price, or the fire three years ago?

Episode 2  The Boardroom Standoff
INT. BOARDROOM - NIGHT
LIN WAN: This contract was signed three years ago. Not by you.
CHEN: Whatever you found, I can erase.
LIN WAN: You can erase servers. Not backups.
NARRATOR: Outside, a black sedan stops below the tower.`;
}
