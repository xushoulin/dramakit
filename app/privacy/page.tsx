import type { Metadata } from "next";
import { T } from "@/components/Lang";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "隐私政策 | Privacy Policy",
  description:
    "DramaKit 隐私政策：所有工具在浏览器本地处理，剧本不上传服务器；说明 Cookie 与 Google AdSense 的使用。",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="container prose">
      <p className="breadcrumb"><T zh="首页" en="Home" /> / Privacy</p>

      <div className="lang-zh">
        <h1>隐私政策</h1>
        <p className="meta">更新于 2026-11-17</p>

        <h2>我们如何处理你的数据</h2>
        <p>
          DramaKit 的所有核心功能（剧本解析、JSON 生成、Prompt 构建）均在浏览器本地完成。
          你粘贴的剧本内容不会上传到我们的服务器，也不会被存储——刷新页面即消失。
        </p>

        <h2>本地存储</h2>
        <p>我们使用 localStorage 仅保存你的语言偏好（中文/English），不保存任何剧本内容或个人信息。</p>

        <h2>Cookie 与第三方广告</h2>
        <p>
          本站可能使用 Google AdSense 展示广告。Google 及其合作伙伴可能使用 Cookie
          根据你访问本站及第三方网站的情况投放个性化广告。你可以访问{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google 广告设置</a>
          {" "}停用个性化广告，或在{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google 合作伙伴网站政策</a>
          {" "}了解更多。
        </p>

        <h2>外部链接</h2>
        <p>本站文章可能包含指向第三方网站的链接，我们对其隐私实践不承担责任。</p>

        <h2>联系</h2>
        <p>如对本政策有疑问，请通过站内渠道联系我们。</p>
      </div>

      <div className="lang-en">
        <h1>Privacy Policy</h1>
        <p className="meta">Updated 2026-11-17</p>

        <h2>How we handle your data</h2>
        <p>
          All core DramaKit features (script parsing, JSON generation, prompt building) run entirely
          in your browser. Scripts you paste are never uploaded to our servers and never stored —
          they vanish when you refresh.
        </p>

        <h2>Local storage</h2>
        <p>
          We use localStorage solely to remember your language preference (Chinese/English). No
          script content or personal information is stored.
        </p>

        <h2>Cookies and third-party advertising</h2>
        <p>
          This site may display ads via Google AdSense. Google and its partners may use cookies to
          serve personalized ads based on your visits to this and other sites. You can opt out of
          personalized advertising at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>,
          or learn more in the{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google partner-sites policy</a>.
        </p>

        <h2>External links</h2>
        <p>Articles on this site may link to third-party websites; we are not responsible for their privacy practices.</p>

        <h2>Contact</h2>
        <p>Questions about this policy? Reach us through the site&rsquo;s contact channel.</p>
      </div>
    </div>
  );
}
