"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

type ProgramPayload = {
  title: string;
  durationMonths: number;
  priceInr: number;
  currency: string;
  allowedCorporateDomains: string[];
};

/** Admin: configure domains whose work emails get complimentary corporate access. */
export function AdminProgramPanel() {
  const [program, setProgram] = useState<ProgramPayload | null>(null);
  const [domainText, setDomainText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      setProgram({
        title: "Program",
        durationMonths: 3,
        priceInr: 499,
        currency: "INR",
        allowedCorporateDomains: [],
      });
      setDomainText("");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/program`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as ProgramPayload;
      if (!res.ok) {
        setErr("Could not load program settings");
        setProgram({
          title: "Program",
          durationMonths: 3,
          priceInr: 499,
          currency: "INR",
          allowedCorporateDomains: [],
        });
        setDomainText("");
        return;
      }
      setProgram(data);
      setDomainText((data.allowedCorporateDomains ?? []).join("\n"));
    } catch {
      setErr("Network error");
      setProgram({
        title: "Program",
        durationMonths: 3,
        priceInr: 499,
        currency: "INR",
        allowedCorporateDomains: [],
      });
      setDomainText("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveDomains() {
    const token = getAdminToken();
    if (!token) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    const lines = domainText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/program`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allowedCorporateDomains: lines }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setErr(data.message ?? "Save failed");
        return;
      }
      setMsg("Saved.");
      await load();
    } catch {
      setErr("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !program) {
    return (
      <Card className="flex justify-center py-10">
        <Spinner />
      </Card>
    );
  }

  return (
    <Card className="space-y-4 p-5">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
          Authorized corporate domains
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Work emails at these domains can register as <strong>Corporate</strong> with no payment and join
          live classes immediately. One domain per line (e.g. <code className="text-xs">samsarawellness.in</code>
          ). Users must sign up with a matching company email; all other corporate attempts are blocked.
        </p>
      </div>
      <label htmlFor="corp-domains" className="sr-only">
        Domain list
      </label>
      <textarea
        id="corp-domains"
        rows={8}
        value={domainText}
        onChange={(e) => setDomainText(e.target.value)}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 font-mono text-sm text-[var(--color-text)] shadow-inner outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]"
        placeholder={"samsarawellness.in\npartner.org"}
        spellCheck={false}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" disabled={saving} onClick={() => void saveDomains()}>
          {saving ? <Spinner className="size-4" /> : "Save domains"}
        </Button>
        {msg && <span className="text-sm text-[var(--color-success)]">{msg}</span>}
        {err && <span className="text-sm text-[var(--color-danger)]">{err}</span>}
      </div>
      <p className="text-xs text-[var(--color-muted)]">
        Program: {program.title} · ₹{program.priceInr} {program.currency}
      </p>
    </Card>
  );
}
