import { describe, expect, it } from "vitest";
import { applicationRuleErrors, emptyApplication, parseApplication, validateApplication, type ApplicationValues } from "@/lib/validation";

function valid(overrides: Partial<ApplicationValues> = {}): ApplicationValues {
  return {
    ...emptyApplication(),
    intent: "APPLY",
    program: "java-foundations",
    format: "GROUP",
    classId: "java-foundations-jan-2027",
    level: "BEGINNER",
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+39 02 1234 5678",
    country: "IT",
    preferredContact: "EMAIL",
    objectives: "Become a confident Java developer within a year.",
    timezone: "Europe/Tirane",
    consent: true,
    ...overrides,
  };
}

describe("application validation", () => {
  it("accepts a complete application", () => {
    const result = parseApplication(valid());
    expect(result.ok).toBe(true);
  });

  it("requires consent, a name and a valid email", () => {
    const errors = validateApplication(valid({ consent: false, fullName: "A", email: "nope" }));
    expect(errors.consent).toBeDefined();
    expect(errors.fullName).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it("rejects unknown programs and classes from another program", () => {
    expect(applicationRuleErrors(valid({ program: "made-up" })).program).toBeDefined();
    expect(applicationRuleErrors(valid({ classId: "architecture-spring-2027" })).classId).toBeDefined();
  });

  it("rejects a format the program does not offer", () => {
    // Presenting Technical Ideas is group-only.
    const errors = applicationRuleErrors(valid({ program: "presenting-technical-ideas", classId: "", format: "PRIVATE" }));
    expect(errors.format).toMatch(/group/i);
  });

  it("validates phone numbers and requires one for phone/WhatsApp contact", () => {
    expect(applicationRuleErrors(valid({ phone: "12" })).phone).toBeDefined();
    expect(applicationRuleErrors(valid({ phone: "", preferredContact: "WHATSAPP" })).phone).toBeDefined();
    expect(applicationRuleErrors(valid({ phone: "", preferredContact: "EMAIL" })).phone).toBeUndefined();
  });

  it("rejects invalid time zones and countries", () => {
    expect(applicationRuleErrors(valid({ timezone: "Mars/Olympus" })).timezone).toBeDefined();
    expect(applicationRuleErrors(valid({ country: "XX" })).country).toBeDefined();
  });

  it("rejects over-long text and unexpected enum values server-side", () => {
    expect(parseApplication({ ...valid(), comments: "x".repeat(2001) }).ok).toBe(false);
    expect(parseApplication({ ...valid(), format: "ROOFTOP" }).ok).toBe(false);
    expect(parseApplication({ ...valid(), preferredDays: ["FUNDAY"] }).ok).toBe(false);
    expect(parseApplication("not an object").ok).toBe(false);
  });

  it("allows 'not sure yet' as a program", () => {
    expect(parseApplication(valid({ program: "undecided", classId: "", format: "EITHER" })).ok).toBe(true);
  });
});
