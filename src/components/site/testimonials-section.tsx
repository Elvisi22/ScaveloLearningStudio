import type { Testimonial } from "@/content/people";
import { Reveal } from "./reveal";
import { Section } from "./section";
import { TestimonialCarousel } from "./testimonial-carousel";

export function TestimonialsSection({
  items,
  eyebrow = "In their words",
  tone = "paper",
}: {
  items: Testimonial[];
  title?: string;
  eyebrow?: string;
  tone?: "ivory" | "paper" | "sand";
}) {
  if (!items.length) return null;
  return (
    <Section id="testimonials" tone={tone}>
      <Reveal className="flex flex-col items-center gap-12">
        <p className="eyebrow">{eyebrow}</p>
        <TestimonialCarousel items={items} />
      </Reveal>
    </Section>
  );
}
