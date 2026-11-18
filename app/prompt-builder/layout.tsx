import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "视频 Prompt 构建器 — Seedance / 可灵 / Sora | Video Prompt Builder",
  description:
    "按平台、镜头、运镜、光线、风格生成 AI 视频模型专用提示词，支持 Seedance、可灵、海螺、Sora、Runway、Veo，附角色一致性锁定与负面提示词。Free prompt builder for AI video models.",
  alternates: { canonical: `${SITE_URL}/prompt-builder` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
