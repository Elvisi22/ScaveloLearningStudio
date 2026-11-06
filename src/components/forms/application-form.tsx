"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import { submitApplication } from "@/app/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChoiceCard, Field, Input, Select, Textarea } from "@/components/ui/field";
import { applicationForm, type ExtraQuestion } from "@/content/application-form";
import { useBrowserLocale, useIsClient } from "@/lib/use-browser";
import { cn } from "@/lib/utils";
import {
  CONTACT_METHODS,
  DAYS,
  FORMATS,
  INTENTS,
  LEVELS,
  TIMES,
  emptyApplication,
  validateApplication,
  type ApplicationValues,
} from "@/lib/validation";
import { Honeypot, Turnstile } from "./turnstile";

export type FormProgram = { slug: string; title: string; category: string; private: boolean; group: boolean; accepting: boolean };
export type FormClass = { id: string; name: string; programSlug: string; label: string; bookable: boolean };
export type FormOptions = {
  programs: FormProgram[];
  classes: FormClass[];
  packages: { id: string; name: string; lessons: number }[];
  countries: { code: string; name: string }[];
  timezones: string[];
  turnstileSiteKey?: string;
  responseTime: string;
};

type StepId = "interest" | "about" | "goals" | "details";

const extrasFor = (step: ExtraQuestion["step"]) => applicationForm.extraQuestions.filter((q) => q.step === step);

const STEPS: { id: StepId; title: string; description: string; fields: string[] }[] = [
  {
    id: "interest",
    title: "Your interest",
    description: "What you'd like to learn and how.",
    fields: ["intent", "program", "format", "package", "classId", "level", ...extrasFor("interest").map((q) => `extra.${q.id}`)],
  },
  { id: "about", title: "About you", description: "How the instructor can reach you.", fields: ["fullName", "email", "phone", "country", "preferredContact"] },
  {
    id: "goals",
    title: "Goals & availability",
    description: "What you want to achieve, and when.",
    fields: ["objectives", "experience", "topics", "preferredDays", "preferredTime", "timezone", "preferredStartDate", ...extrasFor("availability").map((q) => `extra.${q.id}`)],
  },
  {
    id: "details",
    title: "Final details",
    description: "Anything else, then review and send.",
    fields: ["motivation", "comments", ...extrasFor("details").map((q) => `extra.${q.id}`), "consent", "_form"],
  },
];

const show = applicationForm.fields;

/** Drops selections that no longer fit the chosen program or format. */
function normalize(next: ApplicationValues, classes: FormClass[]): ApplicationValues {
  const out = { ...next };
  if (out.classId && (out.format === "PRIVATE" || !classes.some((c) => c.id === out.classId && c.programSlug === out.program))) out.classId = "";
  if (out.package && out.format === "GROUP") out.package = "";
  return out;
}

export function ApplicationForm({ initial, options }: { initial: Partial<ApplicationValues>; options: FormOptions }) {
  const [state, setValues] = useState<ApplicationValues>(() => ({ ...emptyApplication(), ...initial }));
  const browser = useBrowserLocale();
  // Submitting is only possible once hydrated, so the browser never falls back to a native submission.
  const hydrated = useIsClient();
  // Browser-derived defaults are applied at render time so server and client markup match on hydration.
  const values: ApplicationValues = {
    ...state,
    timezone: state.timezone || browser.timezone,
    country: state.country || (options.countries.some((c) => c.code === browser.region) ? browser.region : ""),
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; emailSent: boolean } | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const classes = options.classes;
  const set = useCallback(<K extends keyof ApplicationValues>(key: K, value: ApplicationValues[K]) => {
    setValues((current) => normalize({ ...current, [key]: value }, classes));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }, [classes]);

  const setExtra = (id: string, value: string) => {
    setValues((current) => ({ ...current, extra: { ...current.extra, [id]: value } }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`extra.${id}`];
      return next;
    });
  };

  const program = options.programs.find((p) => p.slug === values.program);
  const programClasses = options.classes.filter((c) => c.programSlug === values.program);
  const showPackage = (values.format === "PRIVATE" || values.format === "EITHER") && (!program || program.private);
  const showClass = (values.format === "GROUP" || values.format === "EITHER") && programClasses.length > 0;

  function stepErrors(index: number, all: Record<string, string>) {
    const allowed = STEPS[index].fields;
    return Object.fromEntries(Object.entries(all).filter(([key]) => allowed.includes(key)));
  }

  function focusFirstError(found: Record<string, string>) {
    const first = Object.keys(found)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] select, [data-field="${first}"] textarea`);
      element?.focus({ preventScroll: false });
    });
  }

  function goTo(index: number) {
    setStep(index);
    setFormError(null);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function next() {
    const found = stepErrors(step, validateApplication(values));
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(found);
    goTo(step + 1);
  }

  function submit() {
    const all = validateApplication(values);
    const firstInvalid = STEPS.findIndex((_, index) => Object.keys(stepErrors(index, all)).length > 0);
    if (firstInvalid !== -1) {
      setErrors(stepErrors(firstInvalid, all));
      if (firstInvalid !== step) goTo(firstInvalid);
      else focusFirstError(stepErrors(firstInvalid, all));
      return;
    }
    if (options.turnstileSiteKey && !turnstileToken) {
      setFormError("Please complete the verification check.");
      return;
    }
    setFormError(null);
    startTransition(async () => {
      try {
        const response = await submitApplication({ values, honeypot, elapsedMs: Date.now() - startedAt.current, turnstileToken });
        if (response.ok) {
          setResult({ reference: response.reference, emailSent: response.emailSent });
          requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
          return;
        }
        setFormError(response.message);
        if (response.errors) {
          setErrors(response.errors);
          const index = STEPS.findIndex((s) => s.fields.some((f) => response.errors![f]));
          if (index !== -1 && index !== step) goTo(index);
        }
      } catch {
        setFormError("Something went wrong while sending your application. Please check your connection and try again.");
      }
    });
  }

  if (result) return <SuccessPanel ref={topRef} reference={result.reference} emailSent={result.emailSent} responseTime={options.responseTime} />;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const err = (key: string) => errors[key];
  const invalid = (key: string) => ({
    "aria-invalid": Boolean(errors[key]) || undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Application progress">
        {STEPS.map((s, index) => (
          <li key={s.id} className="flex flex-col gap-2.5">
            <span className={cn("h-1 rounded-full transition-colors duration-700 ease-soft", index <= step ? "bg-ink" : "bg-ink/10")} />
            <button
              type="button"
              disabled={index > step}
              onClick={() => index < step && goTo(index)}
              className={cn(
                "hidden text-left text-[0.8125rem] tracking-[-0.008em] transition-colors duration-300 sm:block",
                index === step ? "font-medium text-ink" : index < step ? "text-stone hover:text-ink" : "text-mist",
              )}
              aria-current={index === step ? "step" : undefined}
            >
              {String(index + 1).padStart(2, "0")} · {s.title}
            </button>
          </li>
        ))}
      </ol>

      <form
        noValidate
        method="post"
        onSubmit={(event) => {
          event.preventDefault();
          if (isLast) submit();
          else next();
        }}
        className="@container relative flex flex-col gap-9 rounded-[2rem] bg-paper p-6 shadow-card sm:rounded-[2.25rem] sm:p-10"
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />

        <div className="flex flex-col gap-2">
          <p className="text-[0.8125rem] font-medium text-accent sm:hidden">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="text-title text-ink outline-none">
            {current.title}
          </h2>
          <p className="text-stone">{current.description}</p>
        </div>

        {current.id === "interest" ? (
          <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3" data-field="intent">
              <legend className="mb-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">I would like to…</legend>
              <div className="grid gap-2 @md:grid-cols-2">
                {(Object.keys(INTENTS) as (keyof typeof INTENTS)[]).map((key) => (
                  <ChoiceCard key={key} name="intent" value={key} checked={values.intent === key} onChange={() => set("intent", key)} title={INTENTS[key]} />
                ))}
              </div>
            </fieldset>

            <div data-field="program">
              <Field id="program" label="Educational program" required error={err("program")}>
                <Select id="program" value={values.program} onChange={(event) => set("program", event.target.value)} {...invalid("program")}>
                  <option value="">Choose a program</option>
                  {[...new Set(options.programs.map((p) => p.category))].map((category) => (
                    <optgroup key={category} label={category}>
                      {options.programs
                        .filter((p) => p.category === category)
                        .map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.title}
                            {p.accepting ? "" : " (waiting list)"}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                  <option value="undecided">Not sure yet — I&apos;d like advice</option>
                </Select>
              </Field>
            </div>

            <fieldset className="flex flex-col" data-field="format">
              <legend className="mb-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">
                Preferred teaching format <span className="text-accent">*</span>
              </legend>
              <div className="grid gap-2 @xl:grid-cols-3">
                {(Object.keys(FORMATS) as (keyof typeof FORMATS)[]).map((key) => {
                  const unavailable = program && ((key === "PRIVATE" && !program.private) || (key === "GROUP" && !program.group));
                  return (
                    <ChoiceCard
                      key={key}
                      name="format"
                      value={key}
                      checked={values.format === key}
                      onChange={() => set("format", key)}
                      title={FORMATS[key]}
                      description={unavailable ? "Not offered for this program" : key === "PRIVATE" ? "Personal, flexible" : key === "GROUP" ? "Small cohort, fixed schedule" : "Let the instructor advise"}
                      className={cn(unavailable && "opacity-50")}
                    />
                  );
                })}
              </div>
              {err("format") ? (
                <p id="format-error" className="mt-2 text-sm text-accent" role="alert">
                  {err("format")}
                </p>
              ) : null}
            </fieldset>

            {showPackage || showClass ? (
              <div className="grid gap-6 @lg:grid-cols-2">
                {showPackage ? (
                  <div data-field="package">
                    <Field id="package" label="Private lesson package" error={err("package")} hint="You can decide later with the instructor.">
                      <Select id="package" value={values.package} onChange={(event) => set("package", event.target.value)} {...invalid("package")}>
                        <option value="">Not sure yet</option>
                        {options.packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                ) : null}
                {showClass ? (
                  <div data-field="classId">
                    <Field id="classId" label="Group class" error={err("classId")} hint="Choose a cohort, or leave open.">
                      <Select id="classId" value={values.classId} onChange={(event) => set("classId", event.target.value)} {...invalid("classId")}>
                        <option value="">Next available class</option>
                        {programClasses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                ) : null}
              </div>
            ) : null}

            {show.level.visible ? (
              <fieldset className="flex flex-col" data-field="level">
                <legend className="mb-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">
                  Current knowledge level {show.level.required ? <span className="text-accent">*</span> : <span className="ml-1 text-xs font-normal text-mist">Optional</span>}
                </legend>
                <div className="grid gap-2 @xl:grid-cols-3">
                  {(Object.keys(LEVELS) as (keyof typeof LEVELS)[]).map((key) => (
                    <ChoiceCard
                      key={key}
                      name="level"
                      value={key}
                      checked={values.level === key}
                      onChange={() => set("level", key)}
                      title={LEVELS[key]}
                      description={key === "BEGINNER" ? "New to the subject" : key === "INTERMEDIATE" ? "Some solid experience" : "Looking for depth"}
                    />
                  ))}
                </div>
                {err("level") ? (
                  <p id="level-error" className="mt-2 text-sm text-accent" role="alert">
                    {err("level")}
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            <ExtraQuestions questions={extrasFor("interest")} values={values.extra} errors={errors} onChange={setExtra} />
          </div>
        ) : null}

        {current.id === "about" ? (
          <div className="grid gap-6 @lg:grid-cols-2">
            <div data-field="fullName" className="@lg:col-span-2">
              <Field id="fullName" label="Full name" required error={err("fullName")}>
                <Input id="fullName" autoComplete="name" value={values.fullName} onChange={(event) => set("fullName", event.target.value)} {...invalid("fullName")} />
              </Field>
            </div>
            <div data-field="email">
              <Field id="email" label="Email address" required error={err("email")}>
                <Input id="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(event) => set("email", event.target.value)} {...invalid("email")} />
              </Field>
            </div>
            {show.phone.visible ? (
              <div data-field="phone">
                <Field
                  id="phone"
                  label="Phone number"
                  required={show.phone.required || values.preferredContact === "PHONE" || values.preferredContact === "WHATSAPP"}
                  error={err("phone")}
                  hint="Include the country code, e.g. +39 …"
                >
                  <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(event) => set("phone", event.target.value)} {...invalid("phone")} />
                </Field>
              </div>
            ) : null}
            {show.country.visible ? (
              <div data-field="country">
                <Field id="country" label="Country" required={show.country.required} error={err("country")}>
                  <Select id="country" autoComplete="country" value={values.country} onChange={(event) => set("country", event.target.value)} {...invalid("country")}>
                    <option value="">Select your country</option>
                    {options.countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            ) : null}
            {show.preferredContact.visible ? (
              <fieldset className="flex flex-col @lg:col-span-2" data-field="preferredContact">
                <legend className="mb-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">
                  Preferred contact method {show.preferredContact.required ? <span className="text-accent">*</span> : null}
                </legend>
                <div className="grid grid-cols-2 gap-2 @xl:grid-cols-4">
                  {(Object.keys(CONTACT_METHODS) as (keyof typeof CONTACT_METHODS)[]).map((key) => (
                    <ChoiceCard key={key} name="preferredContact" value={key} checked={values.preferredContact === key} onChange={() => set("preferredContact", key)} title={CONTACT_METHODS[key]} />
                  ))}
                </div>
                {err("preferredContact") ? (
                  <p className="mt-2 text-sm text-accent" role="alert">
                    {err("preferredContact")}
                  </p>
                ) : null}
              </fieldset>
            ) : null}
          </div>
        ) : null}

        {current.id === "goals" ? (
          <div className="grid gap-6 @lg:grid-cols-2">
            {show.objectives.visible ? (
              <div data-field="objectives" className="@lg:col-span-2">
                <Field id="objectives" label="Learning objectives" required={show.objectives.required} error={err("objectives")} hint="What would you like to be able to do at the end?">
                  <Textarea id="objectives" value={values.objectives} onChange={(event) => set("objectives", event.target.value)} maxLength={2000} {...invalid("objectives")} />
                </Field>
              </div>
            ) : null}
            {show.experience.visible ? (
              <div data-field="experience" className="@lg:col-span-2">
                <Field id="experience" label="Previous experience" required={show.experience.required} error={err("experience")}>
                  <Textarea id="experience" className="min-h-24" value={values.experience} onChange={(event) => set("experience", event.target.value)} maxLength={2000} {...invalid("experience")} />
                </Field>
              </div>
            ) : null}
            {show.topics.visible ? (
              <div data-field="topics" className="@lg:col-span-2">
                <Field id="topics" label="Specific topics of interest" required={show.topics.required} error={err("topics")}>
                  <Input id="topics" value={values.topics} onChange={(event) => set("topics", event.target.value)} maxLength={1000} {...invalid("topics")} />
                </Field>
              </div>
            ) : null}
            {show.availability.visible ? (
              <>
                <fieldset className="flex flex-col @lg:col-span-2" data-field="preferredDays">
                  <legend className="mb-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">
                    Preferred days {show.availability.required ? <span className="text-accent">*</span> : <span className="ml-1 text-xs font-normal text-mist">Optional</span>}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(DAYS) as (keyof typeof DAYS)[]).map((key) => {
                      const checked = values.preferredDays.includes(key);
                      return (
                        <label
                          key={key}
                          className={cn(
                            "grid h-11 min-w-14 cursor-pointer place-items-center rounded-[0.75rem] px-4 text-[0.9375rem] transition-all duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
                            checked ? "bg-ink text-white" : "bg-paper text-graphite ring-1 ring-ink/12 ring-inset hover:ring-ink/30",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={(event) =>
                              set("preferredDays", event.target.checked ? [...values.preferredDays, key] : values.preferredDays.filter((d) => d !== key))
                            }
                          />
                          {DAYS[key]}
                        </label>
                      );
                    })}
                  </div>
                  {err("preferredDays") ? <p className="mt-2 text-sm text-accent">{err("preferredDays")}</p> : null}
                </fieldset>
                <fieldset className="flex flex-col @lg:col-span-2" data-field="preferredTime">
                  <legend className="mb-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">Preferred time of day</legend>
                  <div className="grid grid-cols-2 gap-2 @xl:grid-cols-4">
                    {(Object.keys(TIMES) as (keyof typeof TIMES)[]).map((key) => (
                      <ChoiceCard key={key} name="preferredTime" value={key} checked={values.preferredTime === key} onChange={() => set("preferredTime", key)} title={TIMES[key]} />
                    ))}
                  </div>
                  {err("preferredTime") ? <p className="mt-2 text-sm text-accent">{err("preferredTime")}</p> : null}
                </fieldset>
              </>
            ) : null}
            {show.timezone.visible ? (
              <div data-field="timezone">
                <Field id="timezone" label="Time zone" required={show.timezone.required} error={err("timezone")}>
                  <Select id="timezone" value={values.timezone} onChange={(event) => set("timezone", event.target.value)} {...invalid("timezone")}>
                    <option value="">Select your time zone</option>
                    {values.timezone && !options.timezones.includes(values.timezone) ? <option value={values.timezone}>{values.timezone}</option> : null}
                    {options.timezones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone.replace(/_/g, " ")}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            ) : null}
            {show.preferredStartDate.visible ? (
              <div data-field="preferredStartDate">
                <Field id="preferredStartDate" label="Preferred start date" required={show.preferredStartDate.required} error={err("preferredStartDate")}>
                  <Input
                    id="preferredStartDate"
                    type="date"
                    value={values.preferredStartDate}
                    onChange={(event) => set("preferredStartDate", event.target.value)}
                    {...invalid("preferredStartDate")}
                  />
                </Field>
              </div>
            ) : null}
            <div className="@lg:col-span-2">
              <ExtraQuestions questions={extrasFor("availability")} values={values.extra} errors={errors} onChange={setExtra} />
            </div>
          </div>
        ) : null}

        {current.id === "details" ? (
          <div className="flex flex-col gap-6">
            {show.motivation.visible ? (
              <div data-field="motivation">
                <Field id="motivation" label="Why are you interested in this program?" required={show.motivation.required} error={err("motivation")}>
                  <Textarea id="motivation" className="min-h-24" value={values.motivation} onChange={(event) => set("motivation", event.target.value)} maxLength={2000} {...invalid("motivation")} />
                </Field>
              </div>
            ) : null}
            {show.comments.visible ? (
              <div data-field="comments">
                <Field id="comments" label="Additional questions or comments" required={show.comments.required} error={err("comments")}>
                  <Textarea id="comments" className="min-h-24" value={values.comments} onChange={(event) => set("comments", event.target.value)} maxLength={2000} {...invalid("comments")} />
                </Field>
              </div>
            ) : null}
            <ExtraQuestions questions={extrasFor("details")} values={values.extra} errors={errors} onChange={setExtra} />

            <Summary values={values} options={options} />

            <div data-field="consent" className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-relaxed text-graphite">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(event) => set("consent", event.target.checked)}
                  className="mt-1 size-[1.05rem] shrink-0 accent-[#1d1d1f]"
                  {...invalid("consent")}
                />
                <span>
                  I agree that my information is used to review my application and contact me, as described in the{" "}
                  <Link href="/privacy" target="_blank" className="text-ink underline underline-offset-4">
                    privacy policy
                  </Link>
                  . <span className="text-accent">*</span>
                </span>
              </label>
              {err("consent") ? (
                <p id="consent-error" className="text-sm text-accent" role="alert">
                  {err("consent")}
                </p>
              ) : null}
            </div>

            {options.turnstileSiteKey ? <Turnstile siteKey={options.turnstileSiteKey} onToken={setTurnstileToken} /> : null}
          </div>
        ) : null}

        {formError ? (
          <p className="rounded-xl bg-[#fcefee] px-4 py-3.5 text-[0.9375rem] text-[#9f2a22]" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} disabled={pending}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
          ) : (
            <span className="text-[0.875rem] text-stone">About 5 minutes · no account needed</span>
          )}
          <Button type="submit" size="lg" disabled={pending || !hydrated}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : isLast ? (
              "Submit application"
            ) : (
              <>
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ExtraQuestions({
  questions,
  values,
  errors,
  onChange,
}: {
  questions: ExtraQuestion[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  if (!questions.length) return null;
  return (
    <>
      {questions.map((question) => {
        const id = `extra-${question.id}`;
        const key = `extra.${question.id}`;
        const value = values[question.id] ?? "";
        const aria = { "aria-invalid": Boolean(errors[key]) || undefined };
        return (
          <div key={question.id} data-field={key}>
            <Field id={id} label={question.label} required={question.required} hint={question.help} error={errors[key]}>
              {question.type === "select" ? (
                <Select id={id} value={value} onChange={(event) => onChange(question.id, event.target.value)} {...aria}>
                  <option value="">Choose an option</option>
                  {question.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : question.type === "textarea" ? (
                <Textarea id={id} className="min-h-24" value={value} onChange={(event) => onChange(question.id, event.target.value)} maxLength={1000} {...aria} />
              ) : (
                <Input id={id} value={value} onChange={(event) => onChange(question.id, event.target.value)} maxLength={1000} {...aria} />
              )}
            </Field>
          </div>
        );
      })}
    </>
  );
}

function Summary({ values, options }: { values: ApplicationValues; options: FormOptions }) {
  const program = options.programs.find((p) => p.slug === values.program);
  const groupClass = options.classes.find((c) => c.id === values.classId);
  const pack = options.packages.find((p) => p.id === values.package);
  const rows: [string, string][] = [
    ["Request", INTENTS[values.intent as keyof typeof INTENTS] ?? ""],
    ["Program", program?.title ?? (values.program === "undecided" ? "Not sure yet" : "")],
    ["Format", FORMATS[values.format as keyof typeof FORMATS] ?? ""],
    ["Class / package", groupClass?.name ?? pack?.name ?? "To be discussed"],
    ["Name", values.fullName],
    ["Email", values.email],
  ];
  return (
    <div className="rounded-2xl bg-sand p-5 sm:p-6">
      <p className="eyebrow mb-4">Review</p>
      <dl className="grid gap-x-6 gap-y-3 @md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="text-xs text-stone">{label}</dt>
            <dd className="truncate text-[0.9375rem] text-ink">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SuccessPanel({ ref, reference, emailSent, responseTime }: { ref: React.Ref<HTMLDivElement>; reference: string; emailSent: boolean; responseTime: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div ref={ref} className="scroll-mt-28 animate-rise rounded-[2rem] bg-paper p-8 shadow-card sm:rounded-[2.25rem] sm:p-12" role="status" aria-live="polite">
      <span className="grid size-14 place-items-center rounded-full bg-ink text-white">
        <Check className="size-6" aria-hidden />
      </span>
      <h2 className="mt-8 text-headline text-balance text-ink">{applicationForm.successTitle}</h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone">
        {applicationForm.successMessage}
        {emailSent ? " A confirmation has been sent to your email." : ""}
      </p>
      <div className="mt-8 inline-flex flex-wrap items-center gap-5 rounded-2xl bg-sand px-5 py-4">
        <div>
          <p className="text-xs text-stone">Your application reference</p>
          <p className="font-mono text-xl tracking-wider text-ink">{reference}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard?.writeText(reference).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <ol className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
        {[
          ["Personal review", "The instructor reads your application personally."],
          ["A conversation", `You'll be contacted ${responseTime} to discuss format, schedule and pricing.`],
          ["Welcome to Slack", "Once confirmed, you're invited to the Slack workspace where lessons take place."],
        ].map(([title, body], index) => (
          <li key={title} className="flex flex-col gap-2">
            <span className="text-sm text-accent tabular-nums">0{index + 1}</span>
            <p className="font-medium text-ink">{title}</p>
            <p className="text-[0.9375rem] leading-relaxed text-stone">{body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/how-it-works" variant="outline">
          How lessons work
        </ButtonLink>
        <ButtonLink href="/programs" variant="ghost">
          Back to programs
        </ButtonLink>
      </div>
    </div>
  );
}
