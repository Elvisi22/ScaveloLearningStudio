import { Check } from "lucide-react";
import { formats } from "@/content/copy";
import { photos, type Photo } from "@/content/media";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CinematicImage } from "./media";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./section";

export function FormatsSection() {
  return (
    <Section id="formats" width="wide">
      <div className="container-page px-0!">
        <SectionHeading eyebrow={formats.eyebrow} title={formats.title} body={formats.body} align="center" />
      </div>
      <div className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 sm:gap-4 lg:grid-cols-2">
        <FormatTile {...formats.private} photo={photos.private} dark />
        <FormatTile {...formats.group} photo={photos.group} delay={120} />
      </div>
    </Section>
  );
}

function FormatTile({
  eyebrow,
  title,
  body,
  benefits,
  cta,
  learnMore,
  photo,
  dark = false,
  delay = 0,
}: (typeof formats)["private"] & { photo: Photo; dark?: boolean; delay?: number }) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "flex flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]",
        dark ? "spotlight text-white" : "bg-sand text-ink",
      )}
    >
      <div className="flex flex-col items-center gap-5 px-6 pt-14 pb-10 text-center sm:px-12 sm:pt-16">
        <p className={cn("eyebrow", dark && "text-accent-light")}>{eyebrow}</p>
        <h3 className="max-w-md font-display text-[clamp(2rem,1.3rem+2vw,3rem)] leading-[1.06] font-semibold tracking-[-0.038em] text-balance">{title}</h3>
        <p className={cn("text-body max-w-md", dark ? "text-white/65" : "text-stone")}>{body}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <ButtonLink href={cta.href} variant={dark ? "light" : "primary"}>
            {cta.label}
          </ButtonLink>
          <TextLink href={learnMore} tone={dark ? "light" : "accent"}>
            Learn more
          </TextLink>
        </div>
      </div>
      <div className="mt-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <CinematicImage photo={photo} fallback={dark ? "dark" : "warm"} className="aspect-[4/3]" rounded="rounded-[1.6rem] sm:rounded-[2rem]" overlay="bottom">
          <ul className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-8">
            {benefits.slice(0, 4).map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-[0.9375rem] text-white">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-light" strokeWidth={2} aria-hidden />
                {benefit}
              </li>
            ))}
          </ul>
        </CinematicImage>
      </div>
    </Reveal>
  );
}
