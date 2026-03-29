"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getApiBaseUrl } from "@/lib/api";
import { clearUserToken, getUserToken } from "@/lib/auth";
import { UserStatusBadges } from "./DashboardBadges";
import { ClassScheduleSection, type ClassRow } from "./ClassScheduleSection";

type Me = {
  id: string;
  name: string;
  email: string;
  canAccess: boolean;
  userType: "normal" | "corporate";
  paymentStatus: "pending" | "paid" | "free";
  isApproved: boolean;
  companyName?: string;
};

export function DashboardClient() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [joinedClassIdToday, setJoinedClassIdToday] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [classesErr, setClassesErr] = useState<string | null>(null);

  useEffect(() => {
    const token = getUserToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const base = getApiBaseUrl();
    const headers = { Authorization: `Bearer ${token}` };

    void (async () => {
      try {
        const [meRes, clsRes] = await Promise.all([
          fetch(`${base}/api/v1/me`, { headers }),
          fetch(`${base}/api/v1/classes/today`, { headers }),
        ]);
        const meJson = (await meRes.json()) as {
          user?: Me;
          message?: string;
        };
        if (!meRes.ok || !meJson.user) {
          setErr(meJson.message ?? "Session invalid");
          return;
        }
        setMe(meJson.user);

        const clsJson = (await clsRes.json()) as {
          classes?: ClassRow[];
          joinedClassIdToday?: string | null;
          message?: string;
        };
        if (clsRes.ok && clsJson.classes) {
          setClasses(clsJson.classes);
          setJoinedClassIdToday(clsJson.joinedClassIdToday ?? null);
        } else {
          setClassesErr(clsJson.message ?? "Could not load classes");
        }
      } catch {
        setErr("Network error");
      }
    })();
  }, [router]);

  function logout() {
    clearUserToken();
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
          <Link href="/login" className="mt-4 inline-block text-sm text-[var(--color-primary)]">
            Login
          </Link>
        </Card>
      </DashboardShell>
    );
  }

  if (!me.canAccess) {
    return (
      <DashboardShell>
        <Card>
          <p className="text-[var(--color-muted)]">
            Complete payment or wait for corporate approval before accessing live links.
          </p>
          <Link
            href={`/pay?userId=${me.id}`}
            className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]"
          >
            Pay now
          </Link>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)] sm:text-3xl">
            Welcome back, {me.name.split(" ")[0]}
          </h1>
          <p className="mt-1 truncate text-sm text-[var(--color-muted)]">{me.email}</p>
        </div>
        <Button variant="ghost" type="button" onClick={logout} className="shrink-0">
          Log out
        </Button>
      </div>

      <Card className="mt-8 border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Your status
        </p>
        <div className="mt-4">
          <UserStatusBadges user={me} />
        </div>
      </Card>

      {classesErr ? (
        <p className="mt-6 text-sm text-[var(--color-danger)]">{classesErr}</p>
      ) : (
        <ClassScheduleSection
          classes={classes}
          joinedClassIdToday={joinedClassIdToday}
          onJoinedClassIdChange={setJoinedClassIdToday}
        />
      )}
    </DashboardShell>
  );
}
