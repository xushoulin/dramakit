"use client";

import Link from "next/link";
import { T } from "@/components/Lang";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <p>
          <T
            zh="DramaKit — 免费的 AI 短剧创作工具集"
            en="DramaKit — free tooling for AI short drama creators"
          />
        </p>
        <p>
          <Link href="/script-formatter"><T zh="剧本结构化" en="Script Formatter" /></Link>
          <Link href="/prompt-builder"><T zh="Prompt 构建器" en="Prompt Builder" /></Link>
          <Link href="/privacy"><T zh="隐私政策" en="Privacy" /></Link>
        </p>
        <p>
          <T
            zh="© 2026 DramaKit. 所有处理均在浏览器本地完成。"
            en="© 2026 DramaKit. All processing happens locally in your browser."
          />
        </p>
      </div>
    </footer>
  );
}
