"use client";

import { useState } from "react";
import { T, useLang } from "@/components/Lang";
import { loadSample, type Drama } from "@/lib/parser";

export default function ScriptFormatterPage() {
  const { L, lang } = useLang();
  const [input, setInput] = useState("");
  const [optTitle, setOptTitle] = useState("");
  const [optGenre, setOptGenre] = useState("");
  const [optStyle, setOptStyle] = useState("");
  const [optHook, setOptHook] = useState("");
  const [drama, setDrama] = useState<Drama | null>(null);
  const [tab, setTab] = useState<"json" | "table">("json");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!input.trim()) {
      alert(L("请先粘贴剧本内容", "Paste a script first"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          options: { title: optTitle, genre: optGenre, style: optStyle, hook: optHook },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setDrama(await res.json());
      setTab("json");
    } catch (e) {
      alert(L("解析失败，请重试", "Parse failed, please retry"));
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  function copyJson() {
    if (!drama) return;
    navigator.clipboard.writeText(JSON.stringify(drama, null, 2))
      .then(() => alert(L("已复制到剪贴板", "Copied to clipboard")));
  }

  function downloadJson() {
    if (!drama) return;
    const blob = new Blob([JSON.stringify(drama, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = ((drama.meta.title || "dramakit-script").replace(/[\\/:*?"<>|\s]+/g, "-")) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const jsonStr = drama ? JSON.stringify(drama, null, 2) : "";

  return (
    <>
      <div className="container tool-head">
        <h1><T zh="📜 剧本结构化转换器" en="📜 Script Formatter" /></h1>
        <p>
          <T
            zh="把小说、大纲或传统剧本 → 结构化分镜 JSON（人物圣经 / 场景表 / 分镜表）。支持中文与英文剧本格式。"
            en="Turn novels, outlines or traditional scripts into structured storyboard JSON (character bible / scene table / shot list). Both Chinese and English script conventions supported."
          />
        </p>
      </div>

      <div className="container">
        <div className="panel">
          <label><T zh="粘贴剧本 / 小说 / 大纲" en="Paste script / novel / outline" /></label>
          <textarea
            id="input"
            className="mono"
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={L(
              "第一集 开场钩子\n【内景 写字楼电梯 — 日】\n旁白：……\n林晚：（攥紧工牌）……\n陈总：……",
              "Episode 1\nINT. ELEVATOR - DAY\nNARRATOR: ...\nLIN WAN: ...\nCHEN: ..."
            )}
          />
          <div className="hint">
            <T
              zh="识别规则：第X集/Episode → 分集；内景/外景/INT./EXT. → 场景头；“角色名：台词” 或 “CHARACTER: line” → 对白。无标记时按空行分段处理。"
              en="Rules: 第X集/Episode → episode split; 内景/外景/INT./EXT. → scene header; “角色名：台词” or “CHARACTER: line” → dialogue. Unmarked text is grouped by blank lines."
            />
          </div>

          <div className="row">
            <div>
              <label><T zh="剧名 Title" en="Title" /></label>
              <input type="text" value={optTitle} onChange={(e) => setOptTitle(e.target.value)} />
            </div>
            <div>
              <label><T zh="题材 Genre" en="Genre" /></label>
              <input type="text" value={optGenre} onChange={(e) => setOptGenre(e.target.value)} />
            </div>
            <div>
              <label><T zh="视觉风格 Visual style" en="Visual style" /></label>
              <input
                type="text"
                value={optStyle}
                onChange={(e) => setOptStyle(e.target.value)}
                placeholder={L("写实电影感，35mm 胶片质感", "cinematic realism, 35mm film look")}
              />
            </div>
            <div>
              <label><T zh="开场钩子 Opening hook" en="Opening hook" /></label>
              <input
                type="text"
                value={optHook}
                onChange={(e) => setOptHook(e.target.value)}
                placeholder={L("开场 3 秒反转", "a 3-second opening reversal")}
              />
            </div>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={run} disabled={busy}>
              {busy ? L("解析中…", "Parsing…") : <T zh="解析并生成 JSON" en="Parse & generate JSON" />}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setInput(loadSample(lang))}>
              <T zh="载入示例" en="Load sample" />
            </button>
          </div>
        </div>

        {drama && (
          <div>
            <div className="stats">
              <div className="stat"><b>{drama.stats.episodes}</b><span><T zh="集数" en="Episodes" /></span></div>
              <div className="stat"><b>{drama.stats.scenes}</b><span><T zh="场景" en="Scenes" /></span></div>
              <div className="stat"><b>{drama.stats.dialogueLines}</b><span><T zh="台词" en="Lines" /></span></div>
              <div className="stat"><b>{drama.stats.characters}</b><span><T zh="角色" en="Characters" /></span></div>
              <div className="stat"><b>{Math.max(1, Math.round(drama.stats.estimatedSeconds / 60))}</b><span><T zh="预估分钟" en="Est. minutes" /></span></div>
            </div>

            <div className="panel">
              <div className="tabs">
                <button className={`tab-btn ${tab === "json" ? "active" : ""}`} onClick={() => setTab("json")}>
                  <T zh="JSON 输出" en="JSON output" />
                </button>
                <button className={`tab-btn ${tab === "table" ? "active" : ""}`} onClick={() => setTab("table")}>
                  <T zh="场次总览" en="Scene table" />
                </button>
              </div>

              {tab === "json" ? (
                <pre className="output">{jsonStr}</pre>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th><T zh="场次" en="Scene" /></th>
                        <th><T zh="集" en="Ep" /></th>
                        <th><T zh="地点" en="Location" /></th>
                        <th><T zh="内外/时间" en="INT/EXT · Time" /></th>
                        <th><T zh="台词" en="Lines" /></th>
                        <th><T zh="镜头" en="Shots" /></th>
                        <th><T zh="估时" en="Est." /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {drama.scenes.map((s) => (
                        <tr key={s.id}>
                          <td className="mono">{s.id}</td>
                          <td>{s.episode}</td>
                          <td>{s.location || "-"}</td>
                          <td>{s.intExt || "-"}/{s.time || "-"}</td>
                          <td>{s.dialogue.length}</td>
                          <td>{s.shots.length}</td>
                          <td>{s.shots.reduce((a, x) => a + x.durationSec, 0)}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="actions">
                <button className="btn btn-primary btn-sm" onClick={copyJson}>
                  <T zh="复制 JSON" en="Copy JSON" />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={downloadJson}>
                  <T zh="下载 .json" en="Download .json" />
                </button>
              </div>
              <div className="tip">
                <b><T zh="下一步：" en="Next step: " /></b>
                <T
                  zh="把每个镜头的 videoPrompt 复制到即梦 / 可灵 / Sora，或用 Prompt 构建器进一步定制镜头语言与角色一致性锁定。"
                  en="Copy each shot’s videoPrompt into Jimeng / Kling / Sora, or refine camera language and character consistency with the Prompt Builder."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
