import type { Faq } from "@/content/faqs";

/** Accessible accordion built on <details>; works without JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-line-strong/70">
      {items.map((faq) => (
        <details key={faq.question} className="group border-b border-line-strong/70">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left text-[1.1875rem] font-semibold tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-graphite sm:text-[1.3125rem]">
            {faq.question}
            <span aria-hidden className="relative grid size-8 shrink-0 place-items-center rounded-full bg-ink/[0.05] transition-colors duration-300 group-hover:bg-ink/[0.09]">
              <span className="absolute h-[1.5px] w-3 rounded-full bg-ink" />
              <span className="absolute h-3 w-[1.5px] rounded-full bg-ink transition-transform duration-500 ease-soft group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <p className="text-body max-w-3xl pr-14 pb-7 text-stone">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
