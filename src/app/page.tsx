import type { Metadata } from "next";
import { SealedInvitation } from "@/components/invitation/sealed-invitation";
import { SiteFooter } from "@/components/site-footer";
import { WeddingNavigation } from "@/components/wedding/wedding-navigation";
import { getWeddingGuestAccess } from "@/lib/wedding-access";

export const metadata: Metadata = {
  title: "Miguel & Camille | Private Wedding Invitation Concept",
  description:
    "A fictional private wedding invitation and wedding-story website concept created by Diwatek.",
  robots: { index: false, follow: false, noarchive: true, noimageindex: true },
};

export default async function Home() {
  const guest = await getWeddingGuestAccess();

  return (
    <div className="page-shell">
      {guest ? <WeddingNavigation compact /> : null}
      <main id="main" className="home-main">
        <SealedInvitation
          hasAccess={Boolean(guest)}
          guest={guest}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
