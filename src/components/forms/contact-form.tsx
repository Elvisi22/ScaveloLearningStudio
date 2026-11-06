"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { submitContact } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { CONTACT_TOPICS, contactSchema, issuesToErrors, type ContactValues } from "@/lib/validation";
import { useIsClient } from "@/lib/use-browser";
import { Honeypot, Turnstile } from "./turnstile";

export function ContactForm({ turnstileSiteKey, responseTime }: { turnstileSiteKey?: string; responseTime: string }) {
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", topic: "GENERAL", message: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  const hydrated = useIsClient();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const found = issuesToErrors(parsed.error.issues);
      setErrors(found);
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (turnstileSiteKey && !token) {
      setFormError("Please complete the verification check.");
      return;
    }
    setFormError(null);
    startTransition(async () => {
      try {
        const response = await submitContact({ values, honeypot, elapsedMs: Date.now() - startedAt.current, turnstileToken: token });
        if (response.ok) setReference(response.reference);
        else {
          setFormError(response.message);
          if (response.errors) setErrors(response.errors);
        }
      } catch {
        setFormError("Something went wrong. Please check your connection and try again.");
      }
    });
  }

  if (reference) {
    return (
      <div className="animate-rise rounded-[2rem] bg-paper p-8 shadow-card sm:rounded-[2.25rem] sm:p-10" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-white">
          <Check className="size-5" aria-hidden />
        </span>
        <h2 className="mt-6 text-title text-ink">Thank you — message received.</h2>
        <p className="mt-3 text-body text-stone">
          We&apos;ll reply {responseTime}. Your reference is <span className="font-mono text-ink">{reference}</span>.
        </p>
      </div>
    );
  }

  const aria = (key: keyof ContactValues) => ({ "aria-invalid": Boolean(errors[key]) || undefined, "aria-describedby": errors[key] ? `contact-${key}-error` : undefined });

  return (
    <form noValidate method="post" onSubmit={submit} className="relative flex flex-col gap-7 rounded-[2rem] bg-paper p-6 shadow-card sm:rounded-[2.25rem] sm:p-10">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="contact-name" label="Name" required error={errors.name}>
          <Input id="contact-name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
        </Field>
        <Field id="contact-email" label="Email" required error={errors.email}>
          <Input id="contact-email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
        </Field>
      </div>
      <Field id="contact-topic" label="Topic" required error={errors.topic}>
        <Select id="contact-topic" value={values.topic} onChange={(e) => set("topic", e.target.value)} {...aria("topic")}>
          {(Object.keys(CONTACT_TOPICS) as (keyof typeof CONTACT_TOPICS)[]).map((key) => (
            <option key={key} value={key}>
              {CONTACT_TOPICS[key]}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="contact-message" label="Message" required error={errors.message}>
        <Textarea id="contact-message" className="min-h-40" maxLength={4000} value={values.message} onChange={(e) => set("message", e.target.value)} {...aria("message")} />
      </Field>
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-relaxed text-graphite">
          <input id="contact-consent" type="checkbox" className="mt-1 size-[1.05rem] shrink-0 accent-[#1d1d1f]" checked={values.consent} onChange={(e) => set("consent", e.target.checked)} {...aria("consent")} />
          <span>
            I agree that my information is used to answer my message, as described in the{" "}
            <Link href="/privacy" target="_blank" className="text-ink underline underline-offset-4">
              privacy policy
            </Link>
            . <span className="text-accent">*</span>
          </span>
        </label>
        {errors.consent ? (
          <p id="contact-consent-error" className="text-sm text-accent" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>
      {turnstileSiteKey ? <Turnstile siteKey={turnstileSiteKey} onToken={setToken} /> : null}
      {formError ? (
        <p className="rounded-xl bg-[#fcefee] px-4 py-3.5 text-[0.9375rem] text-[#9f2a22]" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending || !hydrated} className="self-start">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
