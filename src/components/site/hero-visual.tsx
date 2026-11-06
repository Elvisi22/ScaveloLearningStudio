import { photos } from "@/content/media";
import { CinematicImage } from "./media";

/**
 * Cinematic hero: a photograph of the learning environment with the two
 * tools of the academy — a live PowerPoint slide and the cohort's Slack
 * channel — floating over it in frosted glass.
 */
export function HeroVisual() {
  return (
    <CinematicImage photo={photos.hero} preload sizes="100vw" className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2.15/1]">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />

      {/* Live slide */}
      <div aria-hidden className="absolute right-4 bottom-4 left-4 sm:right-auto sm:bottom-8 sm:left-8 sm:w-[25rem] lg:bottom-12 lg:left-12 lg:w-[29rem]">
        <div className="animate-float overflow-hidden rounded-[1.1rem] bg-white/80 shadow-float ring-1 ring-white/50 backdrop-blur-2xl backdrop-saturate-150">
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="size-2 rounded-full bg-ink/15" />
              <span className="size-2 rounded-full bg-ink/15" />
              <span className="size-2 rounded-full bg-ink/15" />
            </span>
            <span className="min-w-0 truncate text-[0.6875rem] text-stone">Session 04 · Boundaries that age well.pptx</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-md bg-ink px-1.5 py-0.5 text-[0.5625rem] font-semibold tracking-[0.08em] text-white">
              <span className="animate-pulse-dot size-1 rounded-full bg-[#ff5f57]" />
              LIVE
            </span>
          </div>
          <div className="relative mx-2 mb-2 aspect-[16/9] overflow-hidden rounded-[0.7rem] bg-white p-5 sm:p-6">
            <p className="text-[0.5625rem] font-semibold tracking-[0.18em] text-accent uppercase">Session 04 · Architecture</p>
            <p className="mt-2 max-w-[13rem] font-display text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.035em] text-ink sm:text-[1.6rem]">
              Boundaries that age well
            </p>
            <div className="mt-4 flex max-w-[8rem] flex-col gap-2">
              {[94, 76, 86].map((width, index) => (
                <span key={index} className="h-1 rounded-full bg-ink/10" style={{ width: `${width}%` }} />
              ))}
            </div>
            <svg viewBox="0 0 220 160" className="absolute right-5 bottom-5 w-[42%]" fill="none">
              <rect x="72" y="10" width="76" height="32" rx="7" className="fill-ink" />
              <rect x="8" y="114" width="76" height="32" rx="7" className="fill-sand stroke-ink/10" />
              <rect x="136" y="114" width="76" height="32" rx="7" className="fill-sand stroke-ink/10" />
              <path d="M110 42v28M110 70H46v44M110 70h64v44" className="stroke-ink/25" strokeWidth="1.5" />
              <circle cx="110" cy="70" r="4" className="fill-accent" />
            </svg>
            <span className="absolute bottom-2.5 left-5 text-[0.5625rem] text-mist tabular-nums">12 / 28</span>
          </div>
        </div>
      </div>

      {/* Slack channel */}
      <div aria-hidden className="absolute top-4 right-4 hidden w-[19rem] sm:block lg:top-12 lg:right-12 lg:w-[21rem]">
        <div className="animate-float-delayed rounded-[1.1rem] bg-white/80 p-4 shadow-float ring-1 ring-white/50 backdrop-blur-2xl backdrop-saturate-150">
          <div className="flex items-center justify-between">
            <p className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-ink">
              <span className="mr-0.5 text-mist">#</span>architecture-spring
            </p>
            <span className="flex items-center gap-1.5 rounded-md bg-[#e9f2ec] px-1.5 py-0.5 text-[0.625rem] font-medium text-success">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-success" />
              Huddle · 6
            </span>
          </div>
          <div className="mt-3.5 flex flex-col gap-3">
            <Message initials="AM" accent name="Alex · Instructor" time="18:42">
              Slides from today are pinned above. Lovely questions, everyone.
            </Message>
            <Message initials="SL" name="Sofia" time="18:44">
              The diagram on slide 12 finally made it click.
            </Message>
          </div>
        </div>
      </div>
    </CinematicImage>
  );
}

function Message({ initials, name, time, accent, children }: { initials: string; name: string; time: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span
        className={
          accent
            ? "grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-[0.5625rem] font-semibold text-white"
            : "grid size-7 shrink-0 place-items-center rounded-lg bg-sand-deep text-[0.5625rem] font-semibold text-graphite"
        }
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="text-[0.6875rem] text-stone">
          <span className="font-semibold text-ink">{name}</span> · {time}
        </p>
        <p className="mt-0.5 text-[0.75rem] leading-snug text-graphite">{children}</p>
      </div>
    </div>
  );
}
