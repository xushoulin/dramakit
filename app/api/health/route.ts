import { NextResponse } from "next/server";

/** GET /api/health — liveness probe for future backend integrations. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "dramakit", time: new Date().toISOString() });
}
