import type { Metadata } from "next";
import { T } from "@/components/Lang";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "联系我们 | Contact",
  description: "Contact DramaKit — report issues, suggest features or ask questions about the AI short drama tools.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

const REPO = "https://github.com/xushoulin/dramakit";

export default function ContactPage() {
  return (
    <div className="container prose">
      <p className="breadcrumb"><T zh="首页" en="Home" /> / <T zh="联系我们" en="Contact" /></p>

      <div className="lang-zh">
        <h1>联系我们</h1>
        <p className="meta">DramaKit 由个人开发者维护</p>

        <h2>如何联系我们</h2>
        <p>
          有问题、功能建议或内容勘误？请通过开源仓库的 Issue 联系我们——这是最直接、公开可查的渠道：
        </p>
        <p>
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">在 GitHub 上提交 Issue →</a>
        </p>
        <p>
          提交时请尽量说明你遇到的问题、使用的浏览器，以及复现步骤，这样能更快帮你解决。
        </p>

        <h2>关于运营主体</h2>
        <p>
          DramaKit 是一个免费的个人开源项目，所有工具均在浏览器本地运行。我们没有客服热线或邮寄地址，
          GitHub Issue 是我们唯一且有效的联系方式。
        </p>
      </div>

      <div className="lang-en">
        <h1>Contact</h1>
        <p className="meta">DramaKit is maintained by an independent developer</p>

        <h2>How to reach us</h2>
        <p>
          Questions, feature requests or corrections? Reach us through the issues tracker of our
          open-source repository — the most direct and publicly visible channel:
        </p>
        <p>
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">Open an issue on GitHub →</a>
        </p>
        <p>
          Please include what went wrong, your browser, and steps to reproduce so we can help faster.
        </p>

        <h2>About the operator</h2>
        <p>
          DramaKit is a free, personal open-source project. All tools run locally in your browser.
          We have no phone line or mailing address; GitHub issues is our only and effective contact channel.
        </p>
      </div>
    </div>
  );
}
