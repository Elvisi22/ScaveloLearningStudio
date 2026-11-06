import type { LegalSection } from "@/content/legal";
import { slugify } from "@/lib/utils";
import { PageHero } from "./section";

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow={`Last updated ${updated}`} title={title} body={intro} />
      <section className="pb-24 sm:pb-32">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <nav aria-label="Sections" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <ul className="flex flex-col gap-2.5 text-[0.875rem]">
              {sections.map((section) => (
                <li key={section.heading}>
                  <a href={`#${slugify(section.heading)}`} className="text-stone transition-colors duration-300 hover:text-ink">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex max-w-3xl flex-col gap-14 border-t border-line pt-14">
            {sections.map((section) => (
              <section key={section.heading} id={slugify(section.heading)} className="flex scroll-mt-24 flex-col gap-4">
                <h2 className="text-subtitle text-ink sm:text-[1.6rem]">{section.heading}</h2>
                <div className="prose-academy text-body text-graphite">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
