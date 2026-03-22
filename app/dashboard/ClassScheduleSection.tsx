import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type ClassRow = {
  id: string;
  title: string;
  timeLabel: string;
  type: string;
  zoomLink: string;
};

const typeLabel: Record<string, string> = {
  morning: "Morning session",
  evening: "Evening session",
};

function SessionCard({ c }: { c: ClassRow }) {
  const slot = typeLabel[c.type] ?? c.type;
  return (
    <Card className="relative overflow-hidden border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-l-xl",
          c.type === "morning" ? "bg-amber-500/90" : "bg-indigo-500/85",
        )}
        aria-hidden
      />
      <div className="pl-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">
          {slot}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
          {c.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[var(--color-text)]" aria-hidden>
              ◷
            </span>
            <span>
              <span className="font-medium text-[var(--color-text)]">{c.timeLabel}</span>
              <span className="ml-1 text-xs">IST</span>
            </span>
          </span>
        </div>
        <a
          href={c.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors sm:w-auto",
            "bg-[var(--color-primary)] text-[var(--color-primary-fg)] shadow-sm hover:opacity-95",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]",
          )}
        >
          Join class
        </a>
      </div>
    </Card>
  );
}

/** Today&apos;s live sessions with timings and join links. */
export function ClassScheduleSection({ classes }: { classes: ClassRow[] }) {
  if (classes.length === 0) {
    return (
      <section className="mt-10" aria-labelledby="schedule-heading">
        <h2
          id="schedule-heading"
          className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]"
        >
          Class schedule
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Live session times (India Standard Time). Links appear here when your admin adds them.
        </p>
        <Card className="mt-4 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/80">
          <p className="text-sm text-[var(--color-muted)]">
            No sessions are listed yet. Check back soon or contact support if you expected a class
            today.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mt-10" aria-labelledby="schedule-heading">
      <h2
        id="schedule-heading"
        className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]"
      >
        Class schedule
      </h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Today&apos;s live Zoom sessions · times in <strong className="font-medium text-[var(--color-text)]">IST</strong>
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {classes.map((c) => (
          <SessionCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
