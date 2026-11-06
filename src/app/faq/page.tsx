import type { Metadata } from "next";
import { ClosingCta } from "@/components/site/closing-cta";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/section";
import { TextLink } from "@/components/ui/button";
import { faqs } from "@/content/faqs";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Questions & answers",
  description: "How lessons work, where they take place, why Slack and PowerPoint are used, and what happens after you apply.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const groups = [...new Set(faqs.map((faq) => faq.category))].map((category) => ({
    category,
    items: faqs.filter((faq) => faq.category === category),
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <PageHero eyebrow="Support" title="Questions & answers." body="Everything you might want to know before applying. Can’t find your answer? Ask us directly.">
        <TextLink href="/contact">Contact the instructor</TextLink>
      </PageHero>

      <section className="pb-24 sm:pb-32 lg:pb-40">
        <div className="container-page">
          <nav aria-label="FAQ categories" className="mb-16 flex justify-center">
            <ul className="inline-flex flex-wrap justify-center gap-1 rounded-xl bg-ink/[0.055] p-1">
              {groups.map((group) => (
                <li key={group.category}>
                  <a
                    href={`#${slugify(group.category)}`}
                    className="block rounded-[0.6rem] px-4 py-2 text-[0.875rem] text-graphite transition-all duration-300 hover:bg-paper hover:text-ink hover:shadow-[0_1px_3px_rgb(0_0_0/0.08)]"
                  >
                    {group.category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mx-auto flex max-w-3xl flex-col gap-20">
            {groups.map((group) => (
              <Reveal key={group.category} id={slugify(group.category)} className="flex scroll-mt-28 flex-col gap-6">
                <h2 className="text-title text-ink">{group.category}</h2>
                <FaqList items={group.items} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
