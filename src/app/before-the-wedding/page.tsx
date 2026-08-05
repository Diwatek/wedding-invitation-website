import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Countdown } from "@/components/wedding/countdown";
import { EventDetailCard } from "@/components/wedding/event-detail-card";
import { GalleryGrid } from "@/components/wedding/gallery-grid";
import { Timeline } from "@/components/wedding/timeline";
import { WeddingNavigation } from "@/components/wedding/wedding-navigation";
import { SiteFooter } from "@/components/site-footer";
import { getGuestChildrenText } from "@/data/guest-invitations.server";
import { eventTimeline, guestNotes, wedding, weddingEntourage } from "@/data/wedding";
import { getWeddingGuestAccess } from "@/lib/wedding-access";

export const metadata: Metadata = {
  title: "Before the Wedding | Miguel & Camille",
  robots: { index: false, follow: false, noarchive: true, noimageindex: true },
};

export default async function BeforeTheWeddingPage() {
  const guest = await getWeddingGuestAccess();
  if (!guest) redirect("/");

  return (
    <div className="page-shell">
      <WeddingNavigation
        items={[
          { href: "/", label: "Invitation" },
          { href: "#details", label: "Wedding Details" },
          { href: "#schedule", label: "Schedule" },
          { href: "#dress-code", label: "Dress Code" },
          { href: "#prenup", label: "Prenup Preview" },
          { href: "/rsvp", label: "RSVP" },
          { href: "/guest-pass", label: "Guest Pass" },
          {
            href: "/wedding-memories",
            label: "Wedding Memories",
            disabled: !wedding.memoriesPublished,
          },
        ]}
      />
      <main id="main">
        <section className="hero two-column">
          <div>
            <p className="eyebrow">Upcoming Celebration</p>
            <p>{wedding.couple.firstNames}</p>
            <p>{wedding.date.display}</p>
            <h1>Our wedding day is almost here.</h1>
            <p>
              We look forward to celebrating this meaningful day with our
              families, friends, and loved ones.
            </p>
          </div>
          <div className="hero-image">
            <Image
              src="/images/wedding/generated-couple-hero.png"
              alt="Fictional couple posing during a garden prenup portrait"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </section>

        <Countdown targetIso={wedding.date.ceremonyIsoManila} />

        <section className="section-block" id="details">
          <h2>Ceremony and Reception Details</h2>
          <article className="personal-summary">
            <h3>Your invitation</h3>
            <dl className="guest-summary-list">
              <div>
                <dt>Guest</dt>
                <dd>{guest.displayName}</dd>
              </div>
              <div>
                <dt>Reserved seats</dt>
                <dd>{guest.reservedSeats}</dd>
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
            <div className="action-row">
              <Link className="text-link-button" href="/guest-pass">
                View Guest Pass
              </Link>
              <Link className="text-link-button secondary-action" href="/rsvp">
                Complete Demo RSVP
              </Link>
            </div>
          </article>
          <div className="detail-grid">
            <EventDetailCard
              title="Ceremony"
              venue={wedding.ceremony.venue}
              location={wedding.ceremony.city}
              time={wedding.date.ceremonyTime}
            />
            <EventDetailCard
              title="Reception"
              venue={wedding.reception.venue}
              location={wedding.reception.city}
              time={wedding.date.receptionTime}
            />
          </div>
        </section>

        <Timeline items={eventTimeline} />

        <section className="section-block" id="dress-code">
          <h2>Dress Code</h2>
          <p>{wedding.dressCode}</p>
          <div className="swatches" aria-label="Suggested attire color examples">
            {["Muted earth", "Sage", "Champagne", "Dusty blue", "Navy"].map(
              (label) => (
                <span key={label}>{label}</span>
              ),
            )}
          </div>
        </section>

        <section className="section-block">
          <h2>Guest Notes</h2>
          <ul className="clean-list">
            {guestNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="section-block">
          <h2>Wedding Entourage</h2>
          <div className="entourage-grid">
            {weddingEntourage.map((group) => (
              <article key={group.category}>
                <h3>{group.category}</h3>
                <ul>
                  {group.names.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="security-note">
            All names shown in this wedding entourage are fictional and used
            only for the Diwatek concept website.
          </p>
        </section>

        <section className="section-block">
          <h2>With your presence, we are already blessed.</h2>
          <p>
            Your prayers and presence are the greatest gifts. For guests who
            wish to give something more, a simple monetary or household gift
            may be presented during the celebration.
          </p>
          <p>This is fictional demonstration content.</p>
        </section>

        <section className="section-block">
          <h2>Guest Information</h2>
          <div className="faq-list">
            <details>
              <summary>Can I bring an additional guest?</summary>
              <p>Please follow the number of reserved seats displayed on your invitation.</p>
            </details>
            <details>
              <summary>Are children included?</summary>
              <p>{getGuestChildrenText(guest)}</p>
            </details>
            <details>
              <summary>What time should we arrive?</summary>
              <p>Guests are encouraged to arrive approximately 30 minutes before the ceremony.</p>
            </details>
            <details>
              <summary>Can I take photos during the ceremony?</summary>
              <p>Please follow the ceremony and venue photography guidance.</p>
            </details>
            <details>
              <summary>Should I bring my invitation?</summary>
              <p>A digital or printed invitation copy or guest pass may be presented at the welcome area.</p>
            </details>
            <details>
              <summary>Is there an RSVP deadline?</summary>
              <p>Demonstration event information: December 15, 2026.</p>
            </details>
          </div>
        </section>

        <section className="section-block">
          <h2>With gratitude and joyful anticipation</h2>
          <p>
            We are grateful for your prayers, friendship, and presence as we
            prepare for this new chapter.
          </p>
        </section>

        <div id="prenup">
          <GalleryGrid
            title="Prenup Preview"
            items={[
              {
                slug: "prenup-heritage",
                label: "Heritage-inspired Iloilo setting",
                alt: "Fictional couple posing in a heritage-inspired Iloilo setting",
              },
              {
                slug: "prenup-garden",
                label: "Tropical garden portrait",
                alt: "Fictional couple posing during a garden prenup portrait",
              },
              {
                slug: "prenup-coastal",
                label: "Coastal golden-hour portrait",
                alt: "Fictional couple during a coastal golden-hour prenup portrait",
              },
              {
                slug: "prenup-formal",
                label: "Formal indoor portrait",
                alt: "Fictional couple in a formal indoor prenup portrait",
              },
            ]}
          />
        </div>

        <section className="section-block">
          <p className="eyebrow">
            {wedding.memoriesPublished
              ? "Demonstration Preview"
              : "Available after the wedding"}
          </p>
          <h2>Wedding memories will be shared here.</h2>
          <p>
            After the celebration, this website can present wedding photographs,
            ceremony highlights, reception moments, and the couple&apos;s wedding
            film.
          </p>
          {wedding.memoriesPublished ? (
            <Link className="text-link-button" href="/wedding-memories">
              Preview the Completed Wedding Page
            </Link>
          ) : null}
        </section>
      </main>
      <SiteFooter showLinks />
    </div>
  );
}
