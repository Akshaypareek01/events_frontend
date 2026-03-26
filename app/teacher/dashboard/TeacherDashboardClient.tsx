"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getApiBaseUrl } from "@/lib/api";
import { clearTeacherToken, getTeacherToken } from "@/lib/auth";
import { ClassScheduleSection, type ClassRow } from "@/app/dashboard/ClassScheduleSection";

type TeacherMe = {
  id: string;
  username: string;
  displayName: string;
};

export function TeacherDashboardClient() {
  const router = useRouter();
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [classes, setClasses] = useState<ClassRow[]>([]);
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
        if (clsRes.ok && clsJson.classes) setClasses(clsJson.classes);
        else setClassesErr(clsJson.message ?? "Could not load classes");
      } catch { setErr("Network error"); }
    })();
  }, [router]);

  function logout() { clearTeacherToken(); router.push("/"); }
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

      {/* Status card */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Your Status</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Subscription</span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "#dcfce7", color: "#15803d",
              borderRadius: 999, padding: "3px 10px",
              fontSize: 12, fontWeight: 700,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              Active
            </span>
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Schedule */}
      {classesErr
        ? <p style={{ color: "var(--color-danger)", fontSize: 14 }}>{classesErr}</p>
        : <ClassScheduleSection classes={classes} />
      }
    </DashboardShell>
  );
}