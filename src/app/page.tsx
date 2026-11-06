import { CalendarClock, Hash, Presentation, UserRound } from "lucide-react";
import { BenefitsSection } from "@/components/site/benefits-section";
import { ClassCard } from "@/components/site/class-card";
import { ClosingCta } from "@/components/site/closing-cta";
import { FaqList } from "@/components/site/faq-list";
import { FormatsSection } from "@/components/site/formats-section";
import { HeroVisual } from "@/components/site/hero-visual";
import { InstructorSection } from "@/components/site/instructor-section";
import { JsonLd } from "@/components/site/json-ld";
import { CinematicImage } from "@/components/site/media";
import { ProgramCard } from "@/components/site/program-card";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { StepsSection } from "@/components/site/steps-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { ToolsSection } from "@/components/site/tools-section";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { hero, introduction } from "@/content/copy";
import { faqs } from "@/content/faqs";
import { photos } from "@/content/media";
import { instructor, testimonials } from "@/content/people";
import { site } from "@/content/site";
import { featuredPrograms, upcomingClasses } from "@/lib/catalog";

const AT_A_GLANCE = [
  { icon: UserRound, title: "Instructor-led", body: "Every lesson taught live" },
  { icon: CalendarClock, title: "1-on-1 or small groups", body: "Never more than ten" },
  { icon: Hash, title: "On Slack", body: "Lessons and community" },
  { icon: Presentation, title: "In PowerPoint", body: "Prepared for you" },
];

export default function HomePage() {
  const featured = featuredPrograms().slice(0, 3);
  const classes = upcomingClasses().slice(0, 3);
  const quotes = testimonials.filter((t) => t.featured).length ? testimonials.filter((t) => t.featured) : testimonials;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: site.legalName,
          alternateName: site.name,
          url: site.url,
          description: site.description,
          ...(site.contact.email ? { email: site.contact.email } : {}),
          areaServed: "Worldwide",
          address: [
            { "@type": "PostalAddress", addressLocality: "Tirana", addressCountry: "AL" },
            { "@type": "PostalAddress", addressCountry: "US" },
          ],
          founder: { "@type": "Person", name: instructor.name, jobTitle: instructor.role },
        }}
      />

      {/* Hero */}
      <section className="pt-16 sm:pt-24 lg:pt-28">
        <div className="container-page">
          <div className="mx-auto flex max-w-5xl animate-rise flex-col items-center gap-7 text-center">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="text-hero text-balance text-ink">
              {hero.title} <span className="text-mist">{hero.titleAccent}</span>
            </h1>
            <p className="text-lead max-w-2xl text-pretty text-stone">{hero.subtitle}</p>
            <div className="mt-1 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
              <ButtonLink href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </ButtonLink>
              <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
            </div>
          </div>
        </div>
        <div className="container-wide mt-14 animate-rise [animation-delay:200ms] sm:mt-20">
          <HeroVisual />
        </div>
        <div className="container-page">
          <ul className="grid grid-cols-2 gap-y-8 py-12 sm:py-16 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {AT_A_GLANCE.map(({ icon: Icon, title, body }, index) => (
              <Reveal as="li" key={title} delay={index * 70} className="flex flex-col items-center gap-2 px-4 text-center">
                <Icon className="mb-1 size-5 text-accent" strokeWidth={1.5} aria-hidden />
                <p className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">{title}</p>
                <p className="text-[0.8125rem] text-stone">{body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach */}
      <Section id="approach" tone="paper">
        <SectionHeading eyebrow={introduction.eyebrow} title={introduction.title} body={introduction.body} />
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 md:grid-cols-3 md:gap-8">
          {introduction.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 90} className="flex flex-col gap-3 border-t border-ink pt-6">
              <span className="text-[0.8125rem] font-medium text-accent tabular-nums">0{index + 1}</span>
              <h3 className="text-subtitle text-ink">{pillar.title}</h3>
              <p className="text-body text-stone">{pillar.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <div className="bg-paper pb-3 sm:pb-4">
        <div className="container-wide">
          <Reveal>
            <CinematicImage photo={photos.approach} fallback="stone" className="aspect-[4/3] sm:aspect-[21/9]" />
          </Reveal>
        </div>
      </div>

      <FormatsSection />

      <StepsSection />

      <div className="py-2 sm:py-3">
        <ToolsSection />
      </div>

      {/* Featured programs */}
      <Section id="programs">
        <SectionHeading
          eyebrow="Programs"
          title="Featured programs."
          muted="Taught live, by the person who wrote them."
          action={<TextLink href="/programs">View all programs</TextLink>}
        />
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-14 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((program, index) => (
            <Reveal key={program.slug} delay={index * 90} className="h-full">
              <ProgramCard program={program} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Upcoming group classes */}
      {classes.length ? (
        <Section id="classes" tone="sand">
          <SectionHeading
            eyebrow="Upcoming group classes"
            title="Join the next cohort."
            muted="Seats are limited."
            action={<TextLink href="/group-classes">All group classes</TextLink>}
          />
          <div className="mt-14 flex flex-col gap-3 sm:mt-16">
            {classes.map((groupClass, index) => (
              <Reveal key={groupClass.id} delay={index * 80}>
                <ClassCard groupClass={groupClass} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <InstructorSection />

      <TestimonialsSection items={quotes} />

      <BenefitsSection />

      {/* FAQ preview */}
      <Section id="faq">
        <SectionHeading eyebrow="Questions" title="Good to know." align="center" />
        <Reveal className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-10">
          <div className="w-full">
            <FaqList items={faqs.filter((faq) => faq.featured)} />
          </div>
          <TextLink href="/faq">Read all questions</TextLink>
        </Reveal>
      </Section>

      <ClosingCta />
    </>
  );
}
