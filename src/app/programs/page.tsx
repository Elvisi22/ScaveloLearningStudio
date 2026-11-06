import type { Metadata } from "next";
import { Suspense } from "react";
import { ClosingCta } from "@/components/site/closing-cta";
import { ProgramExplorer, ProgramGrid, type ExplorerProgram } from "@/components/site/program-explorer";
import { PageHero } from "@/components/site/section";
import { programs } from "@/content/programs";
import { categories, hasOpenClass, priceBand } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore instructor-led programs available as private 1-on-1 lessons and small group classes.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  const explorerPrograms: ExplorerProgram[] = programs.map((program) => ({
    ...program,
    priceBand: priceBand(program),
    openClass: hasOpenClass(program),
  }));

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Programs, taught personally."
        body="Each program is prepared and taught live by the instructor — as private lessons, small group classes, or both."
      />
      <section className="pb-24 sm:pb-32 lg:pb-40">
        <div className="container-page">
          <Suspense fallback={<ProgramGrid programs={programs} />}>
            <ProgramExplorer programs={explorerPrograms} categories={categories()} />
          </Suspense>
        </div>
      </section>
      <ClosingCta
        title="Not sure which program fits?"
        body="Apply with “Not sure yet” or request a consultation. The instructor will recommend the right program and format for you."
      />
    </>
  );
}
