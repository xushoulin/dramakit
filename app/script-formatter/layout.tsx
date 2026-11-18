import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "剧本结构化转换器 — AI 短剧分镜 JSON | Script Formatter",
  description:
    "把小说、大纲或剧本一键转成 AI 视频模型可执行的结构化 JSON：人物圣经、场景表、分镜表和 videoPrompt 字段。中英双语解析，浏览器本地处理。Free AI script to storyboard JSON formatter.",
  alternates: { canonical: `${SITE_URL}/script-formatter` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
