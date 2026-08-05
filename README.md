# Diwatek Wedding Invitation Concept

This is a fictional private Filipino Christian wedding invitation and wedding memories website concept created by Diwatek. Miguel, Camille, all guest names, entourage names, venues, schedules, codes, and story content are fictional demonstration data.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS
- Server Components by default
- Server Actions for invitation-code access
- `jose` for signed access and guest-pass tokens
- `qrcode` for local QR image generation
- `html-to-image` for browser-only PNG export
- Cloudflare Turnstile on the invitation-code dialog
- OpenNext for Cloudflare Workers deployment

## Routes

- `/` invitation entrance with sealed state, invitation-code dialog, personalized invitation card, print, PNG download, guest pass, RSVP, and lock controls
- `/before-the-wedding` protected pre-wedding details, countdown, guest summary, entourage, gift note, FAQ, prenup preview
- `/wedding-memories` protected completed memories experience controlled by `memoriesPublished`
- `/guest-pass` protected signed QR guest pass
- `/verify-pass` public server-side QR token verification
- `/rsvp` protected design-only RSVP preview

There is no `/invitation` route and no `/wedding` route.

## Local Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

Create `.env.local`:

```bash
WEDDING_SESSION_SECRET=replace-with-long-random-secret
WEDDING_GUEST_PASS_SECRET=replace-with-different-long-random-secret
NEXT_PUBLIC_TURNSTILE_SITE_KEY=replace-with-cloudflare-turnstile-site-key
TURNSTILE_SECRET_KEY=replace-with-cloudflare-turnstile-secret-key
TURNSTILE_ALLOWED_HOSTNAMES=localhost,127.0.0.1
WEDDING_SITE_URL=https://wedding.diwatek.com
```

Generate a strong secret:

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

Only placeholders belong in `.env.example`. Do not commit real secrets.

## Guest-Code Architecture

Fictional guest records live in `src/data/guest-invitations.server.ts`, which imports `server-only`. Client Components receive only resolved display-safe guest details, never invitation codes or hashes.

Invitation codes are normalized by trimming, removing whitespace, and uppercasing. The server hashes the submitted code with SHA-256 using Web Crypto and compares it to stored hashes. This is suitable for the fictional demo, but a real deployment should use a private database, stronger code-management controls, revocation, audit logs, rate limiting, and administrative guest management.

Keep any local plaintext demo codes in `guest-codes.local.txt`, which is
ignored by Git. Do not commit plaintext invitation codes to README, public
source files, Client Components, or browser-delivered assets.

Use Cloudflare's official Turnstile testing keys for local testing when a real
widget is not available. The production widget should be dedicated to
`wedding.diwatek.com`.

The browser widget uses `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Server-side
validation uses `TURNSTILE_SECRET_KEY` and calls Cloudflare Siteverify before
checking any invitation code. Production must fail closed if Turnstile is not
configured.

## Cookies And Guest Passes

The access cookie is named `diwatek_wedding_access`. It is HttpOnly, SameSite Lax, path `/`, time-limited, signed, and secure in production. Its payload contains only minimal guest identity such as `guestId`; full guest details are resolved again from the server-side list.

Guest-pass QR tokens are signed with `WEDDING_GUEST_PASS_SECRET`. The QR payload contains only minimal claims: guest ID, wedding identifier, issued/expiration times, and token type. It does not contain invitation codes, code hashes, private notes, or secrets.

`/verify-pass` validates the token server-side. QR tokens expire independently from the browser access cookie, so locking the invitation does not revoke already generated QR tokens.

## RSVP Limitation

The `/rsvp` page is a design-only portfolio demonstration. It does not submit a Server Action, call an API, send email, use a database, write cookies, or store data in localStorage/sessionStorage. No RSVP data is collected, saved, transmitted, or added to a guest list.

## Publishing

Edit wedding content and `memoriesPublished` in `src/data/wedding.ts`. A real deployment could start with `memoriesPublished: false` and switch to `true` after final photos and videos are ready.

## Security Limitations

This demo does not include distributed rate limiting. A public production deployment should add Cloudflare Turnstile, rate limiting, or another appropriate abuse-prevention control.

The demo also does not include a database, RSVP persistence, attendance tracking, administrative check-in, camera scanner UI, payment handling, CMS, or external authentication service.

A real guest-pass system would require a private guest database, attendance status, revocation controls, authorized staff access, secure check-in tooling, hashed invitation codes, and operational monitoring.

## Cloudflare Workers Deployment

This project is configured for Cloudflare Workers through
`@opennextjs/cloudflare`.

Tracked deployment files:

- `open-next.config.ts`
- `wrangler.jsonc`
- `public/_headers`

Useful commands:

```bash
npm run preview
npm run deploy
npm run upload
npm run cf-typegen
```

Runtime secrets required in Cloudflare Workers:

- `WEDDING_SESSION_SECRET`
- `WEDDING_GUEST_PASS_SECRET`
- `TURNSTILE_SECRET_KEY`

Build variable required for Workers Builds:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Non-secret Worker vars:

- `WEDDING_SITE_URL=https://wedding.diwatek.com`
- `TURNSTILE_ALLOWED_HOSTNAMES=wedding.diwatek.com`

Do not put runtime secrets in `wrangler.jsonc`. Use Cloudflare dashboard
secrets or `wrangler secret put` with the hidden prompt.

Configured Worker name:

- `diwatek-wedding`

Configured custom domain:

- `wedding.diwatek.com`

## Images And Video

Image slots are local generated concept assets under `public/images/wedding`. They do not use real wedding photographs, real couples, real churches, supplier logos, or private data.

Future local wedding film path:

```text
public/videos/wedding-highlight.mp4
```

When added, use controls, `playsInline`, `preload="metadata"`, a poster, no autoplay, and captions when dialogue is meaningful.

## Print And PNG Export

The invitation and guest pass can each be printed or downloaded as PNGs. PNG generation happens entirely in the browser through `html-to-image`; it does not upload or store the generated image.

Downloaded or printed copies are not verified admission. A real wedding requiring guest verification needs server-side guest-list validation.

## Privacy And SEO

All pages use `robots: { index: false, follow: false }`. The project does not create public structured data, maps, real addresses, guest contact details, payment links, or public guest information.
