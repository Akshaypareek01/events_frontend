import { moonEvent } from "@/components/landing/moon/content";

/** Join opens this many minutes before the landing-page start. */
const JOIN_EARLY_MS = 5 * 60 * 1000;

const ZONES = [
  { label: "India (IST)", tz: "Asia/Kolkata" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Australia (AEDT)", tz: "Australia/Sydney" },
  { label: "USA (New York)", tz: "America/New_York" },
  { label: "UK (London)", tz: "Europe/London" },
  { label: "Europe (Paris)", tz: "Europe/Paris" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
] as const;

export type MoonJoinPhase = "before" | "live" | "ended";

/**
 * End of the event date in IST. The landing page says "7:30pm onwards" and does not publish a finish time.
 */
function eventNightEnd(start: Date): Date {
  const end = new Date(start);
  end.setTime(start.getTime() + (4 * 60 + 30) * 60 * 1000);
  return end;
}

/** Start instant from the landing page (26 Oct 2026, 7:30pm IST). */
export function moonEventStart(): Date {
  return new Date(moonEvent.startsAt);
}

/**
 * Whether the circle can be joined, based on the landing start — not "today".
 */
export function moonJoinPhase(now: Date = new Date()): MoonJoinPhase {
  const start = moonEventStart();
  const openAt = start.getTime() - JOIN_EARLY_MS;
  const closeAt = eventNightEnd(start).getTime();
  const t = now.getTime();
  if (t < openAt) return "before";
  if (t > closeAt) return "ended";
  return "live";
}

/** Compact countdown such as "27d 4h" or "18 min". */
function formatLead(ms: number): string {
  const totalMin = Math.max(1, Math.ceil(ms / 60000));
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours > 0) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  return `${mins} min`;
}

/**
 * Status line for the dashboard. Counts down to the landing-page start.
 */
export function moonJoinStatus(now: Date = new Date()): { text: string; color: string } {
  const phase = moonJoinPhase(now);
  const start = moonEventStart();
  if (phase === "live") {
    return { text: "Live now. You can join this session.", color: "#15803d" };
  }
  if (phase === "ended") {
    return { text: "This session has ended.", color: "#9ca3af" };
  }
  const openAt = start.getTime() - JOIN_EARLY_MS;
  return {
    text: `Starts ${moonEvent.dateLabel}, 7:30 PM IST. Join opens in ${formatLead(openAt - now.getTime())}.`,
    color: "#9ca3af",
  };
}

/**
 * Local start time in each zone on the actual event date (not today's clock).
 */
export function moonEventZoneTimes(): { label: string; time: string }[] {
  const start = moonEventStart();
  const istDay = start.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  return ZONES.map(({ label, tz }) => {
    const day = start.toLocaleDateString("en-CA", { timeZone: tz });
    const time = start.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const date =
      day === istDay
        ? ""
        : `${start.toLocaleDateString("en-GB", { timeZone: tz, day: "numeric", month: "short" })}, `;
    return { label, time: `${date}${time} onwards` };
  });
}
