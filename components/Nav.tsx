"use client";

import Link from "next/link";
import { LangToggle, T } from "@/components/Lang";

export function Nav() {
  return (
    <nav>
      <div className="container nav-inner">
        <Link className="brand" href="/">
          Drama<span>Kit</span>
        </Link>
        <div className="nav-links">
          <Link href="/script-formatter"><T zh="剧本结构化" en="Script Formatter" /></Link>
          <Link href="/prompt-builder"><T zh="Prompt 构建器" en="Prompt Builder" /></Link>
          <Link href="/#guides"><T zh="教程" en="Guides" /></Link>
          <Link href="/privacy"><T zh="隐私政策" en="Privacy" /></Link>
          <LangToggle />
        </div>
      </div>
    </nav>
  );
}
