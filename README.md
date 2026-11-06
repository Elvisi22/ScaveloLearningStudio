# Scavelo Learning Studio — website

A fast, editorial marketing site for an instructor-led teaching business. Visitors explore programs, compare private and group formats, and **apply in about five minutes — no account, no payment**. Every application is delivered straight into a private **Slack** channel, where the instructor follows up personally. Teaching itself happens on Slack (huddles), presented live from **PowerPoint**.

There is no database, no login and no admin panel: content lives in typed files under `src/content/`, and Slack is the inbox.

## How it works

```
Visitor ──► /apply (4-step form) ──► server action ──► validation + spam checks ──► Slack channel
                                                                     └──► optional email receipt (Resend)
```

- Pages are prerendered as static HTML (Next.js 16 Cache Components). Only the form on `/apply` streams, because it reads the URL to pre-select a program.
- Submissions are validated twice: in the browser for step-by-step feedback, and on the server with the same rules (`src/lib/validation.ts`) before anything is sent.
- Nothing is stored by the website. If Slack can't be reached, the visitor sees a clear error and can try again, so no application is silently lost.

## Quick start

```bash
npm install
cp .env.example .env    # nothing is required for local development
npm run dev             # http://localhost:3000
```

Without `SLACK_WEBHOOK_URL`, submitted applications are printed in the dev server console so you can see exactly what Slack would receive.

| Command             | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server                   |
| `npm run build`     | Production build                     |
| `npm start`         | Serve the production build           |
| `npm test`          | Unit tests (validation, spam, Slack) |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | TypeScript                           |

## Editing content

Everything visitors read is in `src/content/`. Edit, commit and redeploy.

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

**Photography:** the site ships with placeholder photographs from Unsplash (free Unsplash License), listed in `src/content/media.ts`. To use your own, put files in `public/images/` and point the entries at them (for example `"/images/hero.jpg"`). Program covers can also be set per program with `coverImage`, and the instructor portrait with `photo` in `people.ts`. An empty `src` falls back to a soft gradient. Once every image is self-hosted, you can remove the `images.remotePatterns` entry in `next.config.ts`.

## Connecting Slack

1. Go to <https://api.slack.com/apps> → **Create New App** → *From scratch*, choose your workspace.
2. Open **Incoming Webhooks**, switch it on, and click **Add New Webhook to Workspace**.
3. Choose a private channel, for example `#applications`.
4. Copy the webhook URL into `SLACK_WEBHOOK_URL` (locally in `.env`, in production in your host's environment settings).

Each application arrives as a formatted message with the reference number, contact details, program, format, class or package, level, availability and answers. Applicant text is escaped, so it can't trigger `@channel` mentions or hidden links. A simple workflow is to reply in the message thread to track progress, or react ✅ when you've been in touch.

Inviting students to the workspace stays manual and personal, after you confirm their place.

## Deployment

Any Node.js host works. Vercel is the simplest:

1. Push the repository and import it in Vercel.
2. Set the environment variables from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL` and `SLACK_WEBHOOK_URL`).
3. Deploy. All marketing pages are served statically from the CDN.

## Design system

The design language is Apple-inspired minimalism with a luxury-editorial restraint:

- **Type:** San Francisco on Apple devices and Inter (with optical sizing) elsewhere. The scale is set as utilities in `globals.css`: `text-hero`, `text-headline`, `text-title`, `text-subtitle`, `text-lead`, `text-body` and `eyebrow`.
- **Colour:** warm white canvas, charcoal text, hairline borders, and one bronze accent used only for small details. Tokens live in the `@theme` block of `globals.css`.
- **Components:** buttons and text links in `components/ui`, plus section, hero and media primitives (`Section`, `SectionHeading`, `PageHero`, `CinematicImage`) in `components/site`.
- **Motion:** content fades in as it scrolls into view (only below the fold, so the first screen paints instantly), images have a subtle scroll-linked parallax (CSS scroll-driven animations, no JavaScript), and everything respects `prefers-reduced-motion`.

## Security & privacy

- Server-side validation of every field, with length limits and allow-listed values
- Spam protection: honeypot field, minimum fill time, link-stuffing check, per-IP and per-email rate limits, and optional Cloudflare Turnstile
- Bots that trip the honeypot get a fake success response, so they learn nothing
- Strict security headers: Content-Security-Policy, HSTS, `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy
- No cookies, no tracking and no personal data stored by the website. Submissions go only to your Slack channel (and your email provider if enabled)
- Consent to the privacy policy is required, and the policy version is recorded in each Slack message

> Rate limits are kept in memory per server instance. On serverless hosting with many instances, enable Turnstile for consistent protection.

## Launch checklist

The site runs as-is, but these items need your input before going live:

- [ ] **Contact email**: add it to `contact.email` in `src/content/site.ts` once it's chosen. Until then every email link and mention on the site stays hidden, and visitors are pointed to the contact form.
- [ ] **Contact details**: phone and social links in `src/content/site.ts` (location is set to Tirana and the USA).
- [ ] **Instructor profile**: `src/content/people.ts` (name, bio, credentials, stats, photo). All placeholder text.
- [ ] **Programs, prices and classes**: `programs.ts` and `classes.ts` contain sample data.
- [ ] **Photography**: replace the Unsplash placeholders in `src/content/media.ts` with your own images, and add the instructor's portrait.
- [ ] **Testimonials**: the included ones are samples. They show only in development and are hidden automatically in production builds. Add real ones (with permission) and remove `sample: true`.
- [ ] **Legal pages**: complete the bracketed details in `src/content/legal.ts` and have them reviewed.
- [ ] **Slack webhook**: required in production (see above).
- [ ] **Email receipts (optional)**: `RESEND_API_KEY`, `EMAIL_FROM` with a verified domain, optionally `INSTRUCTOR_EMAIL`.
- [ ] **Turnstile (recommended)**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- [ ] **Domain**: set `NEXT_PUBLIC_SITE_URL` so canonical links, the sitemap and social previews use your domain.

## Project structure

```
src/
  app/                 Routes (App Router) and the server actions in actions.ts
  components/site/     Page sections, cards, header/footer
  components/forms/    Application and contact forms, Turnstile, honeypot
  components/ui/       Buttons, fields, badges
  content/             All editable content (see above)
  lib/                 Catalogue helpers, formatting, shared validation
  lib/server/          Slack, email, spam protection (server-only)
tests/                 Vitest unit tests
```

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, Zod, libphonenumber-js.
