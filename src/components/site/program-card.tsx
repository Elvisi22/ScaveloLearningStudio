import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LEVEL_LABELS, type Program } from "@/content/programs";
import { hasOpenClass, startingPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProgramCover } from "./program-cover";

export function ProgramCard({ program, className }: { program: Program; className?: string }) {
  const price = startingPrice(program);
  const openClass = hasOpenClass(program);
  const formats = [program.formats.private.available && "Private", program.formats.group.available && "Group"].filter(Boolean).join(" · ");

  return (
    <Link href={`/programs/${program.slug}`} className={cn("group flex h-full flex-col rounded-[1.75rem]", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-sand-deep shadow-hairline transition-shadow duration-700 ease-soft group-hover:shadow-lift sm:rounded-[1.75rem]">
        <ProgramCover program={program} className="absolute inset-0 transition-transform duration-[1400ms] ease-soft group-hover:scale-[1.04]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {openClass ? (
          <span className="glass absolute top-4 left-4 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.75rem] font-medium text-ink">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Group class enrolling
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-1 pt-6">
        <p className="text-[0.8125rem] tracking-[-0.008em] text-stone">
          {program.category} · {LEVEL_LABELS[program.level]}
        </p>
        <h3 className="text-[1.5rem] leading-tight font-semibold tracking-[-0.03em] text-ink">{program.title}</h3>
        <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-stone">{program.shortDescription}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-4">
          <p className="text-[0.8125rem] text-stone">
            {program.lessonCount} lessons · {formats}
          </p>
          <p className="text-[0.9375rem] text-ink">{price != null ? <>From {formatPrice(price)}</> : "Price on request"}</p>
        </div>
        <span className="mt-2 inline-flex items-center gap-0.5 text-[0.9375rem] text-accent">
          Learn more
          <ChevronRight className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
