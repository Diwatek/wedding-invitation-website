import Link from "next/link";
import { wedding } from "@/data/wedding";

export function SiteFooter({ showLinks = false }: { showLinks?: boolean }) {
  return (
    <footer className="site-footer print-hidden">
      {showLinks ? (
        <nav aria-label="Footer links" className="footer-links">
          <Link href="/">Invitation</Link>
          <Link href="/before-the-wedding">Before the Wedding</Link>
          <Link href="/wedding-memories">Wedding Memories</Link>
          <a
            href="https://diwatek.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Diwatek website in a new tab"
          >
            Diwatek
          </a>
        </nav>
      ) : null}
      <p>
        <strong>{wedding.couple.firstNames}</strong> · {wedding.date.display}
      </p>
      <p>{wedding.disclosure}</p>
    </footer>
  );
}
