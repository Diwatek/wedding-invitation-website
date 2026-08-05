"use client";

import Link from "next/link";
import { useState } from "react";
import { wedding } from "@/data/wedding";

type Item = {
  href: string;
  label: string;
  disabled?: boolean;
};

export function WeddingNavigation({
  items,
  compact = false,
}: {
  items?: Item[];
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems =
    items ??
    [
      { href: "/", label: "Invitation" },
      { href: "/before-the-wedding", label: "Before the Wedding" },
      { href: "/rsvp", label: "RSVP" },
      { href: "/guest-pass", label: "Guest Pass" },
      {
        href: "/wedding-memories",
        label: "Wedding Memories",
        disabled: !wedding.memoriesPublished,
      },
    ];

  return (
    <nav
      className={
        compact ? "wedding-nav compact print-hidden" : "wedding-nav print-hidden"
      }
      aria-label="Wedding navigation"
    >
      <div className="nav-topline">
        <Link className="nav-mark" href="/">
          M & C
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="wedding-nav-links"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span aria-hidden="true">{isOpen ? "Close" : "Menu"}</span>
        </button>
      </div>
      <div
        id="wedding-nav-links"
        className={isOpen ? "nav-links open" : "nav-links"}
      >
        {navItems.map((item) =>
          item.disabled ? (
            <span aria-disabled="true" key={item.label}>
              {item.label}
            </span>
          ) : (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
