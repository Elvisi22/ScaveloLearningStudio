import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ClosingCta } from "@/components/site/closing-cta";
import { FaqList } from "@/components/site/faq-list";
import { ProgramCard } from "@/components/site/program-card";
import { Reveal } from "@/components/site/reveal";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { formats, privatePackages } from "@/content/copy";
import { faqs } from "@/content/faqs";
import { photos } from "@/content/media";
import { testimonials } from "@/content/people";
import { programs } from "@/content/programs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Private 1-on-1 lessons",
  description: "Personalised, instructor-led private lessons adapted to your level, goals and schedule.",
  alternates: { canonical: "/private-lessons" },
};

const flow = [
  { title: "Apply", body: "Share your goals, level and availability in a short application." },
  { title: "Consultation", body: "A personal conversation to agree on objectives, package, schedule and price." },
  { title: "Your plan", body: "The instructor prepares a learning plan and lessons built around you." },
  { title: "Learn on Slack", body: "Your own private channel and live, PowerPoint-led sessions in huddles." },
];

export default function PrivateLessonsPage() {
  const privatePrograms = programs.filter((program) => program.formats.private.available);
  const quotes = testimonials.filter((t) => t.format === "PRIVATE");
  const relevantFaqs = faqs.filter((faq) =>
    ["How do I book a private lesson?", "Can I reschedule a lesson?", "How does payment work?", "Where are the lessons held?"].includes(faq.question),
  );

  return (
    <>
      <PageHero eyebrow={formats.private.eyebrow} title={formats.private.title} body={formats.private.body} photo={photos.private}>
        <ButtonLink href="/apply?format=PRIVATE" size="lg">
          {formats.private.cta.label}
        </ButtonLink>
        <TextLink href="/apply?format=PRIVATE&intent=CONSULTATION">Book a consultation</TextLink>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <SectionHeading eyebrow="Why private" title="The instructor’s full attention." muted="Every minute." className="lg:sticky lg:top-28 lg:self-start" />
          <Reveal delay={100}>
            <ul className="flex flex-col border-t border-line-strong/70">
              {formats.private.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-4 border-b border-line-strong/70 py-6 text-[1.1875rem] tracking-[-0.018em] text-ink">
                  <Check className="mt-1 size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" id="packages">
        <SectionHeading
          eyebrow="Packages"
          title="Start with one lesson,"
          muted="or commit to a plan."
          body="Prices depend on the program and are confirmed during your consultation. Every package is scheduled around your availability."
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {privatePackages.map((pack, index) => {
            const highlight = "highlight" in pack && pack.highlight;
            return (
              <Reveal
                key={pack.id}
                delay={index * 80}
                className={cn(
                  "flex flex-col gap-7 rounded-[1.75rem] p-8 transition-[box-shadow,transform] duration-700 ease-soft hover:-translate-y-1",
                  highlight ? "spotlight text-white" : "bg-paper shadow-hairline hover:shadow-lift",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className={cn("font-display text-[3.25rem] leading-none font-extralight tracking-[-0.06em] tabular-nums", highlight ? "text-white" : "text-ink")}>
                    {pack.lessons}
                  </p>
                  {highlight ? <span className="rounded-md bg-white/12 px-2 py-1 text-[0.6875rem] font-medium text-white">Most chosen</span> : null}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-subtitle">{pack.name}</h3>
                  <p className={cn("text-[0.9375rem] leading-relaxed", highlight ? "text-white/65" : "text-stone")}>{pack.description}</p>
                </div>
                <ul className={cn("flex flex-col gap-2.5 border-t pt-5", highlight ? "border-white/10" : "border-line")}>
                  {pack.benefits.map((benefit) => (
                    <li key={benefit} className={cn("flex items-start gap-2.5 text-[0.875rem]", highlight ? "text-white/85" : "text-graphite")}>
                      <Check className={cn("mt-0.5 size-4 shrink-0", highlight ? "text-accent-light" : "text-accent")} strokeWidth={2} aria-hidden />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={`/apply?format=PRIVATE&package=${pack.id}`} variant={highlight ? "light" : "secondary"} size="sm" className="mt-auto self-start">
                  Apply for this package
                </ButtonLink>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="The process" title="How private lessons begin." align="center" />
        <ol className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {flow.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 80} className="flex flex-col gap-3 border-t border-ink pt-6">
              <span className="text-[0.8125rem] font-medium text-accent tabular-nums">Step {index + 1}</span>
              <h3 className="text-subtitle text-ink">{step.title}</h3>
              <p className="text-body text-stone">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="paper">
        <SectionHeading eyebrow="Available privately" title="Programs offered 1-on-1." action={<TextLink href="/programs?format=private">See all</TextLink>} />
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {privatePrograms.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </Section>

      <TestimonialsSection items={quotes} eyebrow="Private students" tone="sand" />

      <Section>
        <SectionHeading eyebrow="Questions" title="Private lessons, explained." align="center" />
        <Reveal className="mx-auto mt-14 max-w-3xl">
          <FaqList items={relevantFaqs} />
        </Reveal>
      </Section>

      <ClosingCta title="Begin with a conversation." body="Apply for private lessons and the instructor will contact you to plan your first session." />
    </>
  );
}
