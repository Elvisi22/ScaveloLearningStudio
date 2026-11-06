import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ClassCard } from "@/components/site/class-card";
import { ClosingCta } from "@/components/site/closing-cta";
import { FaqList } from "@/components/site/faq-list";
import { Reveal } from "@/components/site/reveal";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { formats } from "@/content/copy";
import { faqs } from "@/content/faqs";
import { photos } from "@/content/media";
import { testimonials } from "@/content/people";
import { upcomingClasses } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Group classes",
  description: "Small, instructor-led group classes with fixed schedules, limited seats and a dedicated Slack channel.",
  alternates: { canonical: "/group-classes" },
};

export default function GroupClassesPage() {
  const classes = upcomingClasses();
  const quotes = testimonials.filter((t) => t.format === "GROUP");
  const relevantFaqs = faqs.filter((faq) =>
    ["What happens if I miss a class?", "What is the difference between private and group lessons?", "How do I enroll?", "Can I access previous presentations?"].includes(
      faq.question,
    ),
  );

  return (
    <>
      <PageHero eyebrow={formats.group.eyebrow} title={formats.group.title} body={formats.group.body} photo={photos.group}>
        <ButtonLink href="#schedule" size="lg">
          See upcoming classes
        </ButtonLink>
        <TextLink href="/apply?format=GROUP">{formats.group.cta.label}</TextLink>
      </PageHero>

      <Section id="schedule" className="scroll-mt-16">
        <SectionHeading
          eyebrow="Schedule"
          title="Upcoming group classes."
          muted="Limited seats."
          body="Places are confirmed personally by the instructor. When a class is full, join the waiting list and you’ll be contacted if a seat opens."
        />
        <div className="mt-14 flex flex-col gap-3 sm:mt-16">
          {classes.length ? (
            classes.map((groupClass, index) => (
              <Reveal key={groupClass.id} delay={index * 60}>
                <ClassCard groupClass={groupClass} />
              </Reveal>
            ))
          ) : (
            <p className="text-lead text-stone">New classes are being scheduled. Register your interest to hear first.</p>
          )}
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <SectionHeading
            eyebrow="Learning together"
            title="Small groups."
            muted="Real discussion."
            body="Groups are deliberately capped so that everyone is seen, heard and challenged."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <Reveal delay={100}>
            <ul className="flex flex-col border-t border-line-strong/70">
              {formats.group.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-4 border-b border-line-strong/70 py-6 text-[1.1875rem] tracking-[-0.018em] text-ink">
                  <Check className="mt-1 size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <TestimonialsSection items={quotes} eyebrow="Group students" tone="sand" />

      <Section>
        <SectionHeading eyebrow="Questions" title="Group classes, explained." align="center" />
        <Reveal className="mx-auto mt-14 max-w-3xl">
          <FaqList items={relevantFaqs} />
        </Reveal>
      </Section>

      <ClosingCta title="Save your seat." body="Apply for the class that suits you. The instructor confirms every place personally." />
    </>
  );
}
