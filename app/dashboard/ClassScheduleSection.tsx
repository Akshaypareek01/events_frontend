"use client";

import { useEffect, useState } from "react";
import { moonEvent } from "@/components/landing/moon/content";
import { getApiBaseUrl } from "@/lib/api";
import { getUserToken } from "@/lib/auth";
import { moonEventZoneTimes, moonJoinPhase, moonJoinStatus } from "@/lib/moonEventSchedule";

export type ClassRow = {
  id: string;
  title: string;
  timeLabel: string;
  type: string;
  zoomLink: string;
};

/**
 * Class row whose time matches the landing page (7:30 PM). Other daily batches are not this event.
 */
function matchingEventClass(classes: ClassRow[]): ClassRow | undefined {
  return classes.find((c) => /7[:.]30\s*pm/i.test(c.timeLabel));
}

const REQUIREMENTS = [
  { color: "#f97316", text: "A quiet space", note: "somewhere you can sit without interruption" },
  { color: "#3b82f6", text: "Stable internet", note: "the circle is fully online" },
  { color: "#a855f7", text: "Journal, cushion, or a warm drink", note: "optional — whatever helps you settle" },
];

function RequirementsSection() {
  return (
    <div style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
        What to have ready
      </h2>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: "24px 28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          Same as the landing page — no yoga mat or prior circle experience needed.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {REQUIREMENTS.map(({ color, text, note }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{text}</span>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SponsorsSection() {
  return (
    <div style={{ marginTop: 48, marginBottom: 32 }}>
      <img
        src="/dashboardsponser.png"
        alt="Sponsors"
        style={{ width: "100%", borderRadius: 20, display: "block" }}
      />
    </div>
  );
}

/**
 * Dashboard event. Start date and time come from the landing page, not from "today".
 */
export function ClassScheduleSection({
  classes,
  joinedClassIdToday,
  onJoinedClassIdChange,
}: {
  classes: ClassRow[];
  joinedClassIdToday: string | null;
  onJoinedClassIdChange: (id: string | null) => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const [joinBusy, setJoinBusy] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const session = matchingEventClass(classes);
  const phase = moonJoinPhase(now);
  const lockedToOther = Boolean(session && joinedClassIdToday && joinedClassIdToday !== session.id);
  const joinEnabled = phase === "live" && Boolean(session?.zoomLink) && !lockedToOther && !joinBusy;
  const status = lockedToOther
    ? { text: "Locked for today: you already joined another session.", color: "#9ca3af" }
    : phase === "live" && !session?.zoomLink
      ? { text: "Live window is open, but the session link is not published yet.", color: "#9ca3af" }
      : moonJoinStatus(now);
  const zones = moonEventZoneTimes();

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  async function handleJoin(): Promise<void> {
    if (!session || !joinEnabled) return;
    const token = getUserToken();
    if (!token) {
      setJoinError("Session expired. Please log in again.");
      return;
    }
    setJoinError(null);
    setJoinBusy(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/classes/${session.id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as {
        message?: string;
        joinedClassIdToday?: string | null;
        details?: { joinedClassIdToday?: string };
      };
      if (!res.ok) {
        onJoinedClassIdChange(data.details?.joinedClassIdToday ?? joinedClassIdToday);
        setJoinError(data.message ?? "Could not join this session");
        return;
      }
      onJoinedClassIdChange(data.joinedClassIdToday ?? session.id);
      window.open(session.zoomLink, "_blank", "noopener,noreferrer");
    } catch {
      setJoinError("Network error. Please try again.");
    } finally {
      setJoinBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
        {moonEvent.title}
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
        {moonEvent.subtitle} · {moonEvent.dateLabel}
      </p>
      {joinError && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{joinError}</p>}

      <article
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          maxWidth: 520,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ height: 4, background: "#f97316" }} />
        <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>{moonEvent.title}</h3>
            <span
              style={{
                background: "#fff7ed",
                color: "#c2410c",
                borderRadius: 999,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {moonEvent.dateLabel}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {zones.map(({ label, time }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", textAlign: "right" }}>{time}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={!joinEnabled}
            onClick={() => void handleJoin()}
            style={{
              background: "#f97316",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 0",
              fontSize: 14,
              fontWeight: 700,
              opacity: joinEnabled ? 1 : 0.45,
              cursor: joinEnabled ? "pointer" : "not-allowed",
            }}
          >
            {joinBusy ? "Joining..." : "Join Session →"}
          </button>
          <p style={{ margin: 0, fontSize: 12, color: status.color }}>{status.text}</p>
        </div>
      </article>

      <RequirementsSection />
      <SponsorsSection />
    </div>
  );
}
