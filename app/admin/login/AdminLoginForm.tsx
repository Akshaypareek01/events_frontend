"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { AdminShell } from "@/components/layout/AdminShell";
import { getApiBaseUrl } from "@/lib/api";
import { setAdminToken } from "@/lib/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { token?: string; message?: string };
      if (!res.ok || !data.token) {
        setErr(data.message ?? "Login failed");
        return;
      }
      setAdminToken(data.token);
      router.push("/admin");
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-md">
        <h1 className="font-[family-name:var(--font-display)] text-2xl">Admin login</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="a-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="a-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="a-pass" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="a-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {err && <FieldError>{err}</FieldError>}
          <Button type="submit" disabled={busy}>
            {busy ? <Spinner className="size-4" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}
