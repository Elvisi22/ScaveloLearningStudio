# Scavelo Learning Studio — website

A fast, editorial marketing site for an instructor-led teaching business. Visitors explore programs, compare private and group formats, and **apply in about five minutes — no account, no payment**. Teaching itself happens on Slack (huddles), presented live from **PowerPoint**.

The site is fully **static**: there is no database, no login and no server. It is exported to plain HTML/CSS/JS and hosted on **GitHub Pages**. All content lives in typed files under `src/content/`.

## How it works

```
Visitor ──► /apply (4-step form) ──► validation in the browser ──► NEXT_PUBLIC_FORM_ENDPOINT ──► Slack (later)
```

- Every page is prerendered at build time. The application form reads the URL in the browser to pre-select a program, format, class or package.
- **Forms are not connected yet.** Until `NEXT_PUBLIC_FORM_ENDPOINT` is set, the application and contact forms are fully explorable but show an "online submissions open soon" notice and keep the final submit disabled — nothing is silently lost.
- Once connected, submissions are posted from the browser to that endpoint (see [Connecting Slack later](#connecting-slack-later)).

## Quick start

```bash
npm install
npm run dev             # http://localhost:3000
```

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Development server                               |
| `npm run build`     | Static export into `out/`                        |
| `npm test`          | Unit tests                                       |
| `npm run lint`      | ESLint                                           |
| `npm run typecheck` | TypeScript                                       |

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds the site and publishes it on every push to `main`.

**One-time setup:** in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** (instead of "Deploy from a branch"). Then push to `main`, or run the workflow manually from the **Actions** tab.

The site is published at `https://<user>.github.io/<repository>/`. The workflow sets the base path automatically; with a custom domain the base path becomes empty and everything still works.

Optional build variables (Settings → Secrets and variables → Actions → **Variables**):

| Variable             | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `FORM_ENDPOINT`      | URL the forms post to (enables submissions)          |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile CAPTCHA site key                |

## Editing content

Everything visitors read is in `src/content/`. Edit, commit and push — the site redeploys automatically.

| File                  | Contents                                                                         |
| --------------------- | -------------------------------------------------------------------------------- |
| `site.ts`             | Brand name, contact details, announcement bar, navigation, social links          |
| `media.ts`            | Photography for the hero, sections, closing banner and program covers            |
| `copy.ts`             | Homepage and marketing copy, teaching formats, steps, private lesson packages    |
| `programs.ts`         | The program catalogue (one landing page each at `/programs/[slug]`)              |
| `classes.ts`          | Upcoming group classes: dates, schedule, capacity, **seats taken**, status       |
| `people.ts`           | Instructor profile and testimonials                                              |
| `faqs.ts`             | Questions & answers (`featured` ones appear on the homepage)                      |
| `application-form.ts` | Show/hide/require form fields, add your own questions, success message           |
| `legal.ts`            | Privacy policy and terms (templates, see the checklist below)                    |

**Group class seats** are managed by hand: when you confirm a student, increase `seatsTaken`. A class automatically shows as "Fully booked" with a waiting-list button when it reaches capacity.

**Photography:** the site ships with placeholder photographs from Unsplash (free Unsplash License), listed in `src/content/media.ts`. To use your own, put files in `public/images/` and point the entries at them (for example `"/images/hero.jpg"`). Program covers can also be set per program with `coverImage`, and the instructor portrait with `photo` in `people.ts`. An empty `src` falls back to a soft gradient. Images are resized by Unsplash's CDN through `src/lib/image-loader.ts`.

**Social preview image:** `public/og-image.png` (1200 × 630). Replace it with your own artwork if you like.

## Connecting Slack later

A static site must never contain a Slack webhook URL (anyone could read it and post into your channel), so submissions need a tiny relay that keeps the webhook secret:

1. Create a Slack app with an **Incoming Webhook** to a private channel such as `#applications` (<https://api.slack.com/apps> → Create New App → Incoming Webhooks).
2. Deploy a small relay — for example a free Cloudflare Worker or a serverless function — that receives the form's JSON, validates it, and forwards it to the webhook. The Slack message formatting (with escaping so applicants can't trigger `@channel`), validation rules and spam checks are already written in `src/lib/server/` and `src/lib/validation.ts`, covered by tests, ready to reuse.
3. Set the repository variable `FORM_ENDPOINT` to the relay URL and redeploy. The forms switch on automatically.

The relay should respond with JSON `{ "reference": "APP-…" }` on success, or `{ "message": "…", "errors": { "field": "…" } }` with a 4xx status on validation errors.

## Design system

The design language is Apple-inspired minimalism with a luxury-editorial restraint:

- **Type:** San Francisco on Apple devices and Inter (with optical sizing) elsewhere. The scale is set as utilities in `globals.css`: `text-hero`, `text-headline`, `text-title`, `text-subtitle`, `text-lead`, `text-body` and `eyebrow`.
- **Colour:** warm white canvas, charcoal text, hairline borders, and one bronze accent used only for small details. Tokens live in the `@theme` block of `globals.css`.
- **Components:** buttons and text links in `components/ui`, plus section, hero and media primitives (`Section`, `SectionHeading`, `PageHero`, `CinematicImage`) in `components/site`.
- **Motion:** content fades in as it scrolls into view (only below the fold, so the first screen paints instantly), images have a subtle scroll-linked parallax (CSS scroll-driven animations, no JavaScript), and everything respects `prefers-reduced-motion`.

## Security & privacy

- No cookies, no tracking and no personal data stored by the website
- Browser-side validation of every field with the same rules the relay will enforce server-side
- Spam protection built into the forms: honeypot field, minimum fill time, and optional Cloudflare Turnstile
- Content-Security-Policy delivered as a meta tag (GitHub Pages can't send custom headers)
- Consent to the privacy policy is required before submitting

## Launch checklist

- [ ] **GitHub Pages source** set to **GitHub Actions** (see above).
- [ ] **Contact email**: add it to `contact.email` in `src/content/site.ts` once it's chosen. Until then every email link and mention on the site stays hidden.
- [ ] **Contact details**: phone and social links in `src/content/site.ts` (location is set to Tirana and the USA).
- [ ] **Instructor profile**: `src/content/people.ts` (name, bio, credentials, stats, photo). All placeholder text.
- [ ] **Programs, prices and classes**: `programs.ts` and `classes.ts` contain sample data.
- [ ] **Photography**: replace the Unsplash placeholders in `src/content/media.ts` with your own images, and add the instructor's portrait.
- [ ] **Testimonials**: the included ones are samples. They show only in development and are hidden automatically in production builds. Add real ones (with permission) and remove `sample: true`.
- [ ] **Legal pages**: complete the bracketed details in `src/content/legal.ts` and have them reviewed.
- [ ] **Forms**: connect Slack through a relay and set `FORM_ENDPOINT` (see above).

## Project structure

```
.github/workflows/     GitHub Pages build & deploy
src/
  app/                 Routes (App Router)
  components/site/     Page sections, cards, header/footer
  components/forms/    Application and contact forms, Turnstile, honeypot
  components/ui/       Buttons, fields, badges
  content/             All editable content (see above)
  lib/                 Catalogue helpers, formatting, validation, form delivery, image loader
  lib/server/          Slack message formatting, email, spam protection — for the future relay
tests/                 Vitest unit tests
```

Stack: Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 4, Zod, libphonenumber-js.
