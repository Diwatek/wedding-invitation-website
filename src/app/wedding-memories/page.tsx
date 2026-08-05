import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { EventDetailCard } from "@/components/wedding/event-detail-card";
import { GalleryGrid } from "@/components/wedding/gallery-grid";
import { MemoriesUnavailable } from "@/components/wedding/memories-unavailable";
import { Timeline } from "@/components/wedding/timeline";
import { WeddingFilm } from "@/components/wedding/wedding-film";
import { WeddingNavigation } from "@/components/wedding/wedding-navigation";
import { SiteFooter } from "@/components/site-footer";
import { eventTimeline, guestNotes, imagePath, wedding } from "@/data/wedding";
import { getWeddingGuestAccess } from "@/lib/wedding-access";

export const metadata: Metadata = {
  title: "Wedding Memories | Miguel & Camille",
  robots: { index: false, follow: false, noarchive: true, noimageindex: true },
};

export default async function WeddingMemoriesPage() {
  const guest = await getWeddingGuestAccess();
  if (!guest) redirect("/");

  if (!wedding.memoriesPublished) {
    return (
      <div className="page-shell">
        <WeddingNavigation />
        <MemoriesUnavailable />
        <SiteFooter showLinks />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <WeddingNavigation
        items={[
          { href: "#our-story", label: "Our Story" },
          { href: "#prenup", label: "Prenup" },
          { href: "#preparation", label: "Preparation" },
          { href: "#ceremony", label: "Ceremony" },
          { href: "#pictorials", label: "Pictorials" },
          { href: "#reception", label: "Reception" },
          { href: "#wedding-film", label: "Wedding Film" },
          { href: "/before-the-wedding", label: "Before the Wedding" },
          { href: "/", label: "Invitation" },
        ]}
      />
      <main id="main">
        <section className="hero two-column">
          <div>
            <p className="eyebrow">Completed Wedding Experience</p>
            <p>{wedding.couple.firstNames}</p>
            <p>{wedding.date.display}</p>
            <h1>Our wedding memories</h1>
            <p>
              A collection of moments from the story, preparation, ceremony,
              pictorials, reception, and celebration.
            </p>
            <p>
              Welcome, {guest.greeting}. Thank you for sharing this fictional
              celebration with Miguel and Camille.
            </p>
          </div>
          <div className="hero-image">
            <Image
              src="/images/wedding/generated-couple-hero.png"
              alt="Fictional couple posing for a wedding-day garden portrait"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </section>

        <section className="section-block" id="our-story">
          <h2>A story written with faith, friendship, and love.</h2>
          <p>
            Miguel and Camille&apos;s fictional story represents a couple whose
            friendship grew through shared faith, family gatherings, quiet
            conversations, and a desire to build a life grounded in love and
            purpose.
          </p>
          <p>
            This section is demonstration content for a Diwatek portfolio
            concept and does not describe real people.
          </p>
        </section>

        <div id="prenup">
          <GalleryGrid
            title="Prenup Gallery"
            items={[
              { slug: "prenup-heritage", label: "Heritage-inspired Iloilo streets", alt: "Fictional couple posing in a heritage-inspired Iloilo setting" },
              { slug: "prenup-garden", label: "Tropical garden portrait", alt: "Fictional couple posing during a garden prenup portrait" },
              { slug: "prenup-coastal", label: "Coastal golden-hour portrait", alt: "Fictional couple during a coastal golden-hour prenup portrait" },
              { slug: "prenup-formal", label: "Formal indoor portrait", alt: "Fictional couple in a formal indoor prenup portrait" },
            ]}
          />
        </div>

        <div id="preparation">
          <GalleryGrid
            title="Getting Ready"
            items={[
              { slug: "bride-preparation", label: "Bride preparation", alt: "Fictional bride preparing before the wedding ceremony" },
              { slug: "groom-preparation", label: "Groom preparation", alt: "Fictional groom adjusting his suit before the ceremony" },
              { slug: "wedding-details", label: "Rings, Bible, veil, bouquet, shoes, and suit details", alt: "Fictional wedding details with rings, Bible, veil, bouquet, shoes, and suit accents" },
            ]}
          />
        </div>

        <div id="ceremony">
          <GalleryGrid
            title="Church Ceremony"
            items={[
              { slug: "church-exterior", label: "Church entrance", alt: "Fictional church entrance prepared for a Christian wedding ceremony" },
              { slug: "church-aisle", label: "Bride walking down the aisle", alt: "Fictional bride walking down a church aisle" },
              { slug: "prayer-worship", label: "Prayer and worship", alt: "Fictional Christian wedding prayer and worship moment" },
              { slug: "exchange-vows", label: "Exchange of vows", alt: "Fictional couple exchanging vows during a Christian wedding ceremony" },
              { slug: "ring-exchange", label: "Ring exchange and blessing", alt: "Fictional couple exchanging rings during the ceremony" },
            ]}
          />
        </div>

        <section className="section-block">
          <h2>Filipino Christian wedding elements</h2>
          <p>
            The concept includes commonly seen Filipino Christian wedding
            traditions such as candle, veil, cord, Bible, prayer, and principal
            sponsors or witnesses. It does not claim every Filipino Christian
            wedding follows the same ceremony.
          </p>
          <div className="image-frame wide">
            <Image
              src={imagePath("veil-cord-candle")}
              alt="Fictional Filipino Christian wedding candle, veil, cord, and Bible details"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
        </section>

        <div id="pictorials">
          <GalleryGrid
            title="Pictorials"
            items={[
              { slug: "couple-pictorial", label: "Couple portrait", alt: "Fictional couple posing for a wedding-day garden portrait" },
              { slug: "family-pictorial", label: "Immediate family and family portraits", alt: "Fictional immediate family wedding portrait" },
              { slug: "entourage-pictorial", label: "Entourage and principal sponsors or witnesses", alt: "Fictional wedding entourage portrait" },
            ]}
          />
        </div>

        <div id="reception">
          <GalleryGrid
            title="Reception"
            items={[
              { slug: "reception-entrance", label: "Couple entrance and reception atmosphere", alt: "Fictional couple entering a warm garden wedding reception" },
              { slug: "first-dance", label: "Prayer, toasts, first dance, and family celebration", alt: "Fictional couple during their first dance at the reception" },
              { slug: "cake-cutting", label: "Cake cutting", alt: "Fictional couple cutting a simple wedding cake" },
              { slug: "evening-sendoff", label: "Evening send-off", alt: "Fictional couple during an evening wedding send-off" },
            ]}
          />
        </div>

        <section className="section-block">
          <h2>Event Details</h2>
          <div className="detail-grid">
            <EventDetailCard title="Ceremony" venue={wedding.ceremony.venue} location={wedding.ceremony.city} time={wedding.date.ceremonyTime} />
            <EventDetailCard title="Reception" venue={wedding.reception.venue} location={wedding.reception.city} time={wedding.date.receptionTime} />
          </div>
          <p>
            Dress Code: {wedding.dressCode}. Guest notes include:
          </p>
          <ul className="clean-list">
            {guestNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <Timeline
          items={eventTimeline}
          note="All schedule information is fictional demonstration content."
        />

        <WeddingFilm />
      </main>
      <SiteFooter showLinks />
    </div>
  );
}
