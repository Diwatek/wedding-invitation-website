import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { RsvpForm } from "@/components/wedding/rsvp-form";
import { WeddingNavigation } from "@/components/wedding/wedding-navigation";
import { getGuestChildrenText } from "@/data/guest-invitations.server";
import { getWeddingGuestAccess } from "@/lib/wedding-access";

export const metadata: Metadata = {
  title: "RSVP | Miguel & Camille",
  robots: { index: false, follow: false, noarchive: true, noimageindex: true },
};

export default async function RsvpPage() {
  const guest = await getWeddingGuestAccess();
  if (!guest) redirect("/");

  return (
    <div className="page-shell">
      <WeddingNavigation />
      <main id="main">
        <section className="hero">
          <p className="eyebrow">Design-only RSVP</p>
          <p>{guest.greeting}</p>
          <p>Reserved seats: {guest.reservedSeats}</p>
          <h1>Will you be celebrating with us?</h1>
        </section>
        <section className="section-block">
          <h2>RSVP Preview</h2>
          <p>
            This RSVP form is a frontend portfolio demonstration only. It does
            not send email, call an API, use a database, store data, write
            browser storage, or write cookies.
          </p>
          <dl className="guest-summary-list">
            <div>
              <dt>Guest</dt>
              <dd>{guest.displayName}</dd>
            </div>
            <div>
              <dt>Children</dt>
              <dd>{getGuestChildrenText(guest)}</dd>
            </div>
          </dl>
          <RsvpForm guest={guest} />
        </section>
        <section className="section-block">
          <h2>No RSVP data is collected</h2>
          <p>
            A real implementation could later connect to a protected database
            and administrative guest list, but this phase intentionally stores
            no RSVP responses and records no attendance.
          </p>
        </section>
      </main>
      <SiteFooter showLinks />
    </div>
  );
}
