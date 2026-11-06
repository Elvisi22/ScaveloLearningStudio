import { site } from "@/content/site";

const priceFormatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return priceFormatter.format(amount);
}

/** Dates in content are plain YYYY-MM-DD strings; format them without time-zone drift. */
function toUtcDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
}

export function formatDate(isoDate: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat(site.locale, { ...options, timeZone: "UTC" }).format(toUtcDate(isoDate));
}

export function formatDateRange(start: string, end: string) {
  const a = toUtcDate(start);
  const b = toUtcDate(end);
  const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
  const startText = formatDate(start, sameYear ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" });
  return `${startText} – ${formatDate(end, { day: "numeric", month: "short", year: "numeric" })}`;
}

export function dateParts(isoDate: string) {
  return {
    day: formatDate(isoDate, { day: "numeric" }),
    month: formatDate(isoDate, { month: "short" }),
    weekday: formatDate(isoDate, { weekday: "short" }),
    year: formatDate(isoDate, { year: "numeric" }),
  };
}

/** Short zone name (e.g. "CET") for the given date in the given IANA zone. */
export function timezoneAbbreviation(timeZone: string, isoDate: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" }).formatToParts(toUtcDate(isoDate));
    return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}
