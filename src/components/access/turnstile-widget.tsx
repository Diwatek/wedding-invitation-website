"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          theme: "auto";
          size: "flexible" | "compact";
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const TURNSTILE_WIDGET_RESET_EVENT = "diwatek-turnstile-reset";

export function TurnstileWidget({
  siteKey,
  action,
  onTokenChange,
}: {
  siteKey?: string;
  action: string;
  onTokenChange: (token: string) => void;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const reactId = useId();
  const [status, setStatus] = useState(
    siteKey
      ? "Security verification is loading."
      : "Turnstile is not configured for local testing.",
  );

  useEffect(() => {
    if (!siteKey) return;

    function resetWidget() {
      onTokenChange("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setStatus("Security verification was reset. Please verify again.");
      }
    }

    window.addEventListener(TURNSTILE_WIDGET_RESET_EVENT, resetWidget);
    return () => window.removeEventListener(TURNSTILE_WIDGET_RESET_EVENT, resetWidget);
  }, [onTokenChange, siteKey]);

  function renderWidget() {
    if (!siteKey || !elementRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(elementRef.current, {
      sitekey: siteKey,
      action,
      theme: "auto",
      size: "flexible",
      callback: (token) => {
        onTokenChange(token);
        setStatus("Security verification completed.");
      },
      "expired-callback": () => {
        onTokenChange("");
        setStatus("Security verification expired. Please verify again.");
      },
      "error-callback": () => {
        onTokenChange("");
        setStatus("Security verification could not be completed. Please try again.");
      },
    });
  }

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  return (
    <div className="turnstile-block">
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderWidget}
        />
      ) : null}
      <div ref={elementRef} id={`turnstile-${reactId}`} />
      <p className="turnstile-status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
