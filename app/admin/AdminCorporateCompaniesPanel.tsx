"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

type CompanyRow = {
  id: string;
  name: string;
  couponCode: string;
};

type ListResponse = { companies: CompanyRow[] };

/** Admin: corporate companies — name + coupon only; users verify with coupon at registration. */
export function AdminCorporateCompaniesPanel() {
  const [rows, setRows] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [createName, setCreateName] = useState("");
  const [createCoupon, setCreateCoupon] = useState("");
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<CompanyRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editCoupon, setEditCoupon] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/corporate-companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as ListResponse & { message?: string };
      if (!res.ok) {
        setErr(data.message ?? "Could not load companies");
        setRows([]);
        return;
      }
      setRows(data.companies ?? []);
    } catch {
      setErr("Network error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createCompany() {
    const token = getAdminToken();
    if (!token) return;
    setCreating(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/corporate-companies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createName.trim(),
          couponCode: createCoupon.trim(),
        }),
      });
      const data = (await res.json()) as { message?: string; code?: string };
      if (!res.ok) {
        setErr(data.message ?? "Create failed");
        return;
      }
      setMsg("Company created.");
      setCreateName("");
      setCreateCoupon("");
      await load();
    } catch {
      setErr("Network error");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(c: CompanyRow) {
    setEditing(c);
    setEditName(c.name);
    setEditCoupon(c.couponCode);
    setErr(null);
    setMsg(null);
  }

  async function saveEdit() {
    if (!editing) return;
    const token = getAdminToken();
    if (!token) return;
    setSavingEdit(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(
        `${getApiBaseUrl()}/api/v1/admin/corporate-companies/${editing.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName.trim(),
            couponCode: editCoupon.trim(),
          }),
        },
      );
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setErr(data.message ?? "Update failed");
        return;
      }
      setMsg("Company updated.");
      setEditing(null);
      await load();
    } catch {
      setErr("Network error");
    } finally {
      setSavingEdit(false);
    }
  }

  async function removeCompany(id: string) {
    if (!window.confirm("Delete this company? Only allowed if no users are linked.")) return;
    const token = getAdminToken();
    if (!token) return;
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/corporate-companies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setErr(data.message ?? "Delete failed");
        return;
      }
      setMsg("Company deleted.");
      await load();
    } catch {
      setErr("Network error");
    }
  }

  if (loading && rows.length === 0) {
    return (
      <Card className="flex justify-center py-12">
        <Spinner />
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-5">
        <div>
          <h2
            className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-iyd-display), ui-serif, Georgia, serif" }}
          >
            Add corporate company
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Create a company and a unique coupon code. Corporate users pick the company and enter that coupon to
            register for free — no employee ID required.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-[var(--color-muted)]" htmlFor="cc-name">
              Company name
            </label>
            <Input
              id="cc-name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="mt-1"
              placeholder="Acme India Pvt Ltd"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-muted)]" htmlFor="cc-coupon">
              Coupon code
            </label>
            <Input
              id="cc-coupon"
              value={createCoupon}
              onChange={(e) => setCreateCoupon(e.target.value)}
              className="mt-1"
              placeholder="ACME-YOGA-2026"
              autoComplete="off"
            />
          </div>
        </div>
        <Button type="button" disabled={creating} onClick={() => void createCompany()}>
          {creating ? <Spinner className="size-4" /> : "Create company"}
        </Button>
      </Card>

      {editing && (
        <Card className="space-y-4 border-[var(--color-primary)]/30 p-5">
          <h3 className="font-medium text-[var(--color-text)]">Edit {editing.name}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-[var(--color-muted)]">Name</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)]">Coupon code</label>
              <Input value={editCoupon} onChange={(e) => setEditCoupon(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={savingEdit} onClick={() => void saveEdit()}>
              {savingEdit ? <Spinner className="size-4" /> : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" disabled={savingEdit} onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {msg && <p className="text-sm text-[var(--color-success)]">{msg}</p>}
      {err && <p className="text-sm text-[var(--color-danger)]">{err}</p>}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-[var(--color-border)] px-5 py-3">
          <h2 className="text-base font-medium text-[var(--color-text)]">Companies ({rows.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-[var(--color-surface-muted)]/50">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Coupon</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-[var(--color-muted)]">
                    No companies yet. Create one above so users can register as Corporate.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-2 font-medium">{r.name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{r.couponCode}</td>
                    <td className="px-4 py-2 text-right">
                      <Button type="button" variant="secondary" className="mr-2" onClick={() => openEdit(r)}>
                        Edit
                      </Button>
                      <Button type="button" variant="destructive" onClick={() => void removeCompany(r.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
