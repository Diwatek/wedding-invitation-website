import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { SiteFooter } from "@/components/site-footer";
import { GuestPassActions } from "@/components/wedding/guest-pass-actions";
import { WeddingNavigation } from "@/components/wedding/wedding-navigation";
import { getGuestChildrenText } from "@/data/guest-invitations.server";
import { wedding } from "@/data/wedding";
import {
  createGuestPassToken,
  createPassReference,
  getWeddingGuestAccess,
} from "@/lib/wedding-access";
import { getWeddingSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Guest Pass | Miguel & Camille",
  robots: { index: false, follow: false, noarchive: true, noimageindex: true },
};

async function getOrigin() {
  if (process.env.WEDDING_SITE_URL) return getWeddingSiteUrl();

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export default async function GuestPassPage() {
  const guest = await getWeddingGuestAccess();
  if (!guest) redirect("/");

  const token = await createGuestPassToken(guest.id);
  const verifyUrl = `${await getOrigin()}/verify-pass?token=${encodeURIComponent(token)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "M",
    margin: 3,
    width: 320,
    color: { dark: "#243347", light: "#FFFDF8" },
  });
  const reference = createPassReference(guest.id);

  return (
    <div className="page-shell guest-pass-page">
      <WeddingNavigation />
      <main id="main">
        <section className="section-block pass-wrap">
          <p className="eyebrow">Fictional guest pass</p>
          <h1>Your digital guest pass</h1>
          <p>
            Present this digital or printed guest pass at the welcome area for
            this fictional wedding website demonstration.
          </p>
          <article id="guest-pass-card" className="guest-pass-card">
            <p className="eyebrow">Miguel & Camille</p>
            <h2>{wedding.date.display}</h2>
            <dl>
              <div>
                <dt>Guest</dt>
                <dd>{guest.displayName}</dd>
              </div>
              <div>
                <dt>Reserved seats</dt>
                <dd>{guest.reservedSeats}</dd>
              </div>
              <div>
                <dt>Guest type</dt>
                <dd>{guest.guestType}</dd>
              </div>
              <div>
                <dt>Children</dt>
                <dd>{getGuestChildrenText(guest)}</dd>
              </div>
              {guest.entourageRole ? (
                <div>
                  <dt>Wedding role</dt>
                  <dd>{guest.entourageRole}</dd>
                </div>
              ) : null}
            </dl>
            <div className="qr-frame">
              <Image
                src={qrDataUrl}
                alt={`QR code for the fictional ${guest.displayName} wedding guest pass`}
                width={320}
                height={320}
                unoptimized
              />
            </div>
            <p>
              Pass reference: <strong>{reference}</strong>
            </p>
            <p className="pass-print-note">
              Fictional Diwatek wedding website demonstration
            </p>
          </article>
          <GuestPassActions guestId={guest.id} />
          <p className="security-note">
            This portfolio concept does not connect to a real wedding guest
            list. It is not government identification or guaranteed admission.
          </p>
        </section>
      </main>
      <SiteFooter showLinks />
    </div>
  );
}
