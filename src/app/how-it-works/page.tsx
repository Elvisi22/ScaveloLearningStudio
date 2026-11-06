import type { Metadata } from "next";
import { ClosingCta } from "@/components/site/closing-cta";
import { FormatsSection } from "@/components/site/formats-section";
import { Reveal } from "@/components/site/reveal";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { StepsSection } from "@/components/site/steps-section";
import { ToolsSection } from "@/components/site/tools-section";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { photos } from "@/content/media";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "How it works",
  description: "How applications, private and group lessons, Slack and PowerPoint come together at Scavelo Learning Studio.",
  alternates: { canonical: "/how-it-works" },
};

const afterApplying = [
  { title: "You receive a reference", body: "Straight after applying you see your application reference. Keep it handy if you contact us." },
  {
    title: "The instructor reviews it personally",
    body: `Every application is read by the instructor — not an assistant or an algorithm — and you are contacted ${site.contact.responseTime}.`,
  },
  { title: "A short conversation", body: "By email, phone or a quick call, you agree on the right program, format, schedule and price. There is no obligation." },
  { title: "Confirmation & Slack invitation", body: "When you decide to go ahead, your place is confirmed and you receive an invitation to the Slack workspace and your channel." },
  { title: "Live lessons begin", body: "Sessions take place in Slack huddles, presented live from PowerPoint, with questions and resources in your channel between lessons." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Simple to begin."
        muted="Personal from the first message."
        body="No accounts and no automatic checkouts. You apply, the instructor gets in touch, and your lessons begin on Slack."
        photo={photos.approach}
      >
        <ButtonLink href="/apply" size="lg">
          Start your application
        </ButtonLink>
        <TextLink href="/programs">Explore programs</TextLink>
      </PageHero>

      <StepsSection tone="ivory" />

      <Section tone="paper">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <SectionHeading eyebrow="After you apply" title="What happens next." className="lg:sticky lg:top-28 lg:self-start" />
          <ol className="relative flex flex-col">
            {afterApplying.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 60} className="grid grid-cols-[2.5rem_1fr] gap-x-5 pb-12 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <span className="grid size-9 place-items-center rounded-full bg-ink text-[0.8125rem] font-semibold text-white tabular-nums">{index + 1}</span>
                  {index < afterApplying.length - 1 ? <span aria-hidden className="mt-3 w-px flex-1 bg-line-strong" /> : null}
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <h3 className="text-subtitle text-ink">{item.title}</h3>
                  <p className="text-body max-w-xl text-stone">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <div className="py-2 sm:py-3">
        <ToolsSection />
      </div>

      <FormatsSection />

      <ClosingCta />
    </>
  );
}
