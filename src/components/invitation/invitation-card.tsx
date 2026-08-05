import { wedding } from "@/data/wedding";
import type { PublicWeddingGuest } from "@/types/guest";

function getGuestChildrenText(guest: PublicWeddingGuest) {
  if (guest.childrenPermitted === true) return "Included in your reservation";
  if (guest.childrenPermitted === false) {
    return "This invitation is reserved for the named guests.";
  }
  return "Not applicable for this invitation.";
}

export function InvitationCard({ guest }: { guest?: PublicWeddingGuest | null }) {
  return (
    <article
      id="invitation-card"
      className="invitation-card"
      aria-label="Digital invitation copy"
    >
      <div className="botanical botanical-top" aria-hidden="true" />
      {guest ? (
        <section className="personal-invitation">
          <p>{guest.greeting},</p>
          <p>
            Together with their families, Miguel and Camille joyfully invite you
            to celebrate their wedding.
          </p>
          <dl>
            <div>
              <dt>Invited guest</dt>
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
        </section>
      ) : null}
      <p className="eyebrow">Together with their families</p>
      <h2>
        <span>{wedding.couple.groom}</span>
        <em>&</em>
        <span>{wedding.couple.bride}</span>
      </h2>
      <p>joyfully invite you to celebrate their wedding</p>
      <div className="invitation-date">
        <span>{wedding.date.weekday}</span>
        <strong>{wedding.date.display}</strong>
        <span>{wedding.date.ceremonyFormalTime}</span>
      </div>
      <div className="venue-block">
        <strong>{wedding.ceremony.venue}</strong>
        <span>{wedding.ceremony.city}</span>
      </div>
      <p>
        Reception to follow at <strong>{wedding.reception.venue}</strong> at{" "}
        {wedding.date.receptionTime}
      </p>
      <div className="dress-note">
        <span>Dress code</span>
        <strong>{wedding.dressCodeShort}</strong>
      </div>
      <p className="tagline">{wedding.tagline}</p>
      <p>We would be honored to celebrate this day with you.</p>
      <div className="botanical botanical-bottom" aria-hidden="true" />
    </article>
  );
}
