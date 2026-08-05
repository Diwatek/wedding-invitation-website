import "server-only";

const DEFAULT_SITE_URL = "https://wedding.diwatek.com";

export function getWeddingSiteUrl() {
  const configured = process.env.WEDDING_SITE_URL ?? DEFAULT_SITE_URL;

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:") return DEFAULT_SITE_URL;
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
