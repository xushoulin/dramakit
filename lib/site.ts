// Central config for domain + third-party integrations.
// All values are build-time env vars with sane defaults; no code changes needed to switch.

// Canonical origin — canonical tags / sitemap / robots / JSON-LD all derive from this.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://aidrama.shoulin.shop"
).replace(/\/$/, "");

// Google Search Console verification token (HTML meta tag method).
// Empty => no tag emitted. You can also verify via DNS TXT in Spaceship instead.
export const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_TOKEN || "";

// AdSense publisher ID, e.g. "ca-pub-1234567890abcdef".
// Empty => no ad script and ads.txt is a placeholder until configured.
export const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "";
