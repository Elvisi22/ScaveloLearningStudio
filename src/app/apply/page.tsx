import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, MessageSquare, ShieldCheck, Wallet } from "lucide-react";
import { getCountries } from "libphonenumber-js/min";
import { ApplicationForm, type FormOptions } from "@/components/forms/application-form";
import { applicationForm } from "@/content/application-form";
import { CLASS_STATUS_LABELS } from "@/content/classes";
import { privatePackages } from "@/content/copy";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { classStatus, isBookable, upcomingClasses } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for private lessons or a group class. No account or payment needed — the instructor will contact you personally.",
  alternates: { canonical: "/apply" },
};

const reassurance = [
  { icon: Clock, title: "About five minutes", body: "Four short steps. You can go back at any time." },
  { icon: Wallet, title: "Nothing to pay", body: "No payment or commitment. Pricing is confirmed personally." },
  { icon: MessageSquare, title: "A personal reply", body: `The instructor contacts you ${site.contact.responseTime}.` },
  { icon: ShieldCheck, title: "Your data, protected", body: "Used only to review your application. No account is created." },
];

function buildOptions(): FormOptions {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return {
    programs: programs.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      private: p.formats.private.available,
      group: p.formats.group.available,
      accepting: p.acceptingApplications,
    })),
    classes: upcomingClasses().map((c) => ({
      id: c.id,
      name: c.name,
      programSlug: c.programSlug,
      bookable: isBookable(c),
      label: `Starts ${formatDate(c.startDate, { day: "numeric", month: "short", year: "numeric" })} · ${isBookable(c) ? "enrollment open" : CLASS_STATUS_LABELS[classStatus(c)].toLowerCase()}${classStatus(c) === "FULLY_BOOKED" ? " (waiting list)" : ""}`,
    })),
    packages: privatePackages.map((p) => ({ id: p.id, name: p.name, lessons: p.lessons })),
    countries: getCountries()
      .map((code) => ({ code: code as string, name: regionNames.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    timezones: Intl.supportedValuesOf("timeZone"),
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined,
    responseTime: site.contact.responseTime,
  };
}

export default function ApplyPage() {
  return (
    <section className="bg-sand pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="flex animate-rise flex-col gap-9 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Application</p>
            <h1 className="text-headline text-balance text-ink">
              Apply to learn with the instructor.
            </h1>
            <p className="text-body max-w-md text-stone">{applicationForm.intro}</p>
          </div>
          <ul className="grid grid-cols-1 gap-6 border-t border-ink/10 pt-9 sm:grid-cols-2 lg:grid-cols-1">
            {reassurance.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper shadow-hairline">
                  <Icon className="size-[1.1rem] text-accent" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[0.9375rem] font-semibold tracking-[-0.012em] text-ink">{title}</span>
                  <span className="text-[0.9375rem] leading-relaxed text-stone">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Suspense fallback={<FormSkeleton />}>
          <ApplicationForm options={buildOptions()} />
        </Suspense>
      </div>
    </section>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy aria-label="Loading form">
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-1 rounded-full bg-ink/10" />
        ))}
      </div>
      <div className="h-[36rem] animate-pulse rounded-[2.25rem] bg-paper shadow-card" />
    </div>
  );
}
