"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
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

  useEffect(() => {
    const token = getTeacherToken();
    if (!token) {
      router.replace("/teacher/login");
      return;
    }
    const base = getApiBaseUrl();
    const headers = { Authorization: `Bearer ${token}` };

    void (async () => {
      try {
        const [meRes, clsRes] = await Promise.all([
          fetch(`${base}/api/v1/teacher/me`, { headers }),
          fetch(`${base}/api/v1/classes/today`, { headers }),
        ]);
        const meJson = (await meRes.json()) as {
          teacher?: TeacherMe;
          message?: string;
        };
        if (!meRes.ok || !meJson.teacher) {
          setErr(meJson.message ?? "Session invalid");
          return;
        }
        setMe(meJson.teacher);

        const clsJson = (await clsRes.json()) as {
          classes?: ClassRow[];
          message?: string;
        };
        if (clsRes.ok && clsJson.classes) {
          setClasses(clsJson.classes);
        } else {
          setClassesErr(clsJson.message ?? "Could not load classes");
        }
      } catch {
        setErr("Network error");
      }
    })();
  }, [router]);

  function logout() {
    clearTeacherToken();
    router.push("/");
  }

  if (!me && !err) {
    return (
      <DashboardShell>
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </DashboardShell>
    );
  }

  if (err || !me) {
    return (
      <DashboardShell>
        <Card>
          <p className="text-[var(--color-danger)]">{err ?? "Unauthorized"}</p>
          <Link href="/teacher/login" className="mt-4 inline-block text-sm text-[var(--color-primary)]">
            Teacher login
          </Link>
        </Card>
      </DashboardShell>
    );
  }

  const firstName = me.displayName.split(/\s+/)[0] || me.username;

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)] sm:text-3xl">
            Welcome, {firstName}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            @{me.username} · Teacher
          </p>
        </div>
        <Button variant="ghost" type="button" onClick={logout} className="shrink-0">
          Log out
        </Button>
      </div>

      <Card className="mt-8 border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Today&apos;s live sessions
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Same Zoom links as participants — host from your Zoom client if you run the session.
        </p>
      </Card>

      {classesErr ? (
        <p className="mt-6 text-sm text-[var(--color-danger)]">{classesErr}</p>
      ) : (
        <ClassScheduleSection classes={classes} />
      )}
    </DashboardShell>
  );
}
