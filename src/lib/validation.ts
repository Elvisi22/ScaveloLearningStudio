/**
 * Validation shared by the browser (step-by-step feedback) and the server
 * (authoritative check before anything is delivered). Driven by
 * src/content/application-form.ts so field configuration lives in one place.
 */
import { getCountries, isValidPhoneNumber, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import { z } from "zod";
import { applicationForm, type ConfigurableField } from "@/content/application-form";
import { groupClasses } from "@/content/classes";
import { privatePackages } from "@/content/copy";
import { programs } from "@/content/programs";

export const INTENTS = {
  APPLY: "Apply now",
  INFORMATION: "Request information",
  CONSULTATION: "Book a consultation",
  INTEREST: "Express interest",
} as const;

export const FORMATS = {
  PRIVATE: "Private 1-on-1 lessons",
  GROUP: "Group lessons",
  EITHER: "Either option",
} as const;

export const LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

export const CONTACT_METHODS = {
  EMAIL: "Email",
  PHONE: "Phone call",
  WHATSAPP: "WhatsApp",
  VIDEO_CALL: "Video call",
} as const;

export const DAYS = { MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun" } as const;

export const TIMES = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  FLEXIBLE: "Flexible",
} as const;

export const CONTACT_TOPICS = {
  GENERAL: "General question",
  PROGRAMS: "Programs & formats",
  SCHEDULING: "Scheduling",
  PRIVACY: "Privacy or data request",
  OTHER: "Something else",
} as const;

const COUNTRY_CODES = new Set<string>(getCountries());

export function isValidTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/* ── Application ───────────────────────────────────────────────────────── */

/** Raw form state, as held by the browser. */
export type ApplicationValues = {
  intent: string;
  program: string;
  format: string;
  package: string;
  classId: string;
  level: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  preferredContact: string;
  objectives: string;
  experience: string;
  topics: string;
  preferredDays: string[];
  preferredTime: string;
  timezone: string;
  preferredStartDate: string;
  motivation: string;
  comments: string;
  extra: Record<string, string>;
  consent: boolean;
};

export function emptyApplication(): ApplicationValues {
  return {
    intent: "APPLY",
    program: "",
    format: "",
    package: "",
    classId: "",
    level: "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    preferredContact: "EMAIL",
    objectives: "",
    experience: "",
    topics: "",
    preferredDays: [],
    preferredTime: "",
    timezone: "",
    preferredStartDate: "",
    motivation: "",
    comments: "",
    extra: {},
    consent: false,
  };
}

const keys = <T extends Record<string, string>>(record: T) => Object.keys(record) as [keyof T & string, ...(keyof T & string)[]];
const text = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const choice = <T extends Record<string, string>>(record: T) => z.union([z.literal(""), z.enum(keys(record))]);

/** Shape and per-field rules. */
export const applicationSchema = z.object({
  intent: z.enum(keys(INTENTS), { error: "Choose what you would like to do." }),
  program: text(80),
  format: z.enum(keys(FORMATS), { error: "Choose a teaching format." }),
  package: text(20),
  classId: text(80),
  level: choice(LEVELS),
  fullName: text(120).min(2, "Please enter your full name."),
  email: z.string().trim().max(254).pipe(z.email("Please enter a valid email address.")),
  phone: text(40),
  country: text(2),
  preferredContact: choice(CONTACT_METHODS),
  objectives: text(2000),
  experience: text(2000),
  topics: text(1000),
  preferredDays: z.array(z.enum(keys(DAYS))).max(7),
  preferredTime: choice(TIMES),
  timezone: text(64),
  preferredStartDate: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.")]),
  motivation: text(2000),
  comments: text(2000),
  extra: z.record(z.string(), text(1000)),
  consent: z.literal(true, { error: "Please accept the privacy policy to continue." }),
});

export type Application = z.output<typeof applicationSchema>;

/** Rules that depend on configuration or on other fields. Pure, so the browser can run them per step. */
export function applicationRuleErrors(values: ApplicationValues): Record<string, string> {
  const errors: Record<string, string> = {};
  const issue = (path: string, message: string) => (errors[path] ??= message);
  const fields = applicationForm.fields;
  const required = (field: ConfigurableField) => fields[field].visible && fields[field].required;
  const v = (value: string | undefined) => (value ?? "").trim();

  const program = v(values.program) && values.program !== "undecided" ? programs.find((p) => p.slug === values.program) : null;
  if (!v(values.program)) issue("program", "Choose a program, or select “Not sure yet”.");
  else if (values.program !== "undecided" && !program) issue("program", "Choose a program from the list.");

  if (program && values.format === "PRIVATE" && !program.formats.private.available) issue("format", "This program is only offered as a group class.");
  if (program && values.format === "GROUP" && !program.formats.group.available) issue("format", "This program is only offered as private lessons.");

  if (v(values.package) && !privatePackages.some((p) => p.id === values.package)) issue("package", "Choose a package from the list.");

  if (v(values.classId)) {
    const groupClass = groupClasses.find((c) => c.id === values.classId);
    if (!groupClass || (program && groupClass.programSlug !== program.slug)) issue("classId", "Choose a class for the selected program.");
  }

  if (required("level") && !v(values.level)) issue("level", "Tell us your current level.");
  if (required("objectives") && v(values.objectives).length < 10) issue("objectives", "Tell us a little more about what you want to achieve.");
  if (required("experience") && !v(values.experience)) issue("experience", "This field is required.");
  if (required("topics") && !v(values.topics)) issue("topics", "This field is required.");
  if (required("motivation") && !v(values.motivation)) issue("motivation", "This field is required.");
  if (required("comments") && !v(values.comments)) issue("comments", "This field is required.");
  if (required("preferredStartDate") && !v(values.preferredStartDate)) issue("preferredStartDate", "Choose a preferred start date.");
  if (required("availability") && !values.preferredDays.length) issue("preferredDays", "Choose at least one day.");
  if (required("availability") && !v(values.preferredTime)) issue("preferredTime", "Choose a preferred time.");
  if (required("preferredContact") && !v(values.preferredContact)) issue("preferredContact", "Choose how you prefer to be contacted.");

  if (fields.country.visible) {
    if (required("country") && !v(values.country)) issue("country", "Select your country.");
    else if (v(values.country) && !COUNTRY_CODES.has(values.country)) issue("country", "Select a country from the list.");
  }

  if (v(values.timezone) && !isValidTimezone(values.timezone)) issue("timezone", "Select a valid time zone.");
  else if (required("timezone") && !v(values.timezone)) issue("timezone", "Select your time zone.");

  const needsPhone = values.preferredContact === "PHONE" || values.preferredContact === "WHATSAPP";
  if (!v(values.phone)) {
    if (required("phone") || needsPhone) issue("phone", needsPhone ? "Add a phone number so we can reach you this way." : "Please enter your phone number.");
  } else {
    const country = COUNTRY_CODES.has(values.country) ? (values.country as CountryCode) : undefined;
    if (!isValidPhoneNumber(values.phone.trim(), country)) issue("phone", "Enter a valid phone number (include the country code, e.g. +39).");
  }

  for (const question of applicationForm.extraQuestions) {
    const answer = v(values.extra?.[question.id]);
    if (question.required && !answer) issue(`extra.${question.id}`, "This field is required.");
    if (answer && question.type === "select" && !question.options?.includes(answer)) issue(`extra.${question.id}`, "Choose an option from the list.");
  }

  return errors;
}

/** Full client-side check: per-field rules plus cross-field rules. */
export function validateApplication(values: ApplicationValues) {
  const base = applicationSchema.safeParse(values);
  return { ...applicationRuleErrors(values), ...(base.success ? {} : issuesToErrors(base.error.issues)) };
}

/** Authoritative server-side parse. */
export function parseApplication(raw: unknown): { ok: true; data: Application } | { ok: false; errors: Record<string, string> } {
  const base = applicationSchema.safeParse(raw);
  if (!base.success) return { ok: false, errors: issuesToErrors(base.error.issues) };
  const ruleErrors = applicationRuleErrors(base.data as ApplicationValues);
  if (Object.keys(ruleErrors).length) return { ok: false, errors: ruleErrors };
  return { ok: true, data: base.data };
}

export function formatPhone(phone: string, country: string) {
  if (!phone) return "";
  const parsed = parsePhoneNumberFromString(phone, COUNTRY_CODES.has(country) ? (country as CountryCode) : undefined);
  return parsed?.formatInternational() ?? phone;
}

/* ── Contact ───────────────────────────────────────────────────────────── */

export type ContactValues = { name: string; email: string; topic: string; message: string; consent: boolean };

export const contactSchema = z.object({
  name: text(120).min(2, "Please enter your name."),
  email: z.string().trim().max(254).pipe(z.email("Please enter a valid email address.")),
  topic: z.enum(keys(CONTACT_TOPICS), { error: "Choose a topic." }),
  message: text(4000).min(10, "Please write a short message (at least 10 characters)."),
  consent: z.literal(true, { error: "Please accept the privacy policy to continue." }),
});

/* ── Helpers ───────────────────────────────────────────────────────────── */

/** Flattens zod issues into { "field": "first message" }. */
export function issuesToErrors(issues: z.core.$ZodIssue[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_form";
    errors[key] ??= issue.message;
  }
  return errors;
}
