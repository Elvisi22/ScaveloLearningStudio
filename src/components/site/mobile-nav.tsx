"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mainNav, site } from "@/content/site";
import { useIsClient } from "@/lib/use-browser";
import { cn } from "@/lib/utils";

const links = [...mainNav, { label: "Questions & answers", href: "/faq" }, { label: "Contact", href: "/contact" }];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="relative z-50 -mr-2 grid size-10 place-items-center rounded-lg text-ink transition-colors hover:bg-ink/[0.05] lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="relative block h-2.5 w-4">
          <span className={cn("absolute left-0 h-[1.5px] w-4 rounded-full bg-current transition-all duration-500 ease-soft", open ? "top-[4.25px] rotate-45" : "top-0")} />
          <span className={cn("absolute left-0 h-[1.5px] w-4 rounded-full bg-current transition-all duration-500 ease-soft", open ? "top-[4.25px] -rotate-45" : "top-[8.5px]")} />
        </span>
      </button>
      {mounted
        ? createPortal(
            <div
              id="mobile-menu"
              aria-hidden={!open}
              className={cn(
                "glass fixed inset-0 z-30 flex flex-col px-6 pt-24 pb-10 transition-[opacity,visibility] duration-500 ease-soft lg:hidden",
                "bg-ivory/95",
                open ? "visible opacity-100" : "invisible opacity-0",
              )}
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {links.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "py-2 font-display text-[1.75rem] font-semibold tracking-[-0.035em] text-ink transition-all duration-700 ease-soft",
                      open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                    )}
                    style={{ transitionDelay: open ? `${60 + index * 35}ms` : "0ms" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div
                className={cn("mt-auto flex flex-col gap-4 transition-all delay-300 duration-700 ease-soft", open ? "opacity-100" : "opacity-0")}
              >
                <Link
                  href="/apply"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex h-[3.25rem] items-center justify-center rounded-[0.875rem] bg-ink text-[1.0625rem] font-medium text-white"
                >
                  Apply now
                </Link>
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`} tabIndex={open ? 0 : -1} className="text-center text-[0.875rem] text-stone">
                    {site.contact.email}
                  </a>
                ) : (
                  <p className="text-center text-[0.875rem] text-stone">{site.contact.locationLong}</p>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
