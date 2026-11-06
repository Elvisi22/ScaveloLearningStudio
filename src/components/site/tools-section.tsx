import { Check, Hash, Presentation } from "lucide-react";
import { tools } from "@/content/copy";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./section";

/** Product-style stage: the laptop shows the PowerPoint lesson, the phone shows the Slack channel. */
export function ToolsSection() {
  return (
    <Section id="tools" tone="night">
      <SectionHeading eyebrow={tools.eyebrow} title={tools.title} body={tools.body} dark align="center" />

      <Reveal className="relative mx-auto mt-16 w-full max-w-[60rem] pb-10 sm:mt-24 sm:pb-0">
        <Laptop />
        <div className="absolute right-[-2%] bottom-[-4%] w-[34%] max-w-[15.5rem] sm:right-[-4%] sm:bottom-[-10%] sm:w-[27%]">
          <Phone />
        </div>
      </Reveal>

      <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-x-16 gap-y-14 sm:mt-32 md:grid-cols-2">
        <ToolCopy icon={<Presentation className="size-5" strokeWidth={1.5} />} {...tools.powerpoint} />
        <ToolCopy icon={<Hash className="size-5" strokeWidth={1.5} />} {...tools.slack} delay={120} />
      </div>
      <Reveal className="mx-auto mt-16 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-white/50">{tools.note}</Reveal>
    </Section>
  );
}

function ToolCopy({ icon, title, body, points, delay = 0 }: { icon: React.ReactNode; title: string; body: string; points: string[]; delay?: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col gap-5">
      <span className="grid size-11 place-items-center rounded-xl bg-white/[0.08] text-white ring-1 ring-white/10 ring-inset">{icon}</span>
      <h3 className="text-title text-white">{title}</h3>
      <p className="text-body text-white/65">{body}</p>
      <ul className="mt-1 flex flex-col border-t border-white/10">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 border-b border-white/10 py-3.5 text-[0.9375rem] text-white/85">
            <Check className="mt-0.5 size-4 shrink-0 text-accent-light" strokeWidth={2} aria-hidden />
            {point}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Laptop() {
  return (
    <div aria-hidden className="relative">
      <div className="relative rounded-t-[1.1rem] bg-[#1c1c1e] p-[1.4%] pb-[2%] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 sm:rounded-t-[1.6rem]">
        <span className="absolute top-[0.55%] left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-[#f6f4f0] sm:rounded-[0.6rem]">
          <Slide />
        </div>
      </div>
      <div className="relative -mx-[7%] h-[0.65rem] rounded-b-[0.9rem] bg-gradient-to-b from-[#d4d4d8] via-[#b7b7bc] to-[#88888e] sm:h-[1.15rem]">
        <span className="absolute top-0 left-1/2 h-[45%] w-[15%] -translate-x-1/2 rounded-b-lg bg-[#a3a3a8]" />
      </div>
    </div>
  );
}

function Slide() {
  return (
    <div className="absolute inset-0 flex flex-col p-[5.5%]">
      <div className="flex items-center justify-between">
        <p className="text-[clamp(0.4rem,1vw,0.6875rem)] font-semibold tracking-[0.2em] text-accent uppercase">Session 06 · Java Foundations</p>
        <p className="text-[clamp(0.4rem,0.9vw,0.625rem)] text-mist tabular-nums">06 / 24</p>
      </div>
      <div className="mt-[4%] grid flex-1 grid-cols-[1.1fr_1fr] gap-[6%]">
        <div className="flex flex-col">
          <p className="font-display text-[clamp(1rem,3.4vw,2.6rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-ink">Choosing the right collection</p>
          <ul className="mt-[8%] flex flex-col gap-[0.6em] text-[clamp(0.45rem,1.15vw,0.875rem)] text-graphite">
            {["List — ordered, allows duplicates", "Set — unique elements", "Map — keys to values"].map((item) => (
              <li key={item} className="flex items-center gap-[0.6em]">
                <span className="size-[0.4em] rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-end gap-[6%] border-b border-ink/10 pb-[2%]">
          {[38, 64, 46, 92, 70].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div className={index === 3 ? "w-full rounded-t-[0.2rem] bg-ink" : "w-full rounded-t-[0.2rem] bg-ink/12"} style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div aria-hidden className="rounded-[2.1rem] bg-[#1c1c1e] p-[4.5%] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/15">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.75rem] bg-white">
        <span className="absolute top-[1.8%] left-1/2 z-10 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        <div className="flex h-full flex-col pt-[15%] text-[clamp(0.34rem,0.85vw,0.625rem)]">
          <div className="border-b border-ink/[0.07] px-[7%] pb-[5%]">
            <p className="font-semibold text-ink">
              <span className="text-mist"># </span>java-winter-cohort
            </p>
            <p className="mt-[2%] text-mist">8 members · Live huddle</p>
          </div>
          <div className="mx-[5%] mt-[5%] flex items-center justify-between rounded-[0.6em] bg-[#e9f2ec] px-[5%] py-[4%] text-success">
            <span className="flex items-center gap-[0.4em] font-medium">
              <span className="animate-pulse-dot size-[0.55em] rounded-full bg-success" />
              Session 06 is live
            </span>
            <span className="rounded-[0.4em] bg-success px-[0.6em] py-[0.25em] font-semibold text-white">Join</span>
          </div>
          <div className="flex flex-1 flex-col gap-[6%] px-[7%] pt-[7%]">
            <PhoneMessage who="Alex" accent text="Today's slides are attached — see you at 18:30." />
            <div className="ml-[18%] flex items-center gap-[0.5em] rounded-[0.6em] p-[4%] ring-1 ring-ink/10">
              <span className="grid size-[2em] place-items-center rounded-[0.35em] bg-accent text-[0.8em] font-bold text-white">P</span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-ink">Session-06.pdf</span>
                <span className="text-mist">24 slides</span>
              </span>
            </div>
            <PhoneMessage who="Giulia" text="Thank you! Question about Map ordering 🙋" />
          </div>
          <div className="mx-[5%] mb-[6%] rounded-[0.7em] px-[5%] py-[4%] text-mist ring-1 ring-ink/10">Message #java-winter-cohort</div>
        </div>
      </div>
    </div>
  );
}

function PhoneMessage({ who, text, accent }: { who: string; text: string; accent?: boolean }) {
  return (
    <div className="flex gap-[0.6em]">
      <span className={accent ? "grid size-[2em] shrink-0 place-items-center rounded-[0.4em] bg-ink font-semibold text-white" : "grid size-[2em] shrink-0 place-items-center rounded-[0.4em] bg-sand-deep font-semibold text-graphite"}>
        {who[0]}
      </span>
      <p className="leading-snug text-graphite">
        <span className="block font-semibold text-ink">{who}</span>
        {text}
      </p>
    </div>
  );
}
