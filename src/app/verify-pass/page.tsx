import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { wedding } from "@/data/wedding";
import { verifyGuestPassToken } from "@/lib/wedding-access";

export const metadata: Metadata = {
  title: "Verify Guest Pass | Miguel & Camille",
  robots: { index: false, follow: false, noarchive: true, noimageindex: true },
};

export default async function VerifyPassPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = await verifyGuestPassToken(token);

  return (
    <div className="page-shell">
      <main id="main" className="verify-main">
        {result.status === "valid" ? (
          <section className="section-block verification valid">
            <div className="status-icon" aria-hidden="true">
              ✓
            </div>
            <p className="eyebrow">Status: Valid fictional demonstration pass</p>
            <h1>Valid Guest Pass</h1>
            <dl>
              <div>
                <dt>Guest</dt>
                <dd>{result.guest.displayName}</dd>
              </div>
              <div>
                <dt>Reserved seats</dt>
                <dd>{result.guest.reservedSeats}</dd>
              </div>
              <div>
                <dt>Guest type</dt>
                <dd>{result.guest.guestType}</dd>
              </div>
              {result.guest.entourageRole ? (
                <div>
                  <dt>Entourage role</dt>
                  <dd>{result.guest.entourageRole}</dd>
                </div>
              ) : null}
              <div>
                <dt>Wedding</dt>
                <dd>{wedding.couple.firstNames}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{wedding.date.display}</dd>
              </div>
              <div>
                <dt>Pass reference</dt>
                <dd>{result.reference}</dd>
              </div>
            </dl>
          </section>
        ) : (
          <section className="section-block verification invalid">
            <div className="status-icon" aria-hidden="true">
              !
            </div>
            <p className="eyebrow">
              {result.status === "expired" ? "Expired pass" : "Not verified"}
            </p>
            <h1>
              {result.status === "expired"
                ? "Guest Pass Expired"
                : "Guest Pass Not Verified"}
            </h1>
            <p>
              This pass could not be validated. It may be incomplete, expired,
              altered, or not part of this fictional demonstration.
            </p>
          </section>
        )}
        <section className="section-block">
          <h2>Verification limitations</h2>
          <p>
            This verification page demonstrates signed QR guest-pass validation.
            A real wedding check-in system would also require a private guest
            database, attendance status, revocation controls, and authorized
            event staff access.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
