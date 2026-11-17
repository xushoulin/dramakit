"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

interface LangCtx {
  lang: Lang;
  L: (zh: string, en: string) => string;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangCtx>({
  lang: "zh",
  L: (zh) => zh,
  setLang: () => {},
});

export function useLang() {
  return useContext(Ctx);
}

/**
 * Manages the current language (persisted in localStorage) and applies
 * .lang-zh / .lang-en classes on <html>. Visible content itself is rendered
 * in BOTH languages server-side via <T/>, then switched purely with CSS —
 * so crawlers always get the full text without JS.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("aidrama-lang");
    if (saved === "zh" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const h = document.documentElement;
    h.classList.remove("lang-zh", "lang-en");
    h.classList.add(`lang-${lang}`);
    h.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem("aidrama-lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const L = (zh: string, en: string) => (lang === "zh" ? zh : en);

  return <Ctx.Provider value={{ lang, L, setLang }}>{children}</Ctx.Provider>;
}

/** Bilingual inline content: both languages SSR'd, CSS picks the visible one. */
export function T({
  zh,
  en,
  as,
  className,
}: {
  zh: ReactNode;
  en?: ReactNode;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "b";
  className?: string;
}) {
  const Tag = as || "span";
  return (
    <Tag className={className}>
      <span className="lang-zh">{zh}</span>
      <span className="lang-en">{en ?? zh}</span>
    </Tag>
  );
}

export function LangToggle() {
  const { lang, setLang, L } = useLang();
  return (
    <button id="langToggle" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
      {L("English", "中文")}
    </button>
  );
}
