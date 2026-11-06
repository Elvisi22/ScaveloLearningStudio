import Image from "next/image";
import type { CoverTone, Program } from "@/content/programs";
import { cn } from "@/lib/utils";
import { AmbientArt } from "./media";

const FALLBACK: Record<CoverTone, "warm" | "stone" | "dark"> = {
  ivory: "warm",
  sand: "warm",
  claret: "dark",
  charcoal: "dark",
  slate: "stone",
};

/** Program artwork: the cover photograph, or a soft gradient with the program's initial. */
export function ProgramCover({
  program,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  preload = false,
  parallax = false,
}: {
  program: Program;
  className?: string;
  sizes?: string;
  preload?: boolean;
  parallax?: boolean;
}) {
  if (program.coverImage) {
    return (
      <div className={cn("relative overflow-hidden bg-sand-deep", className)}>
        <Image src={program.coverImage} alt="" fill sizes={sizes} preload={preload} className={cn("object-cover", parallax && "parallax")} />
      </div>
    );
  }
  const tone = FALLBACK[program.coverTone];
  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden>
      <AmbientArt tone={tone} />
      <span
        className={cn(
          "absolute bottom-[-0.16em] left-[0.08em] font-display text-[11rem] leading-none font-extralight tracking-[-0.06em] select-none",
          tone === "dark" ? "text-white/80" : "text-ink/75",
        )}
      >
        {program.title.charAt(0)}
      </span>
    </div>
  );
}
