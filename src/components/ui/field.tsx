import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border-0 bg-paper px-4 text-[1.0625rem] tracking-[-0.012em] text-ink placeholder:text-mist ring-1 ring-ink/12 ring-inset transition-[box-shadow] duration-200 outline-none hover:ring-ink/25 focus:ring-2 focus:ring-ink aria-invalid:ring-2 aria-invalid:ring-[#b3261e]/70";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-[3.25rem]", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-32 resize-y py-3.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(control, "h-[3.25rem] appearance-none pr-11", className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-stone"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-[0.875rem] text-[#b3261e]" role="alert">
      <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="currentColor" aria-hidden>
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm-.75 3.25h1.5v4.5h-1.5v-4.5Zm0 5.5h1.5v1.5h-1.5v-1.5Z" />
      </svg>
      {children}
    </p>
  );
}

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">
        <span>
          {label}
          {required ? (
            <span className="ml-0.5 text-accent" aria-hidden>
              *
            </span>
          ) : null}
        </span>
        {!required ? <span className="text-[0.8125rem] font-normal text-mist">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.875rem] text-stone">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Selectable card used for radio/checkbox choices. */
export function ChoiceCard({
  type = "radio",
  name,
  value,
  checked,
  onChange,
  title,
  description,
  className,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer flex-col gap-1 rounded-[0.875rem] bg-paper p-4 ring-inset transition-[box-shadow,background-color] duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
        checked ? "ring-2 ring-ink" : "ring-1 ring-ink/12 hover:ring-ink/30",
        className,
      )}
    >
      <input type={type} name={name} value={value} checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
      <span className="flex items-start justify-between gap-3">
        <span className="text-[0.9375rem] font-medium tracking-[-0.012em] text-ink">{title}</span>
        <span
          aria-hidden
          className={cn(
            "mt-0.5 grid size-[1.125rem] shrink-0 place-items-center transition-all duration-200",
            type === "radio" ? "rounded-full" : "rounded-[0.3rem]",
            checked ? "bg-ink text-white" : "ring-1 ring-ink/20 ring-inset",
          )}
        >
          {checked ? (
            <svg viewBox="0 0 16 16" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          ) : null}
        </span>
      </span>
      {description ? <span className="text-[0.8125rem] leading-snug text-stone">{description}</span> : null}
    </label>
  );
}
