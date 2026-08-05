"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PasswordDialog } from "@/components/access/password-dialog";
import { InvitationUtilityActions } from "@/components/invitation/invitation-actions";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { wedding } from "@/data/wedding";
import type { PublicWeddingGuest } from "@/types/guest";

export function SealedInvitation({
  hasAccess,
  guest,
  turnstileSiteKey,
}: {
  hasAccess: boolean;
  guest?: PublicWeddingGuest | null;
  turnstileSiteKey?: string;
}) {
  const sealedCardRef = useRef<HTMLButtonElement>(null);
  const accessButtonRef = useRef<HTMLButtonElement>(null);
  const activeOpenerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(hasAccess);
  const [animate, setAnimate] = useState(false);
  const showDemoHint =
    process.env.NEXT_PUBLIC_WEDDING_DEMO_MODE === "true" &&
    Boolean(process.env.NEXT_PUBLIC_WEDDING_DEMO_CODE?.trim());

  useEffect(() => {
    if (!hasAccess) return;

    const alreadyOpened = sessionStorage.getItem("diwatek_invitation_opened");
    if (!alreadyOpened) {
      window.setTimeout(() => setAnimate(true), 0);
      sessionStorage.setItem("diwatek_invitation_opened", "true");
    }
  }, [hasAccess]);

  function openDialog(opener: HTMLButtonElement | null) {
    activeOpenerRef.current = opener;
    dialogRef.current?.showModal();
  }

  function unlock() {
    setOpened(true);
    setAnimate(true);
    sessionStorage.setItem("diwatek_invitation_opened", "true");
  }

  return (
    <section className={opened ? "invitation-stage opened" : "invitation-stage"}>
      <div className="locked-copy print-hidden" hidden={opened}>
        <p className="eyebrow">Private invitation</p>
        <h1>You are invited to a celebration of love.</h1>
        <p>Open our private wedding invitation.</p>
        <p>Enter the private invitation code shared with you.</p>
      </div>

      <button
        ref={sealedCardRef}
        type="button"
        className={animate ? "envelope animate" : "envelope"}
        aria-label={
          opened ? "Replay invitation envelope" : "Open private invitation"
        }
        onClick={
          opened ? () => setAnimate(true) : () => openDialog(sealedCardRef.current)
        }
      >
        <span className="envelope-flap" />
        <span className="envelope-body" />
        <span className="envelope-label">
          {wedding.couple.firstNames}
          <small>{wedding.date.display}</small>
        </span>
      </button>

      {opened ? (
        <div className={animate ? "card-rise animate" : "card-rise"}>
          <InvitationCard guest={guest} />
          <div className="destination-grid print-hidden">
            <Link className="destination primary" href="/before-the-wedding">
              <strong>Before the Wedding</strong>
              <span>
                View the ceremony details, schedule, dress code, guest notes,
                and information for the upcoming celebration.
              </span>
            </Link>
            {wedding.memoriesPublished ? (
              <Link className="destination" href="/wedding-memories">
                <small>Completed Wedding Experience</small>
                <strong>Wedding Memories</strong>
                <span>
                View the couple&apos;s story, prenup portraits, wedding-day
                  ceremony, pictorials, reception, gallery, and wedding-film
                  presentation.
                </span>
              </Link>
            ) : (
              <div className="destination unavailable" aria-disabled="true">
                <small>Available after the wedding</small>
                <strong>Wedding Memories</strong>
                <span>Completed memories are not yet published.</span>
              </div>
            )}
            <Link className="destination utility-destination" href="/guest-pass">
              <strong>View Guest Pass</strong>
              <span>
                Open your signed fictional guest pass with QR verification and
                reserved-seat details.
              </span>
            </Link>
            <Link className="destination utility-destination" href="/rsvp">
              <strong>RSVP</strong>
              <span>Preview the design-only RSVP experience.</span>
            </Link>
          </div>
          <InvitationUtilityActions />
        </div>
      ) : (
        <div className="locked-access-panel print-hidden">
          <p className="access-label">
            <span aria-hidden="true" className="access-lock" />
            Private Guest Access
          </p>
          <button
            ref={accessButtonRef}
            type="button"
            className="open-invitation-button"
            aria-label="Open private invitation code dialog"
            onClick={() => openDialog(accessButtonRef.current)}
          >
            Open Private Invitation
          </button>
          <p>
            Enter the invitation code shared with you to view your personalized
            invitation and wedding details.
          </p>
          <p className="access-cue">
            Click the invitation or use the button below.
          </p>
          {showDemoHint ? (
            <p className="demo-landing-hint">
              Exploring the demo? A public access code is available inside the
              invitation window.
            </p>
          ) : null}
          <p className="security-note">
            This private invitation uses a guest-specific event code. A real
            deployment should connect codes to an approved guest list.
          </p>
        </div>
      )}

      <PasswordDialog
        dialogRef={dialogRef}
        openerRef={activeOpenerRef}
        onUnlocked={unlock}
        turnstileSiteKey={turnstileSiteKey}
      />
    </section>
  );
}
