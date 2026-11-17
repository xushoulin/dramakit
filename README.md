# DramaKit — AI 短剧免费工具箱

双语（中/EN）静态工具站，纯前端零依赖，定位 AI 短剧生产链路的"上游缝隙"：剧本工程化 + 视频 Prompt 构建。

## 页面结构

| 页面 | 说明 |
|---|---|
| `index.html` | 首页：工具卡片 + 教程 + FAQ（FAQ JSON-LD 可后续加） |
| `script-formatter.html` | 剧本结构化转换器：文本 → 分镜 JSON（人物圣经/场景表/分镜表/videoPrompt） |
| `prompt-builder.html` | 视频 Prompt 构建器：Seedance/可灵/海螺/Sora/Runway/Veo 六平台专用提示词 |
| `blog/*.html` | 3 篇双语 SEO 文章（制作流程 / 剧本工程化 / Prompt 指南） |
| `privacy.html` | 隐私政策（AdSense 审核项） |

## 特性

- 全部浏览器本地处理，无后端、无 API Key、零成本（Vercel 静态托管）
- i18n：`js/i18n.js` 中英切换，localStorage 记忆，`data-i18n` 词条 + `.lang-zh/.lang-en` 内容块
- 解析器识别中文（第X集/内景/角色：台词）与英文（Episode/INT./CHARACTER: line）格式
- 示例一键载入，JSON 可复制/下载

## 部署（Vercel）

```bash
cd aidrama-tools
vercel --prod
```

或直接把 `aidrama-tools` 文件夹拖进 Vercel 控制台（框架选 Other）。

## 上线前 TODO

1. 把 `robots.txt`、`sitemap.xml`、各页 `canonical` 里的 `https://aidrama.shoulin.shop` 换成实际绑定域名
2. Spaceship 加 DNS（A 记录 `76.76.21.21` 或 CNAME `cname.vercel-dns.com`）
3. Vercel 绑定域名后提交 GSC、接入 AdSense（`ads.txt` 放站点根目录）
4. 后续可加：FAQ JSON-LD 结构化数据、AdSense 代码位、Google Analytics
