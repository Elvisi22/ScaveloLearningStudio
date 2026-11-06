import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-[0.3rem] text-[0.75rem] leading-none font-medium tracking-[-0.005em]",
  {
    variants: {
      tone: {
        neutral: "bg-ink/[0.05] text-graphite",
        outline: "text-graphite ring-1 ring-ink/12 ring-inset",
        accent: "bg-accent-soft text-accent-deep",
        success: "bg-[#e9f2ec] text-success",
        warning: "bg-[#f7f0e1] text-warning",
        dark: "bg-ink text-white",
        light: "bg-white/12 text-white ring-1 ring-white/15 ring-inset",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({ className, tone, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/** Small status dot used inside badges. */
export function Dot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("size-1.5 rounded-full bg-current", className)} />;
}
