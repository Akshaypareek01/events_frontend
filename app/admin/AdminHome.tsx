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
import { AdminTeachersPanel } from "./AdminTeachersPanel";
import { cn } from "@/lib/cn";
import { getAdminToken } from "@/lib/auth";

type TabId =
  | "users"
  | "corporate"
  | "payments"
  | "domains"
  | "classes"
  | "reminders"
  | "teachers";

const TABS: { id: TabId; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "corporate", label: "Corporate users" },
  { id: "payments", label: "Payments" },
  { id: "domains", label: "Corporate domains" },
  { id: "classes", label: "Class links" },
  { id: "teachers", label: "Teachers" },
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

      <div className="mt-8 rounded-t-lg border border-b-0 border-[var(--color-border)] bg-white/80">
        <div className="-mx-4 overflow-x-auto overscroll-x-contain px-2 pb-px pt-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-2 [&::-webkit-scrollbar]:hidden">
          <nav
            className="flex w-max min-w-full flex-nowrap gap-0.5 sm:w-auto sm:flex-wrap"
            aria-label="Admin sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 rounded-t-md px-3 py-2.5 text-[12px] font-medium transition-colors sm:px-4",
                  tab === t.id
                    ? "bg-white text-[#1C1208] shadow-[inset_0_-2px_0_0_#E8541A]"
                    : "text-[#5A3C22] hover:bg-[#FDF6EE] hover:text-[#1C1208]",
                )}
                style={
                  tab === t.id
                    ? { fontFamily: "var(--font-iyd-accent), ui-serif, Georgia, serif" }
                    : undefined
                }
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <section className="mt-0 rounded-b-lg border border-t-0 border-[var(--color-border)] bg-white/95 px-4 py-6 sm:px-6 sm:py-8">
        {tab === "users" && <AdminUsersPanel mode="all" />}
        {tab === "corporate" && <AdminUsersPanel mode="corporate" />}
        {tab === "payments" && <AdminPaymentsPanel />}
        {tab === "domains" && <AdminProgramPanel />}
        {tab === "classes" && <AdminClassLinksPanel />}
        {tab === "teachers" && <AdminTeachersPanel />}
        {tab === "reminders" && <AdminRemindersPanel />}
      </section>
    </AdminShell>
  );
}
