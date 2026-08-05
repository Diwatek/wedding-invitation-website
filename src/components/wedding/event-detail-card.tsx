export function EventDetailCard({
  title,
  venue,
  location,
  time,
}: {
  title: string;
  venue: string;
  location: string;
  time?: string;
}) {
  return (
    <article className="detail-card">
      <p className="eyebrow">{title}</p>
      <h3>{venue}</h3>
      <p>{location}</p>
      {time ? <time>{time}</time> : null}
    </article>
  );
}
