export function Timeline({
  items,
  note,
}: {
  items: readonly (readonly [string, string])[];
  note?: string;
}) {
  return (
    <section className="section-block" id="schedule">
      <h2>Wedding Schedule</h2>
      {note ? <p>{note}</p> : null}
      <ol className="timeline">
        {items.map(([time, label]) => (
          <li key={`${time}-${label}`}>
            <time>{time}</time>
            <span>{label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
