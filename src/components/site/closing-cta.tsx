import { closing } from "@/content/copy";
import { photos } from "@/content/media";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CinematicImage } from "./media";
import { Reveal } from "./reveal";

/** Full-bleed cinematic call to action that closes every page. */
export function ClosingCta({ title = closing.title, body = closing.body }: { title?: string; body?: string }) {
  return (
    <section className="px-2 pt-2 pb-2 sm:px-3 sm:pb-3">
      <CinematicImage photo={photos.closing} fallback="dark" sizes="100vw" className="min-h-[34rem] sm:min-h-[40rem]" rounded="rounded-[2rem] sm:rounded-[2.5rem]">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />
        <Reveal className="relative flex min-h-[34rem] flex-col items-center justify-center gap-7 px-6 py-24 text-center sm:min-h-[40rem]">
          <p className="eyebrow text-accent-light">Applications open</p>
          <h2 className="max-w-3xl text-hero text-balance text-white">{title}</h2>
          <p className="text-lead max-w-xl text-white/75">{body}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={closing.primary.href} variant="light" size="lg">
              {closing.primary.label}
            </ButtonLink>
            <ButtonLink href={closing.secondary.href} variant="glass" size="lg">
              {closing.secondary.label}
            </ButtonLink>
          </div>
          {site.contact.email ? (
            <p className="text-[0.875rem] text-white/55">
              Prefer email?{" "}
              <a href={`mailto:${site.contact.email}`} className="text-white/85 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                {site.contact.email}
              </a>
            </p>
          ) : (
            <p className="text-[0.875rem] text-white/55">{site.contact.locationLong}</p>
          )}
        </Reveal>
      </CinematicImage>
    </section>
  );
}
