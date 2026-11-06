import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/button relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.012em] transition-[background-color,color,box-shadow,transform,opacity] duration-300 ease-soft select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.985]",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] hover:bg-[#2c2c2e]",
        secondary: "bg-ink/[0.055] text-ink hover:bg-ink/[0.09]",
        outline: "text-ink ring-1 ring-ink/15 ring-inset hover:bg-paper hover:ring-ink/35",
        light: "bg-white text-ink hover:bg-white/90",
        glass: "bg-white/12 text-white ring-1 ring-white/25 ring-inset backdrop-blur-xl hover:bg-white/20",
        ghost: "text-ink hover:bg-ink/[0.05]",
      },
      size: {
        sm: "h-9 rounded-[0.625rem] px-4 text-[0.8125rem]",
        md: "h-11 rounded-xl px-5 text-[0.9375rem]",
        lg: "h-[3.25rem] rounded-[0.875rem] px-7 text-[1.0625rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ComponentProps<"button"> & Variants) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Apple-style text link with a chevron that nudges on hover. */
export function TextLink({
  className,
  children,
  tone = "accent",
  ...props
}: ComponentProps<typeof Link> & { tone?: "accent" | "ink" | "light" }) {
  return (
    <Link
      className={cn(
        "group/link inline-flex items-center gap-0.5 text-[1.0625rem] tracking-[-0.012em] transition-colors duration-300",
        tone === "accent" && "text-accent hover:text-accent-deep",
        tone === "ink" && "text-ink hover:text-graphite",
        tone === "light" && "text-white hover:text-white/80",
        className,
      )}
      {...props}
    >
      <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-[text-decoration-color] duration-300 group-hover/link:decoration-current">
        {children}
      </span>
      <ChevronRight className="size-[1.05em] translate-y-px transition-transform duration-300 ease-soft group-hover/link:translate-x-0.5" strokeWidth={2} aria-hidden />
    </Link>
  );
}
