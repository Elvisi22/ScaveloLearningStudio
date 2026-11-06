import { steps } from "@/content/copy";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./section";

export function StepsSection({ tone = "sand" }: { tone?: "ivory" | "paper" | "sand" }) {
  return (
    <Section id="how-it-works" tone={tone}>
      <SectionHeading eyebrow={steps.eyebrow} title={steps.title} muted="Simple, and personal." align="center" />
      <ol className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {steps.items.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={index * 90}
            className="group flex flex-col gap-12 rounded-[1.75rem] bg-paper p-8 shadow-hairline transition-[box-shadow,transform] duration-700 ease-soft hover:-translate-y-1 hover:shadow-lift sm:min-h-[22rem]"
          >
            <span className="font-display text-[4rem] leading-none font-extralight tracking-[-0.06em] text-accent tabular-nums">{index + 1}</span>
            <div className="mt-auto flex flex-col gap-3">
              <h3 className="text-subtitle text-ink">{step.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-stone">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
