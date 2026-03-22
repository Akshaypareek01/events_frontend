"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminDeleteUsersModal } from "@/components/admin/AdminDeleteUsersModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  companyDomain?: string;
  userType: string;
  paymentStatus: string;
  isApproved: boolean;
};

type ListResponse = {
  users: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const LIMIT_OPTIONS = [10, 20, 50, 100];

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

type Props = { mode: "all" | "corporate" };

type PaymentFilter = "all" | "paid" | "pending" | "free";

function reconcilePageAfterFetch(next: ListResponse | null, setPage: (u: number | ((n: number) => number)) => void) {
  if (!next) return;
  if (next.total === 0) {
    setPage(1);
    return;
  }
  const lastPage = Math.max(1, Math.ceil(next.total / next.limit));
  if (next.page > lastPage) setPage(lastPage);
}

/** Paginated user list with search, payment filter, row selection, and typed-confirm delete (single + bulk). */
export function AdminUsersPanel({ mode }: Props) {
  const [qInput, setQInput] = useState("");
  const [appliedQ, setAppliedQ] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<AdminUserRow[] | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchList = useCallback(async (): Promise<ListResponse | null> => {
    const token = getAdminToken();
    if (!token) return null;
    setLoading(true);
    setErr(null);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      q: appliedQ,
      userType: mode === "corporate" ? "corporate" : "all",
      paymentStatus,
    });
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as ListResponse & { message?: string };
      if (!res.ok) {
        setErr(json.message ?? "Failed to load users");
        setData(null);
        return null;
      }
      setData(json);
      return json;
    } catch {
      setErr("Network error");
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [page, limit, appliedQ, mode, paymentStatus]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, appliedQ, paymentStatus, mode, limit]);

  function applySearch() {
    setAppliedQ(qInput.trim());
    setPage(1);
  }

  const pageIds = data?.users.map((u) => u.id) ?? [];
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allPageSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;

  function toggleRow(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAllPage() {
    if (!data?.users.length) return;
    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  }

  const selectedUsers =
    data?.users.filter((u) => selectedIds.includes(u.id)) ?? [];

  async function runDelete() {
    if (!pendingDelete?.length) return;
    const token = getAdminToken();
    if (!token) return;
    setDeleteBusy(true);
    setErr(null);
    try {
      const base = getApiBaseUrl();
      if (pendingDelete.length === 1) {
        const res = await fetch(`${base}/api/v1/admin/users/${pendingDelete[0].id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = (await res.json()) as { message?: string };
        if (!res.ok) {
          setErr(json.message ?? "Delete failed");
          return;
        }
      } else {
        const res = await fetch(`${base}/api/v1/admin/users/bulk-delete`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: pendingDelete.map((u) => u.id) }),
        });
        const json = (await res.json()) as { message?: string };
        if (!res.ok) {
          setErr(json.message ?? "Delete failed");
          return;
        }
      }
      setPendingDelete(null);
      setSelectedIds([]);
      const next = await fetchList();
      reconcilePageAfterFetch(next, setPage);
    } catch {
      setErr("Network error");
    } finally {
      setDeleteBusy(false);
    }
  }

  const title = mode === "corporate" ? "Corporate users" : "Users";
  const from = data && data.total > 0 ? (data.page - 1) * data.limit + 1 : 0;
  const to = data ? Math.min(data.page * data.limit, data.total) : 0;

  return (
    <div className="space-y-4">
      <AdminDeleteUsersModal
        open={pendingDelete !== null}
        users={pendingDelete ?? []}
        onCancel={() => !deleteBusy && setPendingDelete(null)}
        onConfirm={runDelete}
        busy={deleteBusy}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[200px] flex-1">
          <label htmlFor={`search-${mode}`} className="text-xs font-medium text-[var(--color-muted)]">
            Search (name, email, phone)
          </label>
          <Input
            id={`search-${mode}`}
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applySearch())}
            placeholder="Search…"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor={`payment-${mode}`} className="text-xs font-medium text-[var(--color-muted)]">
            Payment
          </label>
          <select
            id={`payment-${mode}`}
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value as PaymentFilter);
              setPage(1);
            }}
            className="mt-1 block min-w-[140px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending payment</option>
            <option value="free">Free (corporate)</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={applySearch}>
            Search
          </Button>
          <div className="flex items-center gap-2">
            <label htmlFor={`limit-${mode}`} className="text-xs text-[var(--color-muted)]">
              Per page
            </label>
            <select
              id={`limit-${mode}`}
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
      </div>

      {selectedIds.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/8 px-4 py-3"
          role="status"
        >
          <p className="text-sm font-medium text-[var(--color-text)]">
            <span className="text-[var(--color-danger)]">{selectedIds.length}</span> selected on this page
          </p>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => setPendingDelete(selectedUsers)}
          >
            <TrashIcon className="shrink-0" />
            Delete selected
          </Button>
        </div>
      )}

      {err && <p className="text-sm text-[var(--color-danger)]">{err}</p>}

      {loading && !data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[var(--color-surface-muted)]/60">
                <tr>
                  <th className="w-10 px-2 py-2">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      disabled={loading || !pageIds.length}
                      onChange={toggleSelectAllPage}
                      aria-label="Select all users on this page"
                      className="h-4 w-4 rounded border-[var(--color-border)]"
                    />
                  </th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="px-3 py-2">Approved</th>
                  <th className="w-px px-2 py-2 text-right">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.users.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center text-[var(--color-muted)]">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  data?.users.map((u) => (
                    <tr key={u.id} className="border-t border-[var(--color-border)]">
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          disabled={loading}
                          onChange={() => toggleRow(u.id)}
                          aria-label={`Select ${u.name}`}
                          className="h-4 w-4 rounded border-[var(--color-border)]"
                        />
                      </td>
                      <td className="px-3 py-2">{u.name}</td>
                      <td className="px-3 py-2 break-all">{u.email}</td>
                      <td className="px-3 py-2">{u.phone ?? "—"}</td>
                      <td className="px-3 py-2">{u.city ?? "—"}</td>
                      <td className="px-3 py-2">{u.userType}</td>
                      <td className="px-3 py-2">{u.paymentStatus}</td>
                      <td className="px-3 py-2">{u.isApproved ? "yes" : "no"}</td>
                      <td className="px-2 py-2 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9 min-w-9 rounded-lg p-0 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                          disabled={loading || deleteBusy}
                          aria-label={`Delete ${u.name}`}
                          title="Delete user"
                          onClick={() => setPendingDelete([u])}
                        >
                          <TrashIcon />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data && data.total > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[var(--color-muted)]">
                {title}: showing {from}–{to} of {data.total}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={page <= 1 || loading}
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
                  disabled={page >= data.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
