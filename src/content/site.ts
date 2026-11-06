/**
 * Brand, contact details and navigation.
 */
export const site = {
  name: "Scavelo Learning Studio",
  /** The wordmark in the header and footer: the first part is set in bold. */
  wordmark: { primary: "Scavelo", secondary: "Learning Studio" },
  legalName: "Scavelo Learning Studio",
  tagline: "Private, instructor-led learning",
  description:
    "Instructor-led private lessons and small group classes, taught live by the instructor — with a private Slack community and carefully prepared PowerPoint sessions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-GB",
  currency: "EUR",
  timezone: "Europe/Tirane",
  contact: {
    /**
     * Public contact email. Leave empty until it's chosen: every email link,
     * mention and fallback message on the site is hidden while this is empty.
     */
    email: "" as string,
    phone: "" as string,
    location: "Tirana, Albania · United States",
    locationLong: "Based in Tirana and the USA · Teaching online worldwide",
    hours: "Monday – Friday, across European and US time zones",
    responseTime: "within two business days",
  },
  /** Add full URLs to show social links in the footer. */
  socials: [
    { label: "LinkedIn", href: "" },
    { label: "Instagram", href: "" },
    { label: "YouTube", href: "" },
  ] as { label: string; href: string }[],
  /** Set to null to hide the bar above the header. */
  announcement: {
    text: "Applications are open for the January group classes.",
    href: "/group-classes",
    cta: "View classes",
  } as { text: string; href: string; cta: string } | null,
} as const;

export const mainNav = [
  { label: "Programs", href: "/programs" },
  { label: "Private lessons", href: "/private-lessons" },
  { label: "Group classes", href: "/group-classes" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Instructor", href: "/instructor" },
] as const;

export const footerNav = [
  {
    title: "Learn",
    links: [
      { label: "All programs", href: "/programs" },
      { label: "Private 1-on-1 lessons", href: "/private-lessons" },
      { label: "Group classes", href: "/group-classes" },
      { label: "Apply", href: "/apply" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "The instructor", href: "/instructor" },
      { label: "Questions & answers", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;
