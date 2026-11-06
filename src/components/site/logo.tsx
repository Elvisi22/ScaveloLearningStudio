import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex items-baseline gap-[0.3em] font-display text-[1.0625rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-opacity duration-300 hover:opacity-75 sm:text-[1.1875rem]",
        dark ? "text-white" : "text-ink",
        className,
      )}
    >
      <span className="font-semibold">{site.wordmark.primary}</span>
      <span className={cn("font-normal", dark ? "text-white/60" : "text-stone")}>{site.wordmark.secondary}</span>
      <span aria-hidden className="-ml-[0.15em] inline-block size-[0.3rem] rounded-full bg-accent" />
    </Link>
  );
}
