import { groupClasses, type ClassStatus, type GroupClass } from "@/content/classes";
import { programs, type Program } from "@/content/programs";

export function getProgram(slug: string) {
  return programs.find((program) => program.slug === slug) ?? null;
}

export function getGroupClass(id: string) {
  return groupClasses.find((groupClass) => groupClass.id === id) ?? null;
}

export function featuredPrograms() {
  return programs.filter((program) => program.featured);
}

export function categories() {
  return [...new Set(programs.map((program) => program.category))];
}

export function seatsLeft(groupClass: GroupClass) {
  return Math.max(0, groupClass.capacity - groupClass.seatsTaken);
}

/** Seat availability wins over the manually set status. */
export function classStatus(groupClass: GroupClass): ClassStatus {
  if (groupClass.status === "ENROLLMENT_OPEN" && seatsLeft(groupClass) === 0) return "FULLY_BOOKED";
  return groupClass.status;
}

export function isBookable(groupClass: GroupClass) {
  return classStatus(groupClass) === "ENROLLMENT_OPEN";
}

const LISTED: ClassStatus[] = ["UPCOMING", "ENROLLMENT_OPEN", "FULLY_BOOKED", "IN_PROGRESS"];

export function upcomingClasses() {
  return groupClasses
    .filter((groupClass) => LISTED.includes(classStatus(groupClass)) && classStatus(groupClass) !== "IN_PROGRESS")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function classesForProgram(slug: string) {
  return upcomingClasses().filter((groupClass) => groupClass.programSlug === slug);
}

export function classPrice(groupClass: GroupClass) {
  if (groupClass.price != null) return groupClass.price;
  return getProgram(groupClass.programSlug)?.formats.group.price?.amount ?? null;
}

/** Lowest public price across available formats, or null when priced on request. */
export function startingPrice(program: Program) {
  const prices = [program.formats.private, program.formats.group]
    .filter((format) => format.available && format.price)
    .map((format) => format.price!.amount);
  return prices.length ? Math.min(...prices) : null;
}

export function hasOpenClass(program: Program) {
  return classesForProgram(program.slug).some(isBookable);
}

export type PriceBand = "under-100" | "100-600" | "600-plus" | "on-request";

export function priceBand(program: Program): PriceBand {
  const price = startingPrice(program);
  if (price == null) return "on-request";
  if (price < 100) return "under-100";
  if (price <= 600) return "100-600";
  return "600-plus";
}

export const PRICE_BAND_LABELS: Record<PriceBand, string> = {
  "under-100": "Under €100",
  "100-600": "€100 – €600",
  "600-plus": "Over €600",
  "on-request": "On request",
};
