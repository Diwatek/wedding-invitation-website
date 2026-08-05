import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getWeddingSiteUrl } from "@/lib/site-url";
import "./globals.css";

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getWeddingSiteUrl()),
  title: "Miguel & Camille | Private Wedding Invitation Concept",
  description:
    "A fictional private wedding invitation and wedding-story website concept created by Diwatek.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    noimageindex: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
