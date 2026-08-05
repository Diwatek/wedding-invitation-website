"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

function sanitizeId(id: string) {
  return id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

export function GuestPassActions({ guestId }: { guestId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function downloadPass() {
    const pass = document.getElementById("guest-pass-card");
    if (!pass) return;

    setError("");
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(pass, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#FFFDF8",
      });
      const link = document.createElement("a");
      link.download = `miguel-camille-guest-pass-${sanitizeId(guestId)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("The guest pass image could not be prepared. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="utility-actions guest-pass-controls print-hidden">
      <button type="button" onClick={downloadPass} disabled={isGenerating}>
        {isGenerating ? "Preparing Guest Pass..." : "Download Guest Pass"}
      </button>
      <button type="button" onClick={() => window.print()}>
        Print Guest Pass
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
