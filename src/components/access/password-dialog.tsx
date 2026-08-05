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
  const [isPending, startTransition] = useTransition();

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
        <label htmlFor="invitation-code">Invitation code</label>
        <div className="password-row">
          <input
            ref={inputRef}
            id="invitation-code"
            name="invitation-code"
            type={showCode ? "text" : "password"}
            autoComplete="one-time-code"
            maxLength={128}
            value={code}
            aria-describedby={error ? "code-error" : undefined}
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
