import Link from "next/link";
import { CLASS_STATUS_LABELS, type GroupClass } from "@/content/classes";
import { Badge, Dot } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { classPrice, classStatus, getProgram, seatsLeft } from "@/lib/catalog";
import { dateParts, formatDate, formatDateRange, formatPrice, timezoneAbbreviation } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ClassCard({ groupClass, showProgram = true }: { groupClass: GroupClass; showProgram?: boolean }) {
  const program = getProgram(groupClass.programSlug);
  const status = classStatus(groupClass);
  const left = seatsLeft(groupClass);
  const price = classPrice(groupClass);
  const start = dateParts(groupClass.startDate);
  const zone = timezoneAbbreviation(groupClass.timezone, groupClass.startDate);
  const open = status === "ENROLLMENT_OPEN";

  const applyHref = `/apply?format=GROUP&program=${groupClass.programSlug}&class=${groupClass.id}${open ? "" : "&intent=INTEREST"}`;

  return (
    <article className="group grid grid-cols-1 gap-6 rounded-[1.75rem] bg-paper p-6 shadow-hairline transition-shadow duration-500 ease-soft hover:shadow-card sm:p-8 md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-10">
      <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1">
        <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-accent uppercase">
          {start.month} {start.year}
        </p>
        <p className="font-display text-[3.5rem] leading-none font-extralight tracking-[-0.05em] text-ink tabular-nums">{start.day}</p>
        <p className="text-[0.8125rem] text-stone md:mt-1">{start.weekday}</p>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={open ? "success" : status === "FULLY_BOOKED" ? "accent" : "neutral"}>
            <Dot />
            {CLASS_STATUS_LABELS[status]}
          </Badge>
          {open && left <= 3 ? <Badge tone="warning">{left === 1 ? "Last seat" : `${left} seats left`}</Badge> : null}
        </div>
        <h3 className="text-subtitle text-ink">
          {showProgram && program ? (
            <Link href={`/programs/${program.slug}`} className="transition-colors duration-300 hover:text-accent">
              {groupClass.name}
            </Link>
          ) : (
            groupClass.name
          )}
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-stone">
          {formatDateRange(groupClass.startDate, groupClass.endDate)} · {groupClass.schedule} {zone}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-stone">
          <span>{groupClass.sessions} live sessions</span>
          <span>Apply by {formatDate(groupClass.enrollmentDeadline, { day: "numeric", month: "short" })}</span>
          <span className="flex items-center gap-2" aria-label={`${groupClass.seatsTaken} of ${groupClass.capacity} seats taken`}>
            <span className="flex gap-[3px]" aria-hidden>
              {Array.from({ length: groupClass.capacity }).map((_, index) => (
                <span key={index} className={cn("h-2.5 w-1 rounded-full", index < groupClass.seatsTaken ? "bg-ink" : "bg-ink/12")} />
              ))}
            </span>
            {groupClass.seatsTaken} of {groupClass.capacity} seats taken
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line pt-5 md:flex-col md:items-end md:border-0 md:pt-0 md:text-right">
        <p className="text-ink">
          {price != null ? (
            <>
              <span className="text-[1.75rem] font-semibold tracking-[-0.03em]">{formatPrice(price)}</span>
              <span className="block text-[0.8125rem] text-stone">per student</span>
            </>
          ) : (
            <span className="text-[0.9375rem]">Price on request</span>
          )}
        </p>
        <ButtonLink href={applyHref} variant={open ? "primary" : "secondary"} size="sm">
          {open ? "Apply for this class" : status === "FULLY_BOOKED" ? "Join waiting list" : "Register interest"}
        </ButtonLink>
      </div>
    </article>
  );
}
