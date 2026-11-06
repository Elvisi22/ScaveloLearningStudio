import { cacheLife } from "next/cache";
import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { TextLink } from "@/components/ui/button";
import { Logo } from "./logo";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const socials = site.socials.filter((social) => social.href);
  return (
    <footer className="bg-sand text-[0.8125rem] tracking-[-0.008em] text-stone">
      <div className="container-page">
        <div className="flex flex-col gap-6 border-b border-ink/[0.08] py-12 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-md flex-col gap-4">
            <Logo />
            <p className="leading-relaxed">{site.description}</p>
          </div>
          <TextLink href="/apply" className="text-[0.9375rem]">
            Apply to learn with the instructor
          </TextLink>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-4">
          {footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <p className="font-semibold text-ink">{group.title}</p>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors duration-300 hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-ink">Contact</p>
            <ul className="flex flex-col gap-2.5">
              {site.contact.email ? (
                <li>
                  <a href={`mailto:${site.contact.email}`} className="transition-colors duration-300 hover:text-ink">
                    {site.contact.email}
                  </a>
                </li>
              ) : (
                <li>
                  <Link href="/contact" className="transition-colors duration-300 hover:text-ink">
                    Send a message
                  </Link>
                </li>
              )}
              {site.contact.phone ? (
                <li>
                  <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="transition-colors duration-300 hover:text-ink">
                    {site.contact.phone}
                  </a>
                </li>
              ) : null}
              <li>{site.contact.location}</li>
              <li>{site.contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ink/[0.08] py-6 text-[0.75rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © <CurrentYear /> {site.legalName}. All lessons are taught live by the instructor.
          </p>
          {socials.length ? (
            <ul className="flex gap-5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Taught live on Slack · Presented in PowerPoint</p>
          )}
        </div>
      </div>
    </footer>
  );
}
