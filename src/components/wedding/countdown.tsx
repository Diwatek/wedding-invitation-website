"use client";

import { useEffect, useState } from "react";

const labels = ["Days", "Hours", "Minutes", "Seconds"] as const;

function getParts(target: number) {
  const remaining = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [days, hours, minutes, seconds];
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = new Date(targetIso).getTime();
  const [parts, setParts] = useState<number[] | null>(null);

  useEffect(() => {
    const update = () => setParts(getParts(target));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (parts && parts.every((part) => part === 0)) {
    return <p className="countdown-complete">The celebration has begun.</p>;
  }

  const shown = parts ?? [0, 0, 0, 0];

  return (
    <section className="countdown" aria-label="Countdown to the ceremony">
      <p className="sr-only">
        {parts
          ? `${shown[0]} days, ${shown[1]} hours, ${shown[2]} minutes, and ${shown[3]} seconds until the wedding ceremony.`
          : "Countdown loading."}
      </p>
      {shown.map((value, index) => (
        <div key={labels[index]}>
          <strong>{parts ? value : "--"}</strong>
          <span>{labels[index]}</span>
        </div>
      ))}
    </section>
  );
}
