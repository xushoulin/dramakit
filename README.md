# DramaKit — AI 短剧免费工具箱

双语（中/EN）工具站，**Next.js 15 + React 19 + TypeScript（App Router）**，定位 AI 短剧生产链路的"上游缝隙"：剧本工程化 + 视频 Prompt 构建。

## 路由结构

| 路由 | 说明 |
|---|---|
| `/` | 首页：工具卡片 + 教程 + FAQ |
| `/script-formatter` | 剧本结构化转换器：文本 → 分镜 JSON（人物圣经/场景表/分镜表/videoPrompt） |
| `/prompt-builder` | 视频 Prompt 构建器：Seedance/可灵/海螺/Sora/Runway/Veo 六平台专用提示词 |
| `/blog/*` | 3 篇双语 SEO 文章（制作流程 / 剧本工程化 / Prompt 指南） |
| `/privacy` | 隐私政策（AdSense 审核项） |
| `/api/parse` | **POST** 剧本解析接口（前端工具调用） |
| `/api/health` | **GET** 健康检查 |
| `/robots.txt` `/sitemap.xml` | 由 `app/robots.ts` / `app/sitemap.ts` 动态生成 |

## 后端接口演进路径

解析器是 isomorphic 纯函数（`lib/parser.ts`），当前由 `/api/parse` 服务端执行。
后续接 LLM 时只需改 `app/api/parse/route.ts` 内部实现（如换成百炼/OpenAI 管道），
接口契约不变、前端零改动：

```
POST /api/parse
Body: { "text": "剧本原文", "options": { "title", "genre", "style", "hook" } }
Res:  Drama JSON（characters / scenes / shots[].videoPrompt / hooks / stats）
```

## i18n 方案

- 可见内容双份 SSR（`components/Lang.tsx` 的 `<T zh en/>`），CSS `.lang-zh/.lang-en` 切换 → 爬虫无 JS 也能抓全内容
- 动态文案/提示走 `useLang().L(zh, en)`
- 语言偏好存 localStorage，`layout.tsx` 内联脚本防闪烁

## 本地开发

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 生产构建
```

## 部署（Vercel）

已接 GitHub 自动部署：push 到 `main` 即触发。框架预设 Next.js（仓库内 `vercel.json` 已强制声明）。
线上地址：https://aidrama.shoulin.shop （自有域名，待 Spaceship DNS 生效）。

## 域名 / 第三方集成配置

全部通过构建时环境变量控制（`lib/site.ts`），**无需改代码**，改完在 Vercel 重新部署即生效：

| 环境变量 | 作用 | 默认 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical / sitemap / robots / JSON-LD 的域名 | `https://aidrama.shoulin.shop` |
| `NEXT_PUBLIC_GSC_TOKEN` | Google 站点验证 meta 标签；留空则不输出 | 空 |
| `NEXT_PUBLIC_ADSENSE_ID` | AdSense 发布商 ID（如 `ca-pub-xxx`），驱动广告脚本 + `/ads.txt`；留空则不注入 | 空 |

在 Vercel 项目 → Settings → Environment Variables 添加，然后 Redeploy。

## 上线收尾清单

- [x] FAQPage / WebSite / SoftwareApplication JSON-LD（首页服务端直出）
- [x] 自有域名 `aidrama.shoulin.shop` 作为默认 canonical（待 DNS 生效）
- [x] GSC 验证 meta 挂载点（填 `NEXT_PUBLIC_GSC_TOKEN` 生效；也可改用 DNS TXT 验证，不动代码）
- [x] AdSense 脚本 + `/ads.txt` 挂载点（填 `NEXT_PUBLIC_ADSENSE_ID` 生效）
- [ ] Spaceship 加 CNAME `aidrama → cname.vercel-dns.com`，Vercel → Domains 绑定 `aidrama.shoulin.shop`
- [ ] GSC 添加资源（域名前缀）并提交 `/sitemap.xml`
- [ ] AdSense 审核通过后填发布商 ID 环境变量并重新部署
