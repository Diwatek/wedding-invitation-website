"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  clearAccessCookie,
  setAccessCookie,
  validateInvitationCode,
} from "@/lib/wedding-access";
import { validateTurnstileToken } from "@/lib/turnstile";

export type AccessActionState = {
  ok: boolean;
  error?: string;
};

export async function verifyWeddingInvitationCode(
  code: string,
  turnstileToken: string,
): Promise<AccessActionState> {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const remoteIp = forwardedFor?.split(",")[0]?.trim();
  const turnstileOk = await validateTurnstileToken({
    token: turnstileToken,
    remoteIp,
  });

  if (!turnstileOk) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ok: false,
      error: "Security verification could not be completed. Please try again.",
    };
  }

  const guest = await validateInvitationCode(code);

  if (!guest) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return {
      ok: false,
      error:
        "The invitation code could not be verified. Please check the code provided with your invitation.",
    };
  }

  await setAccessCookie(guest.id);
  revalidatePath("/");
  return { ok: true };
}

export async function lockWeddingInvitation() {
  await clearAccessCookie();
  revalidatePath("/");
  revalidatePath("/before-the-wedding");
  revalidatePath("/wedding-memories");
  revalidatePath("/guest-pass");
  revalidatePath("/rsvp");
  return { ok: true };
}
