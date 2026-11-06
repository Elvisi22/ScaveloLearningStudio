"use server";

import { after } from "next/server";
import { site } from "@/content/site";
import { getProgram } from "@/lib/catalog";
import { integrations } from "@/lib/server/env";
import { sendApplicationAcknowledgement, sendContactAcknowledgement } from "@/lib/server/email";
import { clientIp, generateReference, looksAutomated, rateLimit, tooManyLinks, verifyTurnstile } from "@/lib/server/protection";
import { sendApplicationToSlack, sendContactToSlack } from "@/lib/server/slack";
import { contactSchema, issuesToErrors, parseApplication } from "@/lib/validation";

export type SubmitResult =
  | { ok: true; reference: string; emailSent: boolean }
  | { ok: false; message: string; errors?: Record<string, string> };

type Envelope = { values: unknown; honeypot?: unknown; elapsedMs?: unknown; turnstileToken?: unknown };

const DELIVERY_FAILED = site.contact.email
  ? `We couldn't send your submission just now. Please try again in a few minutes, or email ${site.contact.email} directly.`
  : "We couldn't send your submission just now. Please try again in a few minutes.";

/** Plausible-looking response for suspected bots, so they get no signal. */
function decoy(prefix: "APP" | "MSG"): SubmitResult {
  return { ok: true, reference: generateReference(prefix), emailSent: false };
}

export async function submitApplication(envelope: Envelope): Promise<SubmitResult> {
  const ip = await clientIp();
  if (!rateLimit(`apply:${ip}`, 5, 15 * 60)) {
    return { ok: false, message: "You've sent several applications in a short time. Please wait a few minutes and try again." };
  }

  const parsed = parseApplication(envelope?.values);
  if (!parsed.ok) return { ok: false, message: "Please review the highlighted fields.", errors: parsed.errors };
  const application = parsed.data;

  if (looksAutomated(envelope) || tooManyLinks(application.objectives, application.motivation, application.comments)) {
    return decoy("APP");
  }
  if (!rateLimit(`apply-email:${application.email.toLowerCase()}`, 3, 24 * 60 * 60)) {
    return { ok: false, message: "We've already received several applications from this email address today. The instructor will be in touch." };
  }
  if (!(await verifyTurnstile(envelope.turnstileToken, ip))) {
    return { ok: false, message: "Please complete the verification check and try again." };
  }

  const reference = generateReference("APP");
  const delivery = await sendApplicationToSlack(application, reference);
  if (!delivery.ok) return { ok: false, message: DELIVERY_FAILED };

  const program = getProgram(application.program)?.title ?? "your chosen program";
  if (integrations.email) {
    after(() => sendApplicationAcknowledgement({ to: application.email, name: application.fullName, reference, program }));
  }
  return { ok: true, reference, emailSent: integrations.email };
}

export async function submitContact(envelope: Envelope): Promise<SubmitResult> {
  const ip = await clientIp();
  if (!rateLimit(`contact:${ip}`, 5, 15 * 60)) {
    return { ok: false, message: "You've sent several messages in a short time. Please wait a few minutes and try again." };
  }

  const parsed = contactSchema.safeParse(envelope?.values);
  if (!parsed.success) {
    return { ok: false, message: "Please review the highlighted fields.", errors: issuesToErrors(parsed.error.issues) };
  }
  const message = parsed.data;

  if (looksAutomated(envelope) || tooManyLinks(message.message)) return decoy("MSG");
  if (!(await verifyTurnstile(envelope.turnstileToken, ip))) {
    return { ok: false, message: "Please complete the verification check and try again." };
  }

  const reference = generateReference("MSG");
  const delivery = await sendContactToSlack(message, reference);
  if (!delivery.ok) return { ok: false, message: DELIVERY_FAILED };

  if (integrations.email) {
    after(() => sendContactAcknowledgement({ to: message.email, name: message.name, reference }));
  }
  return { ok: true, reference, emailSent: integrations.email };
}
