"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

const EXPORT_WIDTH = 680;

function sanitizeId(id: string) {
  return id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();

      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
}

export function GuestPassActions({ guestId }: { guestId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function downloadPass() {
    const pass = document.getElementById("guest-pass-card");
    if (!pass) return;

    setError("");
    setIsGenerating(true);
    let exportContainer: HTMLDivElement | null = null;

    try {
      await document.fonts.ready;

      const clone = pass.cloneNode(true) as HTMLElement;
      clone.classList.add("guest-pass-export");

      exportContainer = document.createElement("div");
      exportContainer.className = "guest-pass-export-container";
      exportContainer.appendChild(clone);
      document.body.appendChild(exportContainer);

      await waitForImages(clone);

      const exportHeight = clone.scrollHeight;
      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#FFFDF8",
        width: EXPORT_WIDTH,
        height: exportHeight,
        style: {
          width: `${EXPORT_WIDTH}px`,
          maxWidth: "none",
          margin: "0",
          transform: "none",
        },
      });
      const link = document.createElement("a");
      link.download = `miguel-camille-guest-pass-${sanitizeId(guestId)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("The guest pass image could not be prepared. Please try again.");
    } finally {
      exportContainer?.remove();
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
      <p className="sr-only" aria-live="polite">
        {isGenerating ? "Preparing guest pass download." : ""}
      </p>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
