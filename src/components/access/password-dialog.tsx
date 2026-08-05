"use client";

import {
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { verifyWeddingInvitationCode } from "@/actions/wedding-access-actions";
import {
  TURNSTILE_WIDGET_RESET_EVENT,
  TurnstileWidget,
} from "@/components/access/turnstile-widget";
import { TURNSTILE_ACTION } from "@/config/turnstile";

export function PasswordDialog({
  dialogRef,
  openerRef,
  onUnlocked,
  turnstileSiteKey,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  openerRef: RefObject<HTMLButtonElement | null>;
  onUnlocked: () => void;
  turnstileSiteKey?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [demoFeedback, setDemoFeedback] = useState("");
  const [isPending, startTransition] = useTransition();
  const demoModeEnabled = process.env.NEXT_PUBLIC_WEDDING_DEMO_MODE === "true";
  const demoCode = process.env.NEXT_PUBLIC_WEDDING_DEMO_CODE ?? "";
  const showDemoAccess = demoModeEnabled && demoCode.trim().length > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusInput = () =>
      window.setTimeout(() => inputRef.current?.focus(), 0);
    const restoreFocus = () => openerRef.current?.focus();
    dialog.addEventListener("close", restoreFocus);
    dialog.addEventListener("cancel", restoreFocus);
    dialog.addEventListener("toggle", focusInput);

    return () => {
      dialog.removeEventListener("close", restoreFocus);
      dialog.removeEventListener("cancel", restoreFocus);
      dialog.removeEventListener("toggle", focusInput);
    };
  }, [dialogRef, openerRef]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function copyDemoCode() {
    try {
      await navigator.clipboard.writeText(demoCode);
      setDemoFeedback("Demo code copied.");
    } catch {
      setDemoFeedback(
        "Unable to copy automatically. Select the code and copy it manually.",
      );
    }
  }

  function useDemoCode() {
    setCode(demoCode);
    setError("");
    setDemoFeedback("Demo code added.");
    inputRef.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await verifyWeddingInvitationCode(code, turnstileToken);
      if (!result.ok) {
        setError(result.error ?? "The invitation could not be opened.");
        setTurnstileToken("");
        window.dispatchEvent(new Event(TURNSTILE_WIDGET_RESET_EVENT));
        inputRef.current?.focus();
        return;
      }

      setCode("");
      dialogRef.current?.close();
      onUnlocked();
    });
  }

  return (
    <dialog ref={dialogRef} className="password-dialog">
      <form onSubmit={submit}>
        <div>
          <p className="eyebrow">Private invitation</p>
          <h2>Open our private wedding invitation.</h2>
        </div>
        {showDemoAccess ? (
          <section className="demo-access-panel" aria-labelledby="demo-access-title">
            <div className="demo-access-copy">
              <p id="demo-access-title" className="demo-access-label">
                Portfolio Demo Access
              </p>
              <p>
                Use the public demonstration code below to explore this fictional
                wedding website.
              </p>
              <code>{demoCode}</code>
            </div>
            <div className="demo-access-actions">
              <button type="button" onClick={copyDemoCode}>
                Copy Code
              </button>
              <button type="button" onClick={useDemoCode}>
                Use Demo Code
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {demoFeedback}
            </p>
            {demoFeedback ? (
              <p className="demo-feedback" aria-hidden="true">
                {demoFeedback}
              </p>
            ) : null}
          </section>
        ) : null}
        <label htmlFor="invitation-code">Invitation code</label>
        <p id="invitation-code-help" className="field-help">
          Enter the private code included with your invitation.
        </p>
        <div className="password-row">
          <input
            ref={inputRef}
            id="invitation-code"
            name="invitation-code"
            type={showCode ? "text" : "password"}
            autoComplete="one-time-code"
            maxLength={128}
            value={code}
            aria-describedby={
              error ? "invitation-code-help code-error" : "invitation-code-help"
            }
            aria-invalid={error ? "true" : "false"}
            onChange={(event) => setCode(event.target.value)}
            required
          />
          <button
            type="button"
            className="plain-button"
            aria-label={showCode ? "Hide invitation code" : "Show invitation code"}
            onClick={() => setShowCode((current) => !current)}
          >
            {showCode ? "Hide" : "Show"}
          </button>
        </div>
        <TurnstileWidget
          siteKey={turnstileSiteKey}
          action={TURNSTILE_ACTION}
          onTokenChange={setTurnstileToken}
        />
        {error ? (
          <p id="code-error" role="alert" className="form-error">
            {error}
          </p>
        ) : null}
        <div className="dialog-actions">
          <button type="submit" disabled={isPending || !code.trim() || !turnstileToken}>
            {isPending ? "Opening Invitation..." : "Open Invitation"}
          </button>
          <button type="button" onClick={closeDialog} disabled={isPending}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
