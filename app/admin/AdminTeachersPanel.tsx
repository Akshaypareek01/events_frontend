"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

type TeacherRow = {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  active: boolean;
  createdAt?: string;
};

type ListResponse = { teachers: TeacherRow[] };

/** Create teacher logins (username + password) and list / deactivate / delete. */
export function AdminTeachersPanel() {
  const [rows, setRows] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [createBusy, setCreateBusy] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [createInfo, setCreateInfo] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as ListResponse & { message?: string };
      if (!res.ok) {
        setErr(data.message ?? "Could not load teachers");
        return;
      }
      setRows(data.teachers ?? []);
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createTeacher(e: React.FormEvent) {
    e.preventDefault();
    setCreateErr(null);
    setCreateInfo(null);
    const token = getAdminToken();
    if (!token) return;
    setCreateBusy(true);
    try {
      const body: { username: string; password: string; displayName?: string; email?: string } = {
        username: username.trim(),
        password,
      };
      if (displayName.trim()) body.displayName = displayName.trim();
      const em = email.trim();
      if (em) body.email = em;
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/teachers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        message?: string;
        emailSent?: boolean;
        emailNote?: string;
      };
      if (!res.ok) {
        setCreateErr(data.message ?? "Create failed");
        return;
      }
      setUsername("");
      setPassword("");
      setDisplayName("");
      setEmail("");
      if (data.emailSent) {
        setCreateInfo("Login details were sent to the teacher’s email.");
      } else if (data.emailNote) {
        setCreateInfo(data.emailNote);
      }
      await load();
    } catch {
      setCreateErr("Network error");
    } finally {
      setCreateBusy(false);
    }
  }

  async function toggleActive(t: TeacherRow) {
    const token = getAdminToken();
    if (!token) return;
    const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/teachers/${t.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: !t.active }),
    });
    if (res.ok) await load();
  }

  async function removeTeacher(id: string) {
    if (!window.confirm("Delete this teacher account? They will not be able to log in.")) return;
    const token = getAdminToken();
    if (!token) return;
    const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/teachers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) await load();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
          Add teacher
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          3–32 characters: letters, numbers, underscores. Password min 6. Optional email sends username &
          password to the teacher (needs SMTP/SES + From configured on the server).
        </p>
        {createInfo && (
          <p className="mt-3 max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)]">
            {createInfo}
          </p>
        )}
        <form onSubmit={createTeacher} className="mt-4 max-w-md space-y-3">
          <div>
            <label htmlFor="new-username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="new-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={32}
              className="mt-1"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="new-pass" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="new-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="new-dn" className="text-sm font-medium">
              Display name (optional)
            </label>
            <Input
              id="new-dn"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Shown on teacher dashboard"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="new-email" className="text-sm font-medium">
              Teacher email (optional)
            </label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Send login link + username & password here"
              className="mt-1"
              autoComplete="off"
            />
          </div>
          {createErr && <p className="text-sm text-[var(--color-danger)]">{createErr}</p>}
          <Button type="submit" disabled={createBusy}>
            {createBusy ? <Spinner className="size-4" /> : "Create teacher"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
          Teachers
        </h2>
        {err && <p className="mt-2 text-sm text-[var(--color-danger)]">{err}</p>}
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-[var(--color-surface-muted)]/80">
              <tr>
                <th className="px-3 py-2 font-medium">Username</th>
                <th className="px-3 py-2 font-medium">Display name</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Active</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-[var(--color-muted)]">
                    No teachers yet.
                  </td>
                </tr>
              ) : (
                rows.map((t) => (
                  <tr key={t.id} className="border-t border-[var(--color-border)]">
                    <td className="px-3 py-2 font-mono text-xs">{t.username}</td>
                    <td className="px-3 py-2">{t.displayName}</td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-xs" title={t.email ?? ""}>
                      {t.email ?? "—"}
                    </td>
                    <td className="px-3 py-2">{t.active ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void toggleActive(t)}
                          className="text-[var(--color-primary)] hover:underline"
                        >
                          {t.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeTeacher(t.id)}
                          className="text-[var(--color-danger)] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
