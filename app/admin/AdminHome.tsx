"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminLogoutButton } from "@/components/layout/AdminLogoutButton";
import { AdminClassLinksPanel } from "./AdminClassLinksPanel";
import { AdminProgramPanel } from "./AdminProgramPanel";
import { AdminStatsBar } from "./AdminStatsBar";
import { AdminPaymentsPanel } from "./AdminPaymentsPanel";
import { AdminRemindersPanel } from "./AdminRemindersPanel";
import { AdminUsersPanel } from "./AdminUsersPanel";
import { cn } from "@/lib/cn";
import { getAdminToken } from "@/lib/auth";

type TabId = "users" | "corporate" | "payments" | "domains" | "classes" | "reminders";

const TABS: { id: TabId; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "corporate", label: "Corporate users" },
  { id: "payments", label: "Payments" },
  { id: "domains", label: "Corporate domains" },
  { id: "classes", label: "Class links" },
  { id: "reminders", label: "Reminders" },
];

export function AdminHome() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabId>("users");

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <AdminShell headerRight={<AdminLogoutButton />}>
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell headerRight={<AdminLogoutButton />}>
      <AdminStatsBar />

      <div className="mt-8 border-b border-[var(--color-border)]">
        <nav className="flex flex-wrap gap-1" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "relative rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-[inset_0_-2px_0_0_var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)]/60 hover:text-[var(--color-text)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <section className="mt-6">
        {tab === "users" && <AdminUsersPanel mode="all" />}
        {tab === "corporate" && <AdminUsersPanel mode="corporate" />}
        {tab === "payments" && <AdminPaymentsPanel />}
        {tab === "domains" && <AdminProgramPanel />}
        {tab === "classes" && <AdminClassLinksPanel />}
        {tab === "reminders" && <AdminRemindersPanel />}
      </section>
    </AdminShell>
  );
}
