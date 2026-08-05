import "server-only";

import { TURNSTILE_ACTION } from "@/config/turnstile";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

function expectedHostnames() {
  const configured = process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  const siteUrl = process.env.WEDDING_SITE_URL;
  const hostnames = new Set<string>();

  if (configured) {
    for (const hostname of configured.split(",")) {
      const trimmed = hostname.trim().toLowerCase();
      if (trimmed) hostnames.add(trimmed);
    }
  }

  if (siteUrl) {
    try {
      hostnames.add(new URL(siteUrl).hostname.toLowerCase());
    } catch {
      // Invalid production URL fails hostname checks below.
    }
  }

  if (process.env.NODE_ENV !== "production") {
    hostnames.add("localhost");
    hostnames.add("127.0.0.1");
  }

  return hostnames;
}

export async function validateTurnstileToken({
  token,
  remoteIp,
}: {
  token: string;
  remoteIp?: string;
}) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const normalizedToken = token.trim();

  if (!secret || normalizedToken.length === 0 || normalizedToken.length > 2048) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: normalizedToken,
    idempotency_key: crypto.randomUUID(),
  });

  if (remoteIp) body.set("remoteip", remoteIp);

  let result: TurnstileResponse;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return false;
    result = (await response.json()) as TurnstileResponse;
  } catch {
    return false;
  }

  if (!result.success || result.action !== TURNSTILE_ACTION) return false;

  const hostnames = expectedHostnames();
  if (hostnames.size === 0 || !result.hostname) return false;

  return hostnames.has(result.hostname.toLowerCase());
}
