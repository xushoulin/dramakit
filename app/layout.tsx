import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/components/Lang";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE_URL, GSC_TOKEN, ADSENSE_ID } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DramaKit — AI 短剧免费工具箱 | AI Short Drama Free Tools",
    template: "%s | DramaKit",
  },
  description:
    "免费的 AI 短剧工具：剧本工程化结构化转换器、视频模型 Prompt 构建器（Seedance / 可灵 / 海螺 / Sora / Runway / Veo）。浏览器本地处理，无需注册。Free AI short drama tools, 100% in-browser.",
  keywords: [
    "AI短剧", "剧本结构化", "分镜JSON", "Seedance prompt", "可灵 prompt",
    "AI short drama", "microdrama script", "storyboard JSON",
  ],
  openGraph: {
    siteName: "DramaKit",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
  },
  ...(GSC_TOKEN ? { verification: { google: GSC_TOKEN } } : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const antiFlashScript = `try{var l=localStorage.getItem('aidrama-lang')||'zh';var h=document.documentElement;h.classList.remove('lang-zh','lang-en');h.classList.add('lang-'+l);}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body>
        {ADSENSE_ID && (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <LangProvider>
          <Nav />
          {children}
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
