import type { ReactNode } from "react";
import type { Photo } from "@/content/media";
import { cn } from "@/lib/utils";
import { CinematicImage } from "./media";
import { Reveal } from "./reveal";

type Tone = "ivory" | "paper" | "sand" | "night";

/** Vertical rhythm and background for a page section. Dark sections render as an inset "stage". */
export function Section({
  id,
  children,
  className,
  tone = "ivory",
  width = "page",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  width?: "page" | "wide";
}) {
  const inner = <div className={width === "wide" ? "container-wide" : "container-page"}>{children}</div>;

  if (tone === "night") {
    return (
      <section id={id} className="px-2 sm:px-3">
        <div className={cn("spotlight overflow-hidden rounded-[2rem] py-24 text-white sm:rounded-[2.5rem] sm:py-32 lg:py-40", className)}>{inner}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={cn("py-24 sm:py-32 lg:py-40", tone === "paper" && "bg-paper", tone === "sand" && "bg-sand", className)}
    >
      {inner}
    </section>
  );
}

/** Eyebrow, two-tone headline and lead paragraph — the signature heading block. */
export function SectionHeading({
  eyebrow,
  title,
  muted,
  body,
  align = "left",
  dark = false,
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  muted?: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "mx-auto max-w-4xl items-center text-center",
        action && align === "left" && "md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className={cn("flex max-w-3xl flex-col gap-5", align === "center" && "items-center")}>
        {eyebrow ? <p className={cn("eyebrow", dark && "text-accent-light")}>{eyebrow}</p> : null}
        <h2 className={cn("text-headline text-balance", dark ? "text-white" : "text-ink")}>
          {title}
          {muted ? <span className={dark ? " text-white/45" : " text-mist"}> {muted}</span> : null}
        </h2>
        {body ? <p className={cn("text-lead max-w-2xl text-pretty", dark ? "text-white/65" : "text-stone")}>{body}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}

/** Centered header for inner pages, with an optional cinematic image beneath. */
export function PageHero({
  eyebrow,
  title,
  muted,
  body,
  children,
  photo,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  muted?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  photo?: Photo;
  className?: string;
}) {
  return (
    <section className={cn("pt-20 sm:pt-28 lg:pt-32", photo ? "pb-4" : "pb-16 sm:pb-24", className)}>
      <div className="container-page">
        <div className="mx-auto flex max-w-4xl animate-rise flex-col items-center gap-6 text-center">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="text-hero text-balance text-ink">
            {title}
            {muted ? <span className="text-mist"> {muted}</span> : null}
          </h1>
          {body ? <p className="text-lead max-w-2xl text-pretty text-stone">{body}</p> : null}
          {children ? <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">{children}</div> : null}
        </div>
      </div>
      {photo ? (
        <div className="container-wide mt-16 animate-rise [animation-delay:180ms] sm:mt-20">
          <CinematicImage photo={photo} preload sizes="100vw" className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" />
        </div>
      ) : null}
    </section>
  );
}
