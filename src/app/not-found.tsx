import { ButtonLink, TextLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-hero text-balance text-ink">
        This page has moved on.
      </h1>
      <p className="text-lead max-w-lg text-stone">The page you were looking for doesn’t exist. Explore the programs or head back home.</p>
      <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
        <ButtonLink href="/programs" size="lg">
          Explore programs
        </ButtonLink>
        <TextLink href="/">Back to home</TextLink>
      </div>
    </section>
  );
}
