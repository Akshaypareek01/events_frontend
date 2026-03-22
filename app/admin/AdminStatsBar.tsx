"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

export type AdminStats = {
  totalUsers: number;
  corporateUsers: number;
  individualUsers: number;
  corporateDomainsCount: number;
  paidRegistrations: number;
  totalRevenueInr: number;
  programPriceInr: number;
  currency: string;
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card className="border-[var(--color-border)] p-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--color-muted)]">{sub}</p>}
    </Card>
  );
}

function formatInr(n: number, currency: string) {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  }
  return `${currency} ${n.toLocaleString()}`;
}

/** Summary metrics above admin tabs. */
export function AdminStatsBar() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as AdminStats & { message?: string };
      if (!res.ok) {
        setErr(data.message ?? "Could not load stats");
        return;
      }
      setStats(data);
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (err || !stats) {
    return <p className="text-sm text-[var(--color-danger)]">{err ?? "No stats"}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total users" value={stats.totalUsers} />
      <StatCard label="Individual" value={stats.individualUsers} sub="userType: normal" />
      <StatCard label="Corporate users" value={stats.corporateUsers} />
      <StatCard
        label="Corporate domains"
        value={stats.corporateDomainsCount}
        sub="allowed in program"
      />
      <StatCard label="Paid registrations" value={stats.paidRegistrations} sub={`@ ₹${stats.programPriceInr} each`} />
      <StatCard
        label="Total revenue"
        value={formatInr(stats.totalRevenueInr, stats.currency)}
        sub="paid × program fee"
      />
    </div>
  );
}
