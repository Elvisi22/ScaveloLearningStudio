"use client";

import { useEffect, useRef, type ComponentProps, type CSSProperties, type ElementType } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  delay?: number;
} & ComponentProps<T>;

/**
 * Fades content in as it scrolls into view. Content is always rendered visible
 * on the server; only elements that start below the fold are animated, so the
 * first screen paints instantly and nothing depends on JavaScript to appear.
 */
export function Reveal<T extends ElementType = "div">({ as, delay = 0, style, ...props }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Component = (as ?? "div") as ElementType;

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    element.setAttribute("data-reveal", "pending");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <Component ref={ref} style={{ ...(style as CSSProperties), "--reveal-delay": `${delay}ms` } as CSSProperties} {...props} />;
}
