"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getApiBaseUrl } from "@/lib/api";
import { clearTeacherToken, getTeacherToken } from "@/lib/auth";
import { type ClassRow } from "@/app/dashboard/ClassScheduleSection";

type TeacherMe = {
  id: string;
  username: string;
  displayName: string;
};

export function TeacherDashboardClient() {
  const router = useRouter();
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [meetingLinkDraft, setMeetingLinkDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [classesErr, setClassesErr] = useState<string | null>(null);

  // ── API calls — untouched ─────────────────────────────────────────────────
  useEffect(() => {
    const token = getTeacherToken();
    if (!token) { router.replace("/teacher/login"); return; }
    const base = getApiBaseUrl();
    const headers = { Authorization: `Bearer ${token}` };

    void (async () => {
      try {
        const [meRes, clsRes] = await Promise.all([
          fetch(`${base}/api/v1/teacher/me`, { headers }),
          fetch(`${base}/api/v1/classes/today`, { headers }),
        ]);
        const meJson = (await meRes.json()) as { teacher?: TeacherMe; message?: string };
        if (!meRes.ok || !meJson.teacher) { setErr(meJson.message ?? "Session invalid"); return; }
        setMe(meJson.teacher);
        const clsJson = (await clsRes.json()) as { classes?: ClassRow[]; message?: string };
        if (clsRes.ok && clsJson.classes) {
          setClasses(clsJson.classes);
          if (clsJson.classes.length > 0) {
            const first = clsJson.classes[0]!;
            setSelectedClassId(first.id);
            setMeetingLinkDraft(first.zoomLink);
          }
        } else setClassesErr(clsJson.message ?? "Could not load classes");
      } catch { setErr("Network error"); }
    })();
  }, [router]);

  function logout() { clearTeacherToken(); router.push("/"); }

  async function saveMeetingLink() {
    const token = getTeacherToken();
    if (!token || !selectedClassId) return;
    setSaveMsg(null);
    setSaving(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/teacher/classes/${selectedClassId}/meeting-link`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ zoomLink: meetingLinkDraft.trim() }),
      });
      const data = (await res.json()) as {
        class?: ClassRow;
        message?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };
      if (!res.ok || !data.class) {
        const fieldErr = data.details?.fieldErrors?.zoomLink?.[0];
        setSaveMsg(fieldErr ?? data.message ?? "Could not update meeting link");
        return;
      }
      setClasses((prev) => prev.map((c) => (c.id === data.class!.id ? data.class! : c)));
      setMeetingLinkDraft(data.class.zoomLink);
      setSaveMsg("Meeting link updated for selected batch.");
    } catch {
      setSaveMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  function onSelectBatch(nextId: string) {
    setSelectedClassId(nextId);
    const row = classes.find((c) => c.id === nextId);
    setMeetingLinkDraft(row?.zoomLink ?? "");
    setSaveMsg(null);
  }
  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null;
  // ── End API calls ─────────────────────────────────────────────────────────

  if (!me && !err) return (
    <DashboardShell onLogout={logout}>
      <div className="flex justify-center py-24"><Spinner /></div>
    </DashboardShell>
  );

  if (err || !me) return (
    <DashboardShell>
      <Card>
        <p className="text-[var(--color-danger)]">{err ?? "Unauthorized"}</p>
        <Link href="/teacher/login" className="mt-4 inline-block text-sm text-[var(--color-primary)]">
          Teacher login
        </Link>
      </Card>
    </DashboardShell>
  );

  return (
    <DashboardShell onLogout={logout}>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
          Welcome back, {me.displayName}
        </h1>
        <p style={{ marginTop: 4, fontSize: 14, color: "#6b7280" }}>@{me.username}</p>
      </div>

      <div className="mt-2">
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Class Schedule
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          Today&apos;s Live Zoom Sessions (Times in IST)
        </p>
        {classesErr ? (
          <p style={{ color: "var(--color-danger)", fontSize: 14 }}>{classesErr}</p>
        ) : classes.length === 0 ? (
          <div
            style={{
              border: "2px dashed #e5e7eb",
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
              background: "#f9fafb",
            }}
          >
            <p style={{ fontSize: 14, color: "#9ca3af" }}>
              No sessions listed yet. Check back soon or contact admin.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {classes.map((c, i) => {
                const active = selectedClassId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectBatch(c.id)}
                    className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                      active
                        ? "border-orange-400 ring-2 ring-orange-100"
                        : "border-[var(--color-border)] hover:border-orange-300"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Batch {i + 1}</p>
                    <h3 className="mt-1 text-sm font-semibold text-gray-900">{c.title}</h3>
                    <p className="mt-1 text-xs text-gray-600">{c.timeLabel}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                      {active ? "Selected — update link below" : "Click to select this batch"}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedClass && (
              <Card className="mt-6 space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">
                    Update link for {selectedClass.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">Paste the new Google Meet / Zoom URL.</p>
                </div>
                <Input
                  id="teacher-meeting-link"
                  value={meetingLinkDraft}
                  onChange={(e) => setMeetingLinkDraft(e.target.value)}
                  placeholder="https://..."
                  className="w-full"
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => void saveMeetingLink()}
                    disabled={saving || meetingLinkDraft.trim().length === 0}
                  >
                    {saving ? <Spinner className="size-4" /> : "Save link"}
                  </Button>
                  {saveMsg && <p className="text-sm text-[var(--color-muted)]">{saveMsg}</p>}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}