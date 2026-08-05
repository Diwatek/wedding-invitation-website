import "server-only";

import { errors, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  findGuestByInvitationCode,
  getGuestById,
  toPublicGuest,
} from "@/data/guest-invitations.server";
import type { PublicWeddingGuest } from "@/types/guest";

export const ACCESS_COOKIE_NAME = "diwatek_wedding_access";
export const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const GUEST_PASS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const ISSUER = "diwatek-wedding";
const ACCESS_AUDIENCE = "private-invitation";
const PASS_AUDIENCE = "guest-pass-verification";
const WEDDING_ID = "miguel-camille-2027";

type AccessPayload = {
  scope?: string;
  guestId?: string;
};

type GuestPassPayload = {
  type?: string;
  guestId?: string;
  weddingId?: string;
};

function getSecretKey(name: "WEDDING_SESSION_SECRET" | "WEDDING_GUEST_PASS_SECRET") {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} is not configured.`);
  }

  return new TextEncoder().encode(secret);
}

export async function validateInvitationCode(code: string) {
  const guest = await findGuestByInvitationCode(code);
  return guest ? toPublicGuest(guest) : null;
}

export async function createAccessToken(guestId: string) {
  return new SignJWT({ scope: "wedding-access", guestId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(ACCESS_AUDIENCE)
    .setExpirationTime(`${ACCESS_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey("WEDDING_SESSION_SECRET"));
}

export async function getGuestFromAccessToken(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<AccessPayload>(
      token,
      getSecretKey("WEDDING_SESSION_SECRET"),
      {
        issuer: ISSUER,
        audience: ACCESS_AUDIENCE,
      },
    );

    if (payload.scope !== "wedding-access" || !payload.guestId) return null;

    const guest = getGuestById(payload.guestId);
    return guest ? toPublicGuest(guest) : null;
  } catch {
    return null;
  }
}

export async function getWeddingGuestAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return getGuestFromAccessToken(token);
}

export async function hasWeddingAccess() {
  return Boolean(await getWeddingGuestAccess());
}

export async function setAccessCookie(guestId: string) {
  const cookieStore = await cookies();
  const token = await createAccessToken(guestId);

  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_MAX_AGE_SECONDS,
  });
}

export async function clearAccessCookie() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function createPassReference(guestId: string) {
  let hash = 0;
  for (const char of guestId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `MC27-${hash.toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

export async function createGuestPassToken(guestId: string) {
  return new SignJWT({
    type: "guest-pass",
    guestId,
    weddingId: WEDDING_ID,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(PASS_AUDIENCE)
    .setExpirationTime(`${GUEST_PASS_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey("WEDDING_GUEST_PASS_SECRET"));
}

export type PassVerificationResult =
  | { status: "valid"; guest: PublicWeddingGuest; reference: string }
  | { status: "expired" }
  | { status: "invalid" };

export async function verifyGuestPassToken(
  token: string | undefined,
): Promise<PassVerificationResult> {
  if (!token) return { status: "invalid" };

  try {
    const { payload } = await jwtVerify<GuestPassPayload>(
      token,
      getSecretKey("WEDDING_GUEST_PASS_SECRET"),
      {
        issuer: ISSUER,
        audience: PASS_AUDIENCE,
      },
    );

    if (
      payload.type !== "guest-pass" ||
      payload.weddingId !== WEDDING_ID ||
      !payload.guestId
    ) {
      return { status: "invalid" };
    }

    const guest = getGuestById(payload.guestId);
    if (!guest) return { status: "invalid" };

    return {
      status: "valid",
      guest: toPublicGuest(guest),
      reference: createPassReference(guest.id),
    };
  } catch (error) {
    if (error instanceof errors.JWTExpired) return { status: "expired" };
    return { status: "invalid" };
  }
}
