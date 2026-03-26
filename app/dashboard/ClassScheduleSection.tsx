"use client";

export type ClassRow = {
  id: string;
  title: string;
  timeLabel: string;
  type: string;
  zoomLink: string;
};

// ─── Timezone conversion ──────────────────────────────────────────────────────
const TIMEZONES = [
  { label: "India (IST)",      tz: "Asia/Kolkata" },
  { label: "Singapore (SGT)",  tz: "Asia/Singapore" },
  { label: "Australia (AEDT)", tz: "Australia/Sydney" },
  { label: "USA (EST)",        tz: "America/New_York" },
  { label: "UK (GMT)",         tz: "Europe/London" },
  { label: "Europe (CET)",     tz: "Europe/Paris" },
  { label: "Dubai (GST)",      tz: "Asia/Dubai" },
];

function convertISTtoTimezones(timeLabel: string) {
  try {
    const [timePart, meridiem] = timeLabel.trim().split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (meridiem?.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (meridiem?.toUpperCase() === "AM" && hour === 12) hour = 0;
    const now = new Date();
    const utcMs =
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute) -
      (5 * 60 + 30) * 60 * 1000;
    const start = new Date(utcMs);
    const end = new Date(utcMs + 3600000);
    return TIMEZONES.map(({ label, tz }) => {
      const fmt = (d: Date) =>
        d.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: true });
      return { label, time: `${fmt(start)} - ${fmt(end)}` };
    });
  } catch {
    return TIMEZONES.map(({ label }) => ({ label, time: timeLabel }));
  }
}

// ─── Batch themes ─────────────────────────────────────────────────────────────
// Card body = pure white (#ffffff)
// Only the top stripe, icon, badge, and button carry color
const BATCH_THEMES = [
  { topBorder: "#f5a623", iconBg: "#f5a623", badgeBg: "#fef6e4", badgeColor: "#b45309", btnBg: "#f5a623" },
  { topBorder: "#f5a623", iconBg: "#f5a623", badgeBg: "#fef6e4", badgeColor: "#b45309", btnBg: "#f5a623" },
  { topBorder: "#f07c2a", iconBg: "#f07c2a", badgeBg: "#fef0e4", badgeColor: "#9a3412", btnBg: "#f07c2a" },
  { topBorder: "#f07c2a", iconBg: "#f07c2a", badgeBg: "#fef0e4", badgeColor: "#9a3412", btnBg: "#f07c2a" },
  { topBorder: "#e8521a", iconBg: "#e8521a", badgeBg: "#feece4", badgeColor: "#9a3412", btnBg: "#e8521a" },
  { topBorder: "#e03030", iconBg: "#e03030", badgeBg: "#fee4e4", badgeColor: "#991b1b", btnBg: "#e03030" },
];

// ─── Batch Card ───────────────────────────────────────────────────────────────
function BatchCard({ c, index }: { c: ClassRow; index: number }) {
  const t = BATCH_THEMES[index % BATCH_THEMES.length];
  const zones = convertISTtoTimezones(c.timeLabel);

  return (
    <div style={{
      background: "#ffffff",           // ← pure white, no tint
      borderRadius: 16,
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      {/* Colored top accent stripe */}
      <div style={{ height: 4, background: t.topBorder, flexShrink: 0 }} />

      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: t.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>Batch {index + 1}</span>
          </div>
          <span style={{
            background: t.badgeBg,
            color: t.badgeColor,
            borderRadius: 999,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}>
            Global Session
          </span>
        </div>

        {/* Timezone rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {zones.map(({ label, time }) => (
            <div
              key={label}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}
            >
              <span style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap", minWidth: 130 }}>
                {label}:
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", textAlign: "right" }}>
                {time}
              </span>
            </div>
          ))}
        </div>

        {/* Join button */}
        <a
          href={c.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            background: t.btnBg,
            color: "#fff",
            borderRadius: 12,
            padding: "10px 0",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            marginTop: "auto",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          Join Session
        </a>
      </div>
    </div>
  );
}

// ─── Requirements ─────────────────────────────────────────────────────────────
const REQUIREMENTS = [
  { color: "#3b82f6", text: "High speed internet connection", note: "for uninterrupted live sessions" },
  { color: "#22c55e", text: "Yoga mat",                       note: "for safe and comfortable practice" },
  { color: "#06b6d4", text: "Water bottle",                   note: "to stay hydrated throughout the session" },
  { color: "#a855f7", text: "Face towel",                     note: "to keep yourself fresh" },
];

function RequirementsSection() {
  return (
    <div style={{ marginTop: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
        Requirements for Yoga Classes
      </h2>
      <div style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "24px 28px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          To ensure a smooth and comfortable experience during the sessions, please keep the following ready:
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

// ─── Sponsors ─────────────────────────────────────────────────────────────────


function SponsorsSection() {
  return (
    <div style={{ marginTop: 48, marginBottom: 32 }}>
      <img
        src="/dashboardsponser.png"
        alt="Sponsors"
        style={{
          width: "100%",
          borderRadius: 20,
          display: "block",
        }}
      />
    </div>
  );
}


// ─── Main Export ──────────────────────────────────────────────────────────────
export function ClassScheduleSection({ classes }: { classes: ClassRow[] }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
        Class Schedule
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
        Today&apos;s Live Zoom Sessions (Times in IST)
      </p>

      {classes.length === 0 ? (
        <div style={{
          border: "2px dashed #e5e7eb", borderRadius: 16,
          padding: 40, textAlign: "center", background: "#f9fafb",
        }}>
          <p style={{ fontSize: 14, color: "#9ca3af" }}>
            No sessions listed yet. Check back soon or contact support.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",   // ← always 3 cols like reference
          gap: 20,
        }}>
          {classes.map((c, i) => <BatchCard key={c.id} c={c} index={i} />)}
        </div>
      )}

      <RequirementsSection />
      <SponsorsSection />
    </div>
  );
}