import Link from "next/link";
import { mainNav, site } from "@/content/site";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <>
      {site.announcement ? (
        <div className="bg-sand">
          <p className="container-page flex min-h-11 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 py-2.5 text-center text-[0.8125rem] tracking-[-0.008em] text-graphite">
            <span>{site.announcement.text}</span>
            <TextLink href={site.announcement.href} className="text-[0.8125rem]">
              {site.announcement.cta}
            </TextLink>
          </p>
        </div>
      ) : null}
      <header className="glass sticky top-0 z-40 border-b border-ink/[0.07]">
        <div className="container-page flex h-12 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.8125rem] tracking-[-0.008em] text-ink/75 transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/contact"
              className="hidden text-[0.8125rem] tracking-[-0.008em] text-ink/75 transition-colors duration-300 hover:text-ink sm:inline-flex"
            >
              Contact
            </Link>
            <ButtonLink href="/apply" size="sm" className="h-8 rounded-lg px-3.5 text-[0.8125rem]">
              Apply
            </ButtonLink>
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
