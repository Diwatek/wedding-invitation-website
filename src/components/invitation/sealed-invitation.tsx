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
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(hasAccess);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!hasAccess) return;

    const alreadyOpened = sessionStorage.getItem("diwatek_invitation_opened");
    if (!alreadyOpened) {
      window.setTimeout(() => setAnimate(true), 0);
      sessionStorage.setItem("diwatek_invitation_opened", "true");
    }
  }, [hasAccess]);

  function openDialog() {
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
        ref={openerRef}
        type="button"
        className={animate ? "envelope animate" : "envelope"}
        aria-label={opened ? "Replay invitation envelope" : "View Invitation"}
        onClick={opened ? () => setAnimate(true) : openDialog}
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
        <p className="security-note print-hidden">
          This private invitation uses a guest-specific event code. A real
          deployment should connect codes to an approved guest list.
        </p>
      )}

      <PasswordDialog
        dialogRef={dialogRef}
        openerRef={openerRef}
        onUnlocked={unlock}
        turnstileSiteKey={turnstileSiteKey}
      />
    </section>
  );
}
