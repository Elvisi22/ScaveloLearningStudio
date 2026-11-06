import { BookOpen, GraduationCap, HeartHandshake, MessagesSquare, Sparkles, Users } from "lucide-react";
import { benefits } from "@/content/copy";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./section";

const ICONS = [GraduationCap, Sparkles, Users, MessagesSquare, BookOpen, HeartHandshake];

export function BenefitsSection({ tone = "sand" }: { tone?: "ivory" | "paper" | "sand" }) {
  return (
    <Section id="benefits" tone={tone}>
      <SectionHeading eyebrow={benefits.eyebrow} title={benefits.title} align="center" />
      <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Reveal key={item.title} delay={(index % 3) * 90} className="flex flex-col gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-paper text-ink shadow-hairline">
                <Icon className="size-5" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="text-subtitle text-ink">{item.title}</h3>
              <p className="text-body text-stone">{item.body}</p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
