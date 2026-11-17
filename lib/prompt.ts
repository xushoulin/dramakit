/** DramaKit prompt builder — platform-specific video prompt generation. */

export interface Platform {
  id: string;
  zhName: string;
  enName: string;
  lang: "zh" | "en";
}

export const PLATFORMS: Platform[] = [
  { id: "seedance", zhName: "Seedance 2.5（即梦 / 小云雀）", enName: "Seedance 2.5 (Jimeng / Xiaoyunque)", lang: "zh" },
  { id: "kling", zhName: "可灵 Kling 3.0", enName: "Kling 3.0", lang: "zh" },
  { id: "hailuo", zhName: "海螺 Hailuo（MiniMax）", enName: "Hailuo (MiniMax)", lang: "zh" },
  { id: "sora", zhName: "OpenAI Sora", enName: "OpenAI Sora", lang: "en" },
  { id: "runway", zhName: "Runway Gen-4", enName: "Runway Gen-4", lang: "en" },
  { id: "veo", zhName: "Google Veo 3.1", enName: "Google Veo 3.1", lang: "en" },
];

export interface Option {
  id: string;
  zh: string;
  en: string;
}

export const SHOTS: Option[] = [
  { id: "wide", zh: "远景（全景环境）", en: "Wide shot (full environment)" },
  { id: "medium", zh: "中景（半身对话）", en: "Medium shot (half-body)" },
  { id: "close-up", zh: "特写（面部情绪）", en: "Close-up (face / emotion)" },
  { id: "extreme-close", zh: "大特写（道具 / 细节）", en: "Extreme close-up (detail / prop)" },
  { id: "over-shoulder", zh: "过肩镜头（对话）", en: "Over-the-shoulder" },
  { id: "low-angle", zh: "仰拍（压迫感）", en: "Low angle (imposing)" },
  { id: "top-down", zh: "俯拍（上帝视角）", en: "Top-down / aerial" },
];

export const CAMERAS: Option[] = [
  { id: "static", zh: "固定机位", en: "Static" },
  { id: "push-in", zh: "缓慢推近（推）", en: "Slow push-in" },
  { id: "pull-out", zh: "缓慢拉远（拉）", en: "Slow pull-out" },
  { id: "pan", zh: "横摇（摇）", en: "Pan" },
  { id: "track", zh: "跟随移动（跟）", en: "Tracking shot" },
  { id: "orbit", zh: "环绕（弧形运镜）", en: "Orbit / arc move" },
  { id: "handheld", zh: "手持晃动（紧张感）", en: "Handheld (tension)" },
  { id: "dolly-zoom", zh: "滑动变焦（希区柯克）", en: "Dolly zoom (Vertigo effect)" },
];

export const LIGHTS: Option[] = [
  { id: "natural", zh: "自然光", en: "natural light" },
  { id: "golden", zh: "黄昏暖光", en: "warm golden-hour light" },
  { id: "neon", zh: "霓虹夜景", en: "neon-lit night" },
  { id: "hard-key", zh: "硬光强对比", en: "hard key light, strong contrast" },
  { id: "soft", zh: "柔光窗光", en: "soft window light" },
  { id: "candle", zh: "烛光 / 低照度", en: "candlelight, low-key" },
];

export const STYLES: Option[] = [
  { id: "cinematic", zh: "写实电影感，35mm 胶片质感", en: "cinematic realism, 35mm film look" },
  { id: "anime", zh: "日式动漫风格", en: "Japanese anime style" },
  { id: "ink", zh: "水墨画风", en: "Chinese ink-painting style" },
  { id: "cyberpunk", zh: "赛博朋克", en: "cyberpunk" },
  { id: "drama-py", zh: "国风古装剧", en: "Chinese period drama" },
  { id: "documentary", zh: "纪实风格", en: "documentary style" },
  { id: "3d", zh: "3D 皮克斯质感", en: "3D Pixar-like rendering" },
];

const NEG_ZH = "避免：画面闪烁、人物面部变形、多余的手指、字幕水印、镜头快速抖动";
const NEG_EN = "Avoid: flickering, face morphing, extra fingers, burned-in subtitles or watermarks, shaky camera";

export interface PromptInput {
  platform: string;
  shot: string;
  camera: string;
  light: string;
  style: string;
  desc: string;
  mood: string;
  duration: number;
  charLock: boolean;
  charDesc: string;
  dialogue: string;
}

function find(list: Option[], id: string): Option {
  return list.find((o) => o.id === id) ?? { id, zh: id, en: id };
}

export function buildPrompt(p: PromptInput): string {
  const plat = PLATFORMS.find((x) => x.id === p.platform) ?? PLATFORMS[0];
  const shot = find(SHOTS, p.shot);
  const cam = find(CAMERAS, p.camera);
  const light = find(LIGHTS, p.light);
  const style = find(STYLES, p.style);
  const zhMode = plat.lang === "zh";
  const d = p.duration;
  const cons = p.charLock ? p.charDesc : "";

  let out: string;
  if (zhMode) {
    out = `${shot.zh}，${cam.zh}：${p.desc}。` +
      `画面风格：${style.zh}；光线：${light.zh}；氛围：${p.mood || "剧情向"}。` +
      (cons ? `角色一致性：${cons}（所有镜头保持面部、发型、服装完全一致，可上传角色参考图锁定形象）。` : "") +
      (p.dialogue ? `角色台词（口型同步）："${p.dialogue}"。` : "") +
      `单镜头时长约 ${d} 秒，画面主体清晰，动作自然流畅。`;
    if (p.platform === "kling") out += " 物理运动真实，光影细节细腻，人物动作符合物理规律。";
    if (p.platform === "seedance") out += " 支持多模态参考：可将人物设定图作为参考输入，保证跨镜头一致。";
    if (p.platform === "hailuo") out += " 描述保持精炼聚焦，突出核心动作与情绪。";
  } else {
    out = `${shot.en}, ${cam.en.toLowerCase()}: ${p.desc}. ` +
      `Style: ${style.en}; lighting: ${light.en}; mood: ${p.mood || "dramatic"}. ` +
      (cons ? `Character consistency: ${cons} — keep face, hair and outfit identical across shots (use a character reference image if supported). ` : "") +
      (p.dialogue ? `Character says: "${p.dialogue}" (lip-sync). ` : "") +
      `Single shot, ~${d} seconds, crisp subject, natural motion.`;
    if (p.platform === "sora") out = "Cinematic quality, high fidelity. " + out;
    if (p.platform === "runway") out += " Emphasize stylized motion control and camera language.";
    if (p.platform === "veo") out += ` Audio: ambient sound matching the scene${p.dialogue ? " with clear dialogue" : ""}.`;
  }
  return out;
}

export function negativePrompt(platform: string): string {
  const plat = PLATFORMS.find((x) => x.id === platform);
  return plat && plat.lang === "zh" ? NEG_ZH : NEG_EN;
}
