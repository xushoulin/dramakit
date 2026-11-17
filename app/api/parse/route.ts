import { NextResponse } from "next/server";
import { parseScript, type ParseOptions } from "@/lib/parser";

/**
 * POST /api/parse
 * Body: { text: string, options?: { title?, genre?, style?, hook? } }
 * Returns the structured storyboard JSON.
 *
 * 当前实现：纯规则解析（isomorphic parser）。
 * TODO(后端演进): 把 parseScript 换成 LLM 管道（百炼/OpenAI）——
 * 前端无需改动，接口契约保持不变。
 */
export async function POST(req: Request) {
  let body: { text?: string; options?: ParseOptions };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (text.length > 200_000) {
    return NextResponse.json({ error: "text too large (max 200k chars)" }, { status: 413 });
  }

  const drama = parseScript(text, body.options ?? {});
  return NextResponse.json(drama);
}
