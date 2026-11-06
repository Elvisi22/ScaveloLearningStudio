import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { TextLink } from "@/components/ui/button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions before applying? Write to the instructor directly.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="bg-sand pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="flex animate-rise flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Contact</p>
            <h1 className="text-headline text-balance text-ink">
              Questions before you apply?
            </h1>
            <p className="text-body max-w-md text-stone">
              Write to us and you’ll receive a personal reply {site.contact.responseTime}. Ready to start? You can also apply directly.
            </p>
            <TextLink href="/apply">Start your application</TextLink>
          </div>
          <dl className="grid grid-cols-1 gap-7 border-t border-ink/10 pt-9 sm:grid-cols-2 lg:grid-cols-1">
            {site.contact.email ? (
              <ContactItem label="Email">
                <a href={`mailto:${site.contact.email}`} className="text-ink transition-colors hover:text-accent">
                  {site.contact.email}
                </a>
              </ContactItem>
            ) : null}
            {site.contact.phone ? (
              <ContactItem label="Phone">
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="text-ink transition-colors hover:text-accent">
                  {site.contact.phone}
                </a>
              </ContactItem>
            ) : null}
            <ContactItem label="Based in">
              <span className="flex flex-col">
                <span>Tirana, Albania</span>
                <span>United States</span>
              </span>
            </ContactItem>
            <ContactItem label="Hours">{site.contact.hours}</ContactItem>
          </dl>
          <TextLink href="/faq" tone="ink" className="text-[0.9375rem]">
            Browse questions & answers
          </TextLink>
        </div>
        <div className="animate-rise [animation-delay:120ms]">
          <ContactForm turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined} responseTime={site.contact.responseTime} />
        </div>
      </div>
    </section>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-[0.8125rem] font-medium text-stone">{label}</dt>
      <dd className="text-[1.0625rem] tracking-[-0.015em] text-ink">{children}</dd>
    </div>
  );
}
