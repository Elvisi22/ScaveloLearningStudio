import Image from "next/image";
import { photos } from "@/content/media";
import { instructor } from "@/content/people";
import { TextLink } from "@/components/ui/button";
import { cn, initials } from "@/lib/utils";
import { CinematicImage } from "./media";
import { Reveal } from "./reveal";
import { Section } from "./section";

/** The instructor's portrait; until one is added, an elegant workspace image with a monogram. */
export function InstructorPortrait({ className = "", preload = false }: { className?: string; preload?: boolean }) {
  if (instructor.photo) {
    return (
      <div className={cn("relative overflow-hidden rounded-[2rem] bg-sand-deep sm:rounded-[2.5rem]", className)}>
        <Image src={instructor.photo} alt={instructor.name} fill preload={preload} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <CinematicImage photo={photos.workspace} preload={preload} sizes="(min-width: 1024px) 45vw, 100vw" className={className} rounded="rounded-[2rem] sm:rounded-[2.5rem]" overlay="bottom">
      <div className="glass absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl py-2.5 pr-5 pl-2.5 sm:bottom-7 sm:left-7">
        <span className="grid size-11 place-items-center rounded-xl bg-ink text-[0.9375rem] font-semibold tracking-[-0.02em] text-white">
          {initials(instructor.name)}
        </span>
        <span className="flex flex-col">
          <span className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">{instructor.name}</span>
          <span className="text-[0.8125rem] text-stone">{instructor.role}</span>
        </span>
      </div>
    </CinematicImage>
  );
}

export function InstructorSection() {
  return (
    <Section id="instructor">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <Reveal>
          <InstructorPortrait className="aspect-[4/5]" />
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-8">
          <p className="eyebrow">Your instructor</p>
          <h2 className="text-headline text-balance text-ink">
            {instructor.name}.<span className="text-mist"> {instructor.role}.</span>
          </h2>
          <blockquote className="text-lead border-l border-accent pl-6 font-light text-graphite italic">“{instructor.quote}”</blockquote>
          <p className="text-body max-w-xl text-stone">{instructor.shortBio}</p>
          <dl className="grid grid-cols-3 gap-6 border-t border-line pt-8">
            {instructor.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5">
                <dt className="order-2 text-[0.8125rem] leading-snug text-stone">{stat.label}</dt>
                <dd className="font-display text-[2.25rem] leading-none font-semibold tracking-[-0.04em] text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <TextLink href="/instructor">Meet the instructor</TextLink>
        </Reveal>
      </div>
    </Section>
  );
}
