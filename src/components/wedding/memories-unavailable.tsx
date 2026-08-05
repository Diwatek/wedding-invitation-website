import Link from "next/link";

export function MemoriesUnavailable() {
  return (
    <main id="main" className="unavailable-state">
      <p className="eyebrow">Available after the wedding</p>
      <h1>Wedding memories will be available after the celebration.</h1>
      <p>
        The completed gallery can be published after the final wedding
        photographs and videos become available.
      </p>
      <Link className="text-link-button" href="/before-the-wedding">
        Return to Before the Wedding
      </Link>
    </main>
  );
}
