import { ADSENSE_ID } from "@/lib/site";

// Google AdSense ads.txt. Served from /ads.txt.
// Set NEXT_PUBLIC_ADSENSE_ID (e.g. ca-pub-1234...) to publish a valid line.
export function GET() {
  const body = ADSENSE_ID
    ? `google.com, ${ADSENSE_ID}, DIRECT, f08c47fec0942fa0\n`
    : `# AdSense publisher ID not configured yet.\n# Set NEXT_PUBLIC_ADSENSE_ID in Vercel env vars to activate.\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
