import Link from "next/link";
import { T } from "@/components/Lang";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  alternates: { canonical: SITE_URL },
};

const toolCards = [
  {
    icon: "📜",
    title: <T zh="剧本结构化转换器" en="Script Formatter" />,
    desc: (
      <T
        zh="把小说、大纲或传统剧本，一键转成 AI 视频模型能直接执行的结构化 JSON：人物圣经、场景表、分镜表、钩子标注。"
        en="Turn novels, outlines or traditional scripts into structured JSON that AI video models can execute: character bible, scene table, shot list and hook markers."
      />
    ),
    cta: <T zh="立即转换 →" en="Format now →" />,
    href: "/script-formatter",
  },
  {
    icon: "🎥",
    title: <T zh="视频 Prompt 构建器" en="Video Prompt Builder" />,
    desc: (
      <T
        zh="选平台、镜头、运镜、光线、风格，生成各模型专用 Prompt。中文平台出中文提示词，海外平台出英文提示词。"
        en="Pick platform, shot type, camera move, lighting and style to get model-specific prompts — Chinese prompts for domestic models, English for the rest."
      />
    ),
    cta: <T zh="立即生成 →" en="Build now →" />,
    href: "/prompt-builder",
  },
];

const whyCards = [
  {
    icon: "🧩",
    title: <T zh="AI 剧本 ≠ 传统剧本" en="AI scripts ≠ traditional scripts" />,
    desc: (
      <T
        zh="AI 短剧剧本必须面向机器生产：人物可视化标签、场景参数、可拆解镜头。传统剧本直接喂给视频模型，出来的画面几乎不可用。"
        en="Microdrama scripts must be machine-ready: visual character tags, scene parameters, decomposable shots. Feed a traditional script to a video model and the output is rarely usable."
      />
    ),
  },
  {
    icon: "🧬",
    title: <T zh="单镜好看不难，一致才难" en="Pretty shots are easy — consistency is hard" />,
    desc: (
      <T
        zh="几十集连载里\u201c角色变脸\u201d是漫剧最头疼的问题。结构化的人物圣经 + 角色一致性锁定提示词，是从拼画质到拼工作流的关键。"
        en="Face drift across dozens of episodes is the biggest pain in AI drama production. A structured character bible plus consistency-locked prompts is what separates workflows from one-off clips."
      />
    ),
  },
  {
    icon: "🔒",
    title: <T zh="本地处理，隐私优先" en="Local processing, privacy first" />,
    desc: (
      <T
        zh="所有解析和生成都在你的浏览器完成，剧本不上传服务器。用完即走，无需账号。"
        en="All parsing and generation happen in your browser. Scripts are never uploaded. No account required."
      />
    ),
  },
];

const articles = [
  {
    icon: "🗺️",
    title: <T zh="AI 短剧制作全流程：八步走通" en="The AI Short Drama Production Workflow in 8 Steps" />,
    desc: (
      <T
        zh="从创意到成片的完整工作流：剧本 → 人物/场景圣经 → 分镜 → 视频生成 → 配音 → 剪辑，附各环节工具选型。"
        en="The complete pipeline: script → character/scene bibles → storyboarding → video generation → dubbing → editing, with tool picks for each step."
      />
    ),
    href: "/blog/ai-short-drama-workflow",
  },
  {
    icon: "📐",
    title: <T zh="剧本工程化：把故事变成可执行的分镜 JSON" en="Script Engineering: Story to Executable Storyboard JSON" />,
    desc: (
      <T
        zh="为什么 AI 短剧需要 JSON 剧本？人物圣经、场景圣经、分镜表长什么样？如何用结构化转换器 5 分钟完成。"
        en="Why AI drama needs JSON scripts, what a character bible and shot list look like, and how to produce one in 5 minutes with our formatter."
      />
    ),
    href: "/blog/script-engineering",
  },
  {
    icon: "💡",
    title: <T zh="视频模型 Prompt 指南：Seedance vs 可灵 vs Sora" en="Video Model Prompt Guide: Seedance vs Kling vs Sora" />,
    desc: (
      <T
        zh="六大主流视频模型的提示词差异、角色一致性写法，以及\u201c分镜分级\u201d省下 40% 渲染成本的技巧。"
        en="Prompt differences across six mainstream video models, how to write character consistency, and \u201cshot tiering\u201d to cut render cost by ~40%."
      />
    ),
    href: "/blog/prompt-guide",
  },
];

const faqs = [
  {
    qZh: "这个工具免费吗？",
    qEn: "Is this free?",
    aZh: "是，全部免费。所有处理均在浏览器本地完成，剧本不会上传到任何服务器。",
    aEn: "Yes, completely free. Everything runs locally in your browser; scripts are never uploaded to any server.",
  },
  {
    qZh: "生成的 JSON 能直接喂给视频模型吗？",
    qEn: "Can I feed the JSON directly to a video model?",
    aZh: "JSON 是给“人 + AI 工作流”用的中间格式：每一场戏、每个镜头都有可直接复制进即梦 / 可灵 / Sora 的 videoPrompt 字段，配合 Prompt 构建器可进一步定制。",
    aEn: "The JSON is an intermediate format for your human + AI workflow: every scene and shot carries a videoPrompt field you can paste straight into Jimeng / Kling / Sora, and refine with the Prompt Builder.",
  },
  {
    qZh: "支持英文剧本吗？",
    qEn: "Do you support English scripts?",
    aZh: "支持。转换器同时识别中文（第X集 / 内景 / 角色：台词）和英文（Episode / INT. / CHARACTER: line）格式。",
    aEn: "Yes. The formatter recognizes both Chinese (第X集 / 内景 / 角色：台词) and English (Episode / INT. / CHARACTER: line) conventions.",
  },
  {
    qZh: "AI 短剧出海怎么做？",
    qEn: "How do I take an AI drama overseas?",
    aZh: "先看教程第三篇的 Prompt 指南；出海译制建议在结构化 JSON 的基础上逐镜翻译提示词，保持角色视觉标签不变。",
    aEn: "Start with guide #3. For localization, translate prompts shot by shot from the structured JSON while keeping visual character tags unchanged.",
  },
];

// Server-rendered JSON-LD for rich results (crawlers don't execute JS).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL,
      name: "DramaKit",
      description: "Free AI short drama tools: script formatter and video prompt builder.",
      inLanguage: ["zh-CN", "en"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": SITE_URL + "/#app",
      name: "DramaKit",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web browser",
      url: SITE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "AI script to storyboard JSON",
        "Character bible and scene table generation",
        "Video prompt builder for Seedance, Kling, Hailuo, Sora, Runway, Veo",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": SITE_URL + "/#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.qZh,
        acceptedAnswer: { "@type": "Answer", text: f.aZh },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="hero">
        <div className="container">
          <span className="badge">
            <T zh="AI 短剧 · 免费在线工具" en="AI Short Drama · Free Online Tools" />
          </span>
          <h1>
            <T
              zh="把故事变成 AI 能直接执行的剧本"
              en="Turn any story into a script AI video models can execute"
            />
          </h1>
          <p>
            <T
              zh="剧本工程化结构化 + 视频模型 Prompt 构建，覆盖 Seedance、可灵、海螺、Sora、Runway、Veo。全程浏览器本地处理，无需注册。"
              en="Script engineering to structured JSON, plus prompt building for Seedance, Kling, Hailuo, Sora, Runway and Veo. Runs 100% in your browser — no signup."
            />
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/script-formatter">
              <T zh="开始结构化剧本" en="Format a script" />
            </Link>
            <Link className="btn btn-ghost" href="/prompt-builder">
              <T zh="构建视频 Prompt" en="Build a video prompt" />
            </Link>
          </div>
        </div>
      </header>

      <section>
        <div className="container">
          <h2 className="sec-title"><T zh="两个核心工具" en="Two core tools" /></h2>
          <p className="sec-sub"><T zh="免费使用，数据不出你的浏览器" en="Free to use — your data never leaves the browser" /></p>
          <div className="grid">
            {toolCards.map((c) => (
              <div className="card" key={c.href}>
                <div className="icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link href={c.href}>{c.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <h2 className="sec-title"><T zh="为什么做这两个工具" en="Why these two tools" /></h2>
          <p className="sec-sub">&nbsp;</p>
          <div className="grid">
            {whyCards.map((c, i) => (
              <div className="card" key={i}>
                <div className="icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="guides">
        <div className="container">
          <h2 className="sec-title"><T zh="实操教程" en="Hands-on guides" /></h2>
          <p className="sec-sub"><T zh="从零开始做一部 AI 短剧" en="From zero to a finished AI short drama" /></p>
          <div className="grid">
            {articles.map((c) => (
              <div className="card" key={c.href}>
                <div className="icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link href={c.href}>Read →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="sec-title"><T zh="常见问题" en="FAQ" /></h2>
          <p className="sec-sub">&nbsp;</p>
          {faqs.map((f, i) => (
            <details key={i}>
              <summary><T zh={f.qZh} en={f.qEn} /></summary>
              <p><T zh={f.aZh} en={f.aEn} /></p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
