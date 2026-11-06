"use client";

import { useState } from "react";
import type { Testimonial } from "@/content/people";
import { cn } from "@/lib/utils";

/** One large quote at a time, with a quiet selector. */
export function TestimonialCarousel({ items, dark = false }: { items: Testimonial[]; dark?: boolean }) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  if (!current) return null;

  return (
    <div className="flex flex-col items-center gap-12 text-center">
      <figure key={active} className="flex max-w-4xl animate-rise flex-col items-center gap-10">
        <blockquote
          className={cn(
            "font-display text-[1.75rem] leading-[1.22] font-medium tracking-[-0.03em] text-balance sm:text-[2.5rem] lg:text-[2.85rem]",
            dark ? "text-white" : "text-ink",
          )}
        >
          “{current.quote}”
        </blockquote>
        <figcaption className="flex flex-col items-center gap-1">
          <span className={cn("text-[1.0625rem] font-semibold tracking-[-0.015em]", dark ? "text-white" : "text-ink")}>
            {current.name}
            {current.sample ? (
              <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 align-middle text-[0.625rem] font-semibold tracking-wide text-warning uppercase">Sample</span>
            ) : null}
          </span>
          <span className={cn("text-[0.9375rem]", dark ? "text-white/55" : "text-stone")}>{current.role}</span>
        </figcaption>
      </figure>
      {items.length > 1 ? (
        <div role="tablist" aria-label="Choose a testimonial" className="flex items-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Testimonial from ${item.name}`}
              onClick={() => setActive(index)}
              className="group grid h-8 place-items-center px-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500 ease-soft",
                  index === active ? "w-8 bg-ink" : "w-1.5 bg-ink/20 group-hover:bg-ink/40",
                  dark && (index === active ? "bg-white" : "bg-white/25 group-hover:bg-white/50"),
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
