import "server-only";

import type { PublicWeddingGuest, GuestType } from "@/types/guest";

export type WeddingGuest = {
  id: string;
  displayName: string;
  greeting: string;
  reservedSeats: number;
  guestType: GuestType;
  entourageRole?: string;
  childrenPermitted: boolean | null;
  invitationCodeHash: string;
};

const guests = [
  {
    id: "demo-guest",
    displayName: "Diwatek Demonstration Guest",
    greeting: "Dear Guest",
    reservedSeats: 2,
    guestType: "Couple",
    childrenPermitted: false,
    invitationCodeHash: "",
  },
  {
    id: "santos-family",
    displayName: "Mr. and Mrs. Daniel Santos and Family",
    greeting: "Dear Santos Family",
    reservedSeats: 4,
    guestType: "Family",
    childrenPermitted: true,
    invitationCodeHash:
      "2a28b31cd2c4d4bbd222938e992ea0d9df405a909c5fd7a4116ca875989db6bc",
  },
  {
    id: "ana-marie-cruz",
    displayName: "Ms. Ana Marie Cruz",
    greeting: "Dear Ana",
    reservedSeats: 1,
    guestType: "Individual",
    childrenPermitted: null,
    invitationCodeHash:
      "becd1bb9040661df19e2df2d1d4fa43a1b499f7170585005a23a1a415dd0f48b",
  },
  {
    id: "garcia-couple",
    displayName: "Mr. Roberto Garcia and Mrs. Elena Garcia",
    greeting: "Dear Roberto and Elena",
    reservedSeats: 2,
    guestType: "Couple",
    childrenPermitted: false,
    invitationCodeHash:
      "325a7162a36f4f76b5b7742f745c63d6f0b7e562a17a94c8c62b63a176557025",
  },
  {
    id: "joshua-mendoza",
    displayName: "Mr. Joshua Mendoza",
    greeting: "Dear Joshua",
    reservedSeats: 1,
    guestType: "Entourage",
    entourageRole: "Groomsman",
    childrenPermitted: null,
    invitationCodeHash:
      "c9aa1b15482852e853de5bf60f3cbbf8cef91a8b5f51abdd9c441d3027daa96c",
  },
  {
    id: "maria-isabel-flores",
    displayName: "Ms. Maria Isabel Flores",
    greeting: "Dear Isabel",
    reservedSeats: 1,
    guestType: "Entourage",
    entourageRole: "Bridesmaid",
    childrenPermitted: null,
    invitationCodeHash:
      "20e487373c0874ee888f43cdc7a01fc2cd99a56fb85a36d8fb5b36bb1fe784f7",
  },
] satisfies WeddingGuest[];

const DEMO_GUEST_ID = "demo-guest";

export function getGuestById(id: string | undefined) {
  return guests.find((guest) => guest.id === id) ?? null;
}

export function toPublicGuest(guest: WeddingGuest): PublicWeddingGuest {
  return {
    id: guest.id,
    displayName: guest.displayName,
    greeting: guest.greeting,
    reservedSeats: guest.reservedSeats,
    guestType: guest.guestType,
    entourageRole: guest.entourageRole,
    childrenPermitted: guest.childrenPermitted,
  };
}

export function getGuestChildrenText(guest: PublicWeddingGuest) {
  if (guest.childrenPermitted === true) return "Included in your reservation";
  if (guest.childrenPermitted === false) {
    return "This invitation is reserved for the named guests.";
  }
  return "Not applicable for this invitation.";
}

export async function findGuestByInvitationCode(code: string) {
  const normalizedCode = normalizeInvitationCode(code);
  if (normalizedCode.length < 12 || normalizedCode.length > 128) return null;

  const demoCode = normalizeInvitationCode(
    process.env.NEXT_PUBLIC_WEDDING_DEMO_CODE ?? "",
  );
  if (
    process.env.NEXT_PUBLIC_WEDDING_DEMO_MODE === "true" &&
    demoCode &&
    normalizedCode === demoCode
  ) {
    return getGuestById(DEMO_GUEST_ID);
  }

  const hash = await hashInvitationCode(normalizedCode);
  return guests.find((guest) => guest.invitationCodeHash === hash) ?? null;
}

export function normalizeInvitationCode(code: string) {
  return code.trim().replace(/\s+/g, "").toUpperCase().slice(0, 128);
}

async function hashInvitationCode(normalizedCode: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalizedCode),
  );
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
