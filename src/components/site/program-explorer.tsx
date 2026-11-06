"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { LEVEL_LABELS, type Level, type Program } from "@/content/programs";
import { PRICE_BAND_LABELS, type PriceBand } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ProgramCard } from "./program-card";

export type ExplorerProgram = Program & { priceBand: PriceBand; openClass: boolean };

const FORMAT_OPTIONS = [
  { value: "", label: "All formats" },
  { value: "private", label: "Private 1-on-1" },
  { value: "group", label: "Group" },
] as const;

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Any availability" },
  { value: "open", label: "Accepting applications" },
  { value: "class-open", label: "Group class enrolling now" },
] as const;

export function ProgramGrid({ programs }: { programs: Program[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program.slug} program={program} />
      ))}
    </div>
  );
}

export function ProgramExplorer({ programs, categories }: { programs: ExplorerProgram[]; categories: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const filters = {
    category: searchParams.get("category") ?? "",
    level: searchParams.get("level") ?? "",
    format: searchParams.get("format") ?? "",
    price: searchParams.get("price") ?? "",
    availability: searchParams.get("availability") ?? "",
  };

  const results = useMemo(
    () =>
      programs.filter((program) => {
        if (filters.category && program.category !== filters.category) return false;
        if (filters.level && program.level !== filters.level) return false;
        if (filters.format === "private" && !program.formats.private.available) return false;
        if (filters.format === "group" && !program.formats.group.available) return false;
        if (filters.price && program.priceBand !== filters.price) return false;
        if (filters.availability === "open" && !program.acceptingApplications) return false;
        if (filters.availability === "class-open" && !program.openClass) return false;
        return true;
      }),
    [programs, filters.category, filters.level, filters.format, filters.price, filters.availability],
  );

  function update(key: keyof typeof filters, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  const active = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-6">
        <div role="radiogroup" aria-label="Teaching format" className="inline-flex rounded-xl bg-ink/[0.055] p-1">
          {FORMAT_OPTIONS.map((option) => {
            const selected = filters.format === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update("format", option.value)}
                className={cn(
                  "h-9 rounded-[0.6rem] px-4 text-[0.875rem] tracking-[-0.01em] transition-all duration-300 ease-soft sm:px-5",
                  selected ? "bg-paper font-medium text-ink shadow-[0_1px_3px_rgb(0_0_0/0.1)]" : "text-graphite hover:text-ink",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="grid w-full max-w-4xl grid-cols-2 gap-2 lg:grid-cols-4">
          <FilterSelect label="Category" value={filters.category} onChange={(v) => update("category", v)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="Difficulty" value={filters.level} onChange={(v) => update("level", v)}>
            <option value="">All levels</option>
            {(Object.keys(LEVEL_LABELS) as Level[]).map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="Price" value={filters.price} onChange={(v) => update("price", v)}>
            <option value="">Any price</option>
            {(Object.keys(PRICE_BAND_LABELS) as PriceBand[]).map((band) => (
              <option key={band} value={band}>
                {PRICE_BAND_LABELS[band]}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect label="Availability" value={filters.availability} onChange={(v) => update("availability", v)}>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </div>
        <div className="flex items-center gap-4 text-[0.875rem] text-stone" aria-live="polite">
          <p>
            {results.length} {results.length === 1 ? "program" : "programs"}
            {active ? (results.length === 1 ? " matches your filters" : " match your filters") : ""}
          </p>
          {active ? (
            <button
              type="button"
              onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
              className="text-accent transition-colors hover:text-accent-deep"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div className={cn("transition-opacity duration-500 ease-soft", pending && "opacity-50")}>
        {results.length ? (
          <ProgramGrid programs={results} />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[1.75rem] bg-sand px-6 py-24 text-center">
            <p className="text-title text-ink">No programs match these filters.</p>
            <p className="text-body max-w-md text-stone">Try removing a filter — or tell us what you are looking for and the instructor will advise personally.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex flex-col rounded-xl bg-paper px-4 pt-2.5 pb-1.5 ring-1 ring-ink/10 ring-inset transition-shadow duration-300 focus-within:ring-2 focus-within:ring-ink hover:ring-ink/25">
      <span className="text-[0.6875rem] font-medium text-stone">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 w-full appearance-none bg-transparent pr-6 text-[0.9375rem] tracking-[-0.01em] text-ink outline-none"
      >
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-4 bottom-3 size-4 text-stone" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </label>
  );
}
