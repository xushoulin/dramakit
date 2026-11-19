import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/script-formatter", "/prompt-builder", "/blog/ai-short-drama-workflow", "/blog/script-engineering", "/blog/prompt-guide", "/privacy", "/contact"];
  const priority = [1.0, 0.9, 0.9, 0.7, 0.7, 0.7, 0.3, 0.2];
  return routes.map((r, i) => ({
    url: `${SITE_URL}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "/privacy" || r === "/contact" ? "yearly" : r === "" || r.startsWith("/blog") ? "monthly" : "weekly",
    priority: priority[i],
  }));
}
