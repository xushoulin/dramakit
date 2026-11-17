"use client";

import { useEffect, useState } from "react";
import { T, useLang } from "@/components/Lang";
import { PLATFORMS, SHOTS, CAMERAS, LIGHTS, STYLES, buildPrompt, negativePrompt } from "@/lib/prompt";

export default function PromptBuilderPage() {
  const { L, lang } = useLang();
  const [platform, setPlatform] = useState("seedance");
  const [desc, setDesc] = useState("");
  const [shot, setShot] = useState("medium");
  const [camera, setCamera] = useState("static");
  const [light, setLight] = useState("natural");
  const [style, setStyle] = useState("cinematic");
  const [mood, setMood] = useState("");
  const [duration, setDuration] = useState(5);
  const [charLock, setCharLock] = useState(true);
  const [charDesc, setCharDesc] = useState("");
  const [dialogue, setDialogue] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [neg, setNeg] = useState("");

  // reset selects when language changes so option labels re-render in the right language
  useEffect(() => {
    setShot("medium"); setCamera("static"); setLight("natural"); setStyle("cinematic");
  }, [lang]);

  function generate() {
    if (!desc.trim()) {
      alert(L("请填写画面内容描述", "Describe the shot content first"));
      return;
    }
    setOutput(buildPrompt({ platform, shot, camera, light, style, desc, mood, duration, charLock, charDesc, dialogue }));
    setNeg(negativePrompt(platform));
  }

  function copyOut() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => alert(L("已复制到剪贴板", "Copied to clipboard")));
  }

  const optLabel = (o: { zh: string; en: string }) => (lang === "zh" ? o.zh : o.en);

  return (
    <>
      <div className="container tool-head">
        <h1><T zh="🎥 视频 Prompt 构建器" en="🎥 Video Prompt Builder" /></h1>
        <p>
          <T
            zh="选择目标模型，填入画面描述与镜头参数，生成该平台专用提示词。中文平台出中文、海外平台出英文，附负面提示词。"
            en="Pick a target model, describe the shot, set camera parameters and get a platform-specific prompt — Chinese for domestic models, English for the rest, negative prompt included."
          />
        </p>
      </div>

      <div className="container">
        <div className="panel">
          <label><T zh="目标模型 Platform" en="Target model" /></label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{lang === "zh" ? p.zhName : p.enName}</option>
            ))}
          </select>

          <label><T zh="画面内容描述 Shot description" en="Shot description" /></label>
          <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />

          <div className="row">
            <div>
              <label><T zh="镜头景别 Shot type" en="Shot type" /></label>
              <select value={shot} onChange={(e) => setShot(e.target.value)}>
                {SHOTS.map((o) => <option key={o.id} value={o.id}>{optLabel(o)}</option>)}
              </select>
            </div>
            <div>
              <label><T zh="运镜 Camera move" en="Camera move" /></label>
              <select value={camera} onChange={(e) => setCamera(e.target.value)}>
                {CAMERAS.map((o) => <option key={o.id} value={o.id}>{optLabel(o)}</option>)}
              </select>
            </div>
            <div>
              <label><T zh="光线 Lighting" en="Lighting" /></label>
              <select value={light} onChange={(e) => setLight(e.target.value)}>
                {LIGHTS.map((o) => <option key={o.id} value={o.id}>{optLabel(o)}</option>)}
              </select>
            </div>
            <div>
              <label><T zh="画面风格 Style" en="Style" /></label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                {STYLES.map((o) => <option key={o.id} value={o.id}>{optLabel(o)}</option>)}
              </select>
            </div>
            <div>
              <label><T zh="氛围 Mood" en="Mood" /></label>
              <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder={L("悬疑 / 紧张 / 温情", "suspense / tense / warm")} />
            </div>
            <div>
              <label><T zh="时长（秒）Duration (s)" en="Duration (s)" /></label>
              <input type="number" min={1} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 5)} />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
              <input type="checkbox" checked={charLock} onChange={(e) => setCharLock(e.target.checked)} style={{ width: "auto" }} />
              <T zh="启用角色一致性锁定" en="Lock character consistency" />
            </label>
            {charLock && (
              <div>
                <input
                  type="text"
                  value={charDesc}
                  onChange={(e) => setCharDesc(e.target.value)}
                  style={{ marginTop: 8 }}
                  placeholder={L("25 岁女性，黑色长发，白衬衫，工牌挂脖（每集保持一致）", "25yo woman, long black hair, white shirt, ID badge (consistent)")}
                />
                <div className="hint">
                  <T
                    zh="写成“可视化标签”：年龄 + 发型发色 + 服装 + 标志性道具，所有镜头复用同一段描述。"
                    en="Write it as visual tags: age + hair + outfit + signature prop — reuse the same description across every shot."
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <label><T zh="台词（可选，口型同步 Dialogue, optional）" en="Dialogue (optional, lip-sync)" /></label>
            <input type="text" value={dialogue} onChange={(e) => setDialogue(e.target.value)} />
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={generate}>
              <T zh="生成 Prompt" en="Generate prompt" />
            </button>
          </div>
        </div>

        {output && (
          <div className="panel">
            <div className="prompt-box">{output}</div>
            <pre className="output" style={{ marginTop: 14, maxHeight: "none" }}>
              {(lang === "zh" ? "负面提示词：" : "Negative prompt: ") + neg}
            </pre>
            <div className="actions">
              <button className="btn btn-primary btn-sm" onClick={copyOut}>
                <T zh="复制 Prompt" en="Copy prompt" />
              </button>
            </div>
            <div className="tip">
              <b><T zh="省成本技巧：" en="Cost-saving tip: " /></b>
              <T
                zh="不是所有镜头都值得 4K 渲染——远景/过场用低分辨率抽卡，特写和情绪镜头才上高配，“分镜分级”可省约 40% 渲染成本。"
                en="Not every shot deserves 4K — render wide/transitional shots at low resolution and save high settings for close-ups and emotional beats. Shot tiering cuts render cost by ~40%."
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
