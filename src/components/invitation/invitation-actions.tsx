"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { lockWeddingInvitation } from "@/actions/wedding-access-actions";

export function InvitationUtilityActions() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function downloadInvitation() {
    const card = document.getElementById("invitation-card");
    if (!card) return;

    setError("");
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(card, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#FFFDF8",
      });
      const link = document.createElement("a");
      link.download = "miguel-camille-wedding-invitation.png";
      link.href = dataUrl;
      link.click();
    } catch {
      setError("The invitation image could not be prepared. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function lockInvitation() {
    startTransition(async () => {
      await lockWeddingInvitation();
      sessionStorage.removeItem("diwatek_invitation_opened");
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <div className="utility-actions print-hidden">
      <button type="button" onClick={downloadInvitation} disabled={isGenerating}>
        {isGenerating ? "Preparing Invitation..." : "Download Invitation"}
      </button>
      <button type="button" onClick={() => window.print()}>
        Print Invitation
      </button>
      <button type="button" onClick={lockInvitation} disabled={isPending}>
        Lock Invitation
      </button>
      <p>Digital invitation copy</p>
      <p>
        For a real wedding requiring guest verification, unique guest codes or
        QR passes should be connected to an approved guest list.
      </p>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
