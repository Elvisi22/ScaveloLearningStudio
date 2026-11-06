import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, MessageSquare } from "lucide-react";
import { ClassCard } from "@/components/site/class-card";
import { ClosingCta } from "@/components/site/closing-cta";
import { JsonLd } from "@/components/site/json-ld";
import { ProgramCard } from "@/components/site/program-card";
import { ProgramCover } from "@/components/site/program-cover";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { Badge, Dot } from "@/components/ui/badge";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { testimonials } from "@/content/people";
import { LEVEL_LABELS, programs, type Price, type Program } from "@/content/programs";
import { site } from "@/content/site";
import { classesForProgram, getProgram } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return { title: "Program not found" };
  return {
    title: program.title,
    description: program.shortDescription,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: { title: `${program.title} — ${site.name}`, description: program.shortDescription, url: `/programs/${program.slug}` },
  };
}

export default function ProgramPage({ params }: Props) {
  return (
    <Suspense fallback={<ProgramSkeleton />}>
      <ProgramDetail params={params} />
    </Suspense>
  );
}

async function ProgramDetail({ params }: Props) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const classes = classesForProgram(program.slug);
  const related = programs.filter((p) => p.slug !== program.slug && p.category === program.category).slice(0, 3);
  const quotes = testimonials.filter((t) => t.programSlug === program.slug);
  const apply = (query: string) => `/apply?program=${program.slug}${query}`;
  const canApply = program.acceptingApplications;
  const formats = [program.formats.private.available && "Private", program.formats.group.available && "Group"].filter(Boolean).join(" · ");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "pricing", label: "Pricing" },
    ...(program.formats.group.available ? [{ id: "classes", label: "Group classes" }] : []),
  ];

  return (
    <>
      <CourseJsonLd program={program} />

      {/* Local navigation */}
      <nav aria-label={`${program.title} sections`} className="glass sticky top-12 z-30 border-b border-ink/[0.07]">
        <div className="container-page flex h-[3.25rem] items-center justify-between gap-6">
          <Link href="/programs" className="truncate text-[1.0625rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.1875rem]">
            {program.title}
          </Link>
          <div className="flex shrink-0 items-center gap-6">
            <ul className="hidden items-center gap-6 md:flex">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-[0.8125rem] text-ink/70 transition-colors duration-300 hover:text-ink">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
            <ButtonLink href={apply(canApply ? "" : "&intent=INTEREST")} size="sm" className="h-8 rounded-lg px-3.5 text-[0.8125rem]">
              {canApply ? "Apply" : "Express interest"}
            </ButtonLink>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 sm:pt-24">
        <div className="container-page">
          <div className="mx-auto flex max-w-4xl animate-rise flex-col items-center gap-6 text-center">
            <p className="eyebrow">
              {program.category} · {LEVEL_LABELS[program.level]}
            </p>
            <h1 className="text-hero text-balance text-ink">{program.title}</h1>
            <p className="text-lead max-w-2xl text-pretty text-stone">{program.tagline}</p>
            <Badge tone={canApply ? "success" : "warning"}>
              <Dot />
              {canApply ? "Accepting applications" : "Waiting list open"}
            </Badge>
            <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
              <ButtonLink href={apply(canApply ? "" : "&intent=INTEREST")} size="lg">
                {canApply ? "Apply now" : "Express interest"}
              </ButtonLink>
              <TextLink href={apply("&intent=CONSULTATION")}>Book a consultation</TextLink>
            </div>
            <p className="text-[0.875rem] text-stone">
              Or{" "}
              <Link href={apply("&intent=INFORMATION")} className="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink">
                request information
              </Link>{" "}
              — no account or payment needed.
            </p>
          </div>
        </div>
        <div className="container-wide mt-14 animate-rise [animation-delay:180ms] sm:mt-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-[21/9] sm:rounded-[2.25rem]">
            <ProgramCover program={program} preload parallax sizes="100vw" className="absolute inset-0" />
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-14 sm:py-20">
        <dl className="container-page grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-line">
          <Fact value={program.duration} label="Duration" />
          <Fact value={String(program.lessonCount)} label="Live lessons" />
          <Fact value={`${program.sessionMinutes} min`} label="Per session" />
          <Fact value={formats} label="Formats" />
        </dl>
      </section>

      {/* Overview */}
      <Section id="overview" tone="paper" className="scroll-mt-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <SectionHeading eyebrow="Overview" title={program.shortDescription} className="lg:sticky lg:top-36 lg:self-start [&_h2]:text-title" />
          <Reveal delay={100} className="flex flex-col gap-12">
            <div className="prose-academy text-lead text-graphite">
              {program.description.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-subtitle text-ink">What you will learn</h3>
              <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-8">
                {program.objectives.map((objective) => (
                  <li key={objective} className="flex items-start gap-3 border-b border-line py-4 text-[0.9375rem] leading-relaxed text-graphite">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} aria-hidden />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          <Aside title="Who it is for" items={program.audience} />
          <Aside title="Prerequisites" items={program.prerequisites} />
        </div>
        <Reveal className="mt-4 flex items-start gap-4 rounded-[1.5rem] bg-sand p-6 text-[0.9375rem] leading-relaxed text-graphite sm:p-8">
          <MessageSquare className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
          <p>Lessons are taught live in Slack and presented in PowerPoint. Access to the workspace is arranged personally by the instructor once your place is confirmed.</p>
        </Reveal>
      </Section>

      {/* Curriculum */}
      <Section id="curriculum" className="scroll-mt-28">
        <SectionHeading eyebrow="Curriculum" title="How the program unfolds." body="An outline of the journey. Depth and pace are adapted to each private student and group." />
        <ol className="mt-14 border-t border-line-strong/70 sm:mt-16">
          {program.curriculum.map((module, index) => (
            <Reveal
              as="li"
              key={module.title}
              delay={(index % 4) * 60}
              className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-b border-line-strong/70 py-7 sm:grid-cols-[5rem_1fr_1.4fr] sm:gap-x-8 sm:py-8"
            >
              <span className="text-[0.9375rem] font-medium text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-subtitle text-ink">{module.title}</h3>
              <p className="col-start-2 text-body text-stone sm:col-start-3">{module.description}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Formats & pricing */}
      <Section id="pricing" tone="sand" className="scroll-mt-28">
        <SectionHeading eyebrow="Formats & pricing" title="Choose how you learn it." body="Indicative prices. Your exact plan and price are confirmed personally after your application." align="center" />
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-2">
          <PricingCard
            title="Private 1-on-1"
            description="The full program taught around your goals, pace and schedule."
            available={program.formats.private.available}
            price={program.formats.private.price}
            href={apply("&format=PRIVATE")}
            cta="Apply for private lessons"
            dark
          />
          <PricingCard
            title="Group class"
            description="Learn in a small cohort on a fixed schedule, with discussion at the centre."
            available={program.formats.group.available}
            price={program.formats.group.price}
            href={apply("&format=GROUP")}
            cta="Apply for group lessons"
          />
        </div>
      </Section>

      {/* Upcoming group sessions */}
      {program.formats.group.available ? (
        <Section id="classes" className="scroll-mt-28">
          <SectionHeading eyebrow="Group classes" title={classes.length ? "Next cohorts." : "No cohort scheduled yet."} muted={classes.length ? "Seats are limited." : undefined} />
          {classes.length ? (
            <div className="mt-14 flex flex-col gap-3">
              {classes.map((groupClass) => (
                <ClassCard key={groupClass.id} groupClass={groupClass} showProgram={false} />
              ))}
            </div>
          ) : (
            <Reveal className="mt-8 flex flex-col items-start gap-6">
              <p className="text-lead max-w-xl text-stone">Register your interest and you’ll be the first to know when the next group opens.</p>
              <ButtonLink href={apply("&format=GROUP&intent=INTEREST")} variant="secondary">
                Register interest
              </ButtonLink>
            </Reveal>
          )}
        </Section>
      ) : null}

      <TestimonialsSection items={quotes} eyebrow="From students of this program" />

      {related.length ? (
        <Section tone="sand">
          <SectionHeading eyebrow="Related programs" title="You may also like." />
          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProgramCard key={p.slug} program={p} />
            ))}
          </div>
        </Section>
      ) : null}

      <ClosingCta title={`Ready to begin ${program.title}?`} />
    </>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-4 text-center">
      <dd className="text-[1.75rem] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[2.25rem]">{value}</dd>
      <dt className="order-2 text-[0.875rem] text-stone">{label}</dt>
    </div>
  );
}

function Aside({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal className="flex flex-col gap-5 rounded-[1.5rem] bg-ivory p-7 shadow-hairline sm:p-9">
      <h3 className="text-subtitle text-ink">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-graphite">
            <span className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function PricingCard({
  title,
  description,
  available,
  price,
  href,
  cta,
  dark,
}: {
  title: string;
  description: string;
  available: boolean;
  price: Price;
  href: string;
  cta: string;
  dark?: boolean;
}) {
  const isDark = dark && available;
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6 rounded-[2rem] p-8 sm:p-11",
        !available ? "bg-ivory/60 text-stone shadow-hairline" : isDark ? "spotlight text-white" : "bg-paper shadow-hairline",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className={cn("text-title", available && !isDark && "text-ink")}>{title}</h3>
        {!available ? <Badge tone="outline">Not offered</Badge> : null}
      </div>
      <p className={cn("text-body max-w-md", isDark ? "text-white/65" : "text-stone")}>{description}</p>
      <div className={cn("mt-auto border-t pt-6", isDark ? "border-white/10" : "border-line")}>
        {!available ? (
          <p className="text-[0.9375rem]">This program isn’t offered in this format.</p>
        ) : price ? (
          <p>
            <span className="text-[3rem] leading-none font-semibold tracking-[-0.045em]">{formatPrice(price.amount)}</span>
            <span className={cn("ml-2 text-[0.9375rem]", isDark ? "text-white/55" : "text-stone")}>{price.unit}</span>
          </p>
        ) : (
          <p className="text-[2rem] leading-tight font-semibold tracking-[-0.035em]">Price on request</p>
        )}
      </div>
      {available ? (
        <ButtonLink href={href} variant={isDark ? "light" : "primary"} className="self-start">
          {cta}
        </ButtonLink>
      ) : null}
    </Reveal>
  );
}

function CourseJsonLd({ program }: { program: Program }) {
  const offers = [program.formats.private, program.formats.group]
    .filter((format) => format.available && format.price)
    .map((format) => ({ "@type": "Offer", price: format.price!.amount, priceCurrency: site.currency, category: format.price!.unit }));
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: program.title,
        description: program.shortDescription,
        url: `${site.url}/programs/${program.slug}`,
        provider: { "@type": "EducationalOrganization", name: site.legalName, sameAs: site.url },
        educationalLevel: LEVEL_LABELS[program.level],
        teaches: program.objectives,
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: `PT${program.sessionMinutes}M` },
        ...(offers.length ? { offers } : {}),
      }}
    />
  );
}

function ProgramSkeleton() {
  return (
    <div className="container-page flex animate-pulse flex-col items-center gap-6 py-28" aria-busy>
      <div className="h-4 w-40 rounded-md bg-sand-deep" />
      <div className="h-16 w-3/4 max-w-2xl rounded-2xl bg-sand-deep" />
      <div className="h-6 w-1/2 max-w-md rounded-lg bg-sand-deep" />
      <div className="mt-10 aspect-[21/9] w-full rounded-[2.25rem] bg-sand-deep" />
    </div>
  );
}
