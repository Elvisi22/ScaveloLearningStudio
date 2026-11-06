import type { Metadata } from "next";
import { ClosingCta } from "@/components/site/closing-cta";
import { InstructorPortrait } from "@/components/site/instructor-section";
import { JsonLd } from "@/components/site/json-ld";
import { ProgramCard } from "@/components/site/program-card";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { introduction } from "@/content/copy";
import { instructor, testimonials } from "@/content/people";
import { site } from "@/content/site";
import { featuredPrograms } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "The instructor",
  description: `Meet ${instructor.name}, ${instructor.role} at ${site.name}.`,
  alternates: { canonical: "/instructor" },
};

export default function InstructorPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: instructor.name,
          jobTitle: instructor.role,
          worksFor: { "@type": "EducationalOrganization", name: site.legalName },
          description: instructor.shortBio,
        }}
      />

      <section className="pt-16 sm:pt-24 lg:pt-28">
        <div className="container-page grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="flex animate-rise flex-col gap-7 lg:order-2">
            <p className="eyebrow">The instructor</p>
            <h1 className="text-hero text-balance text-ink">{instructor.name}</h1>
            <p className="text-lead text-stone">{instructor.role}</p>
            <blockquote className="text-lead border-l border-accent pl-6 font-light text-graphite italic">“{instructor.quote}”</blockquote>
            <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
              <ButtonLink href="/apply" size="lg" className="self-start">
                Apply to learn with {instructor.name.split(" ")[0]}
              </ButtonLink>
              <TextLink href="/contact">Ask a question</TextLink>
            </div>
          </div>
          <div className="animate-rise [animation-delay:150ms] lg:order-1">
            <InstructorPortrait className="aspect-[4/5]" preload />
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-24">
          <Reveal className="flex flex-col gap-7">
            <p className="eyebrow">Biography</p>
            <div className="prose-academy text-lead text-graphite">
              {instructor.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-10 lg:pt-10">
            <dl className="grid grid-cols-3 gap-6">
              {instructor.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 border-t border-ink pt-5">
                  <dt className="order-2 text-[0.8125rem] leading-snug text-stone">{stat.label}</dt>
                  <dd className="text-[2.25rem] leading-none font-semibold tracking-[-0.04em] text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-5 rounded-[1.75rem] bg-paper p-8 shadow-hairline">
              <h2 className="text-subtitle text-ink">Background</h2>
              <ul className="flex flex-col gap-3">
                {instructor.credentials.map((credential) => (
                  <li key={credential} className="flex gap-3 text-[0.9375rem] leading-relaxed text-graphite">
                    <span className="mt-[0.6rem] size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    {credential}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="Teaching philosophy" title={introduction.title} body={introduction.body} align="center" />
        <div className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 sm:gap-4 md:grid-cols-3">
          {introduction.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 80} className="flex flex-col gap-4 rounded-[1.75rem] bg-paper p-8 shadow-hairline sm:p-10">
              <span className="font-display text-[3rem] leading-none font-extralight tracking-[-0.06em] text-accent">{index + 1}</span>
              <h3 className="text-subtitle text-ink">{pillar.title}</h3>
              <p className="text-body text-stone">{pillar.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <TestimonialsSection items={testimonials} />

      <Section tone="sand">
        <SectionHeading eyebrow="Programs" title="Learn with the instructor." action={<TextLink href="/programs">All programs</TextLink>} />
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms().map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
