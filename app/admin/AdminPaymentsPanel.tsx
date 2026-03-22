"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

type TxRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  userType: string;
  paymentStatus: string;
  isApproved: boolean;
  amountInr: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt: string | null;
  registeredAt: string;
  sortDate: string;
};

type ListResponse = {
  transactions: TxRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  programPriceInr: number;
  currency: string;
};

const LIMIT_OPTIONS = [10, 20, 50, 100];

function fmtLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from: fmtLocalYmd(from), to: fmtLocalYmd(to) };
}

function formatMoney(n: number, currency: string) {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  }
  return `${currency} ${n.toLocaleString()}`;
}

/** Single primary timestamp for the row (sort key). */
function fmtWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function fmtLocation(city?: string, country?: string) {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

function UserCell({ t }: { t: TxRow }) {
  return (
    <div className="max-w-[min(100%,14rem)] space-y-0.5">
      <div className="font-medium leading-snug text-[var(--color-text)]">{t.name}</div>
      <div className="break-all text-xs leading-snug text-[var(--color-muted)]">{t.email}</div>
      <div className="text-xs text-[var(--color-muted)]">{t.phone || "—"}</div>
    </div>
  );
}

function WhenCell({ t }: { t: TxRow }) {
  const s = fmtWhen(t.sortDate);
  const reg = fmtWhen(t.registeredAt);
  const paid = t.paidAt ? fmtWhen(t.paidAt) : null;
  const subs: string[] = [];
  if (reg !== s) subs.push(`Joined ${reg}`);
  if (paid && paid !== s) subs.push(`Paid ${paid}`);
  return (
    <div className="min-w-[9rem] space-y-1">
      <div className="font-medium text-[var(--color-text)]">{s}</div>
      {subs.length > 0 && (
        <div className="space-y-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
          {subs.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function RazorpayCell({ t }: { t: TxRow }) {
  const order = t.razorpayOrderId;
  const pay = t.razorpayPaymentId;
  if (!order && !pay) {
    return <span className="text-[var(--color-muted)]">—</span>;
  }
  return (
    <div className="max-w-[11rem] space-y-1 font-mono text-[11px] leading-snug text-[var(--color-text)]">
      {order && (
        <div>
          <span className="text-[var(--color-muted)]">Order </span>
          <span className="break-all">{order}</span>
        </div>
      )}
      {pay && (
        <div>
          <span className="text-[var(--color-muted)]">Pay </span>
          <span className="break-all">{pay}</span>
        </div>
      )}
    </div>
  );
}

/** Admin payment / registration transactions with date range and status filters. */
export function AdminPaymentsPanel() {
  const [status, setStatus] = useState<"all" | "paid" | "pending" | "free">("all");
  const [appliedStatus, setAppliedStatus] = useState<typeof status>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const initialRange = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [appliedFrom, setAppliedFrom] = useState(initialRange.from);
  const [appliedTo, setAppliedTo] = useState(initialRange.to);

  const fetchList = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: appliedStatus,
    });
    if (appliedFrom && appliedTo) {
      params.set("from", appliedFrom);
      params.set("to", appliedTo);
    }
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/payments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as ListResponse & { message?: string };
      if (!res.ok) {
        setErr(json.message ?? "Failed to load payments");
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setErr("Network error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, appliedFrom, appliedTo, appliedStatus]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  function applyFilters() {
    if (from && to) {
      setAppliedFrom(from);
      setAppliedTo(to);
    } else if (!from && !to) {
      setAppliedFrom("");
      setAppliedTo("");
    } else {
      setErr("Set both start and end date, or clear both for all dates");
      return;
    }
    setAppliedStatus(status);
    setPage(1);
    setErr(null);
  }

  function clearDates() {
    setFrom("");
    setTo("");
    setAppliedFrom("");
    setAppliedTo("");
    setPage(1);
  }

  const rangeLabel =
    appliedFrom && appliedTo
      ? `${appliedFrom} → ${appliedTo} (UTC day bounds)`
      : "All dates";

  const fromN = data && data.total > 0 ? (data.page - 1) * data.limit + 1 : 0;
  const toN = data ? Math.min(data.page * data.limit, data.total) : 0;

  return (
    <div className="space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-lg">Payments</h2>
      <p className="text-sm text-[var(--color-muted)]">
        Filter by range (UTC days) and status. The <strong>first date</strong> in each row is the sort key;
        lines below show joined / paid when relevant.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="flex flex-wrap gap-3">
          <div>
            <label htmlFor="pay-from" className="text-xs font-medium text-[var(--color-muted)]">
              From
            </label>
            <input
              id="pay-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="pay-to" className="text-xs font-medium text-[var(--color-muted)]">
              To
            </label>
            <input
              id="pay-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="pay-status" className="text-xs font-medium text-[var(--color-muted)]">
            Status
          </label>
          <select
            id="pay-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="mt-1 block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="free">Free (corporate)</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={applyFilters}>
            Apply
          </Button>
          <Button type="button" variant="ghost" onClick={clearDates}>
            Clear dates
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pay-limit" className="text-xs text-[var(--color-muted)]">
            Per page
          </label>
          <select
            id="pay-limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2 text-sm"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        {rangeLabel}
        {data && (
          <>
            {" "}
            · Program fee: {formatMoney(data.programPriceInr, data.currency)} · Showing {fromN}–{toN} of{" "}
            {data.total}
          </>
        )}
      </p>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}
      {err && !loading && <p className="text-sm text-[var(--color-danger)]">{err}</p>}

      {!loading && data && (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[52rem] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[17%]" />
              <col className="w-[26%]" />
              <col className="w-[12%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-[var(--color-surface-muted)]/60">
              <tr>
                <th className="px-3 py-2.5 align-bottom font-medium">When</th>
                <th className="px-3 py-2.5 align-bottom font-medium">User</th>
                <th className="px-3 py-2.5 align-bottom font-medium">Location</th>
                <th className="px-3 py-2.5 align-bottom font-medium">Account</th>
                <th className="px-3 py-2.5 align-bottom font-medium">Amount</th>
                <th className="px-3 py-2.5 align-bottom font-medium">Razorpay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-[var(--color-muted)]">
                    No rows for this filter.
                  </td>
                </tr>
              ) : (
                data.transactions.map((t) => (
                  <tr key={t.id} className="align-top">
                    <td className="px-3 py-3">
                      <WhenCell t={t} />
                    </td>
                    <td className="px-3 py-3">
                      <UserCell t={t} />
                    </td>
                    <td className="px-3 py-3 text-[var(--color-text)]">{fmtLocation(t.city, t.country)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-xs">
                        <span className="rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-medium capitalize">
                          {t.userType}
                        </span>
                        <span className="rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-medium capitalize">
                          {t.paymentStatus}
                        </span>
                        <span
                          className={
                            t.isApproved
                              ? "rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-medium text-[var(--color-success)]"
                              : "rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-medium text-[var(--color-muted)]"
                          }
                        >
                          {t.isApproved ? "Approved" : "Not approved"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium tabular-nums">
                      {formatMoney(t.amountInr, t.currency)}
                    </td>
                    <td className="px-3 py-3">
                      <RazorpayCell t={t} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data && data.totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-[var(--color-muted)]">
            Page {data.page} / {data.totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
