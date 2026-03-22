"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

type Preview = {
  pendingPaymentCount: number;
  eligibleForClassCount: number;
  emailConfigured: boolean;
};

/** Manual email sends: payment nudges vs class-time reminders (paid + corporate with access). */
export function AdminRemindersPanel() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [classBusy, setClassBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/reminders/preview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as Preview & { message?: string };
      if (!res.ok) {
        setErr(json.message ?? "Could not load preview");
        setPreview(null);
        return;
      }
      setPreview(json);
    } catch {
      setErr("Network error");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  async function sendPaymentReminders() {
    const token = getAdminToken();
    if (!token) return;
    setPayBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/reminders/payment-pending`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { ok?: boolean; recipients?: number; message?: string };
      if (!res.ok) {
        setErr(json.message ?? "Send failed");
        return;
      }
      setMsg(`Payment reminders sent: ${json.recipients ?? 0} email(s).`);
      await loadPreview();
    } catch {
      setErr("Network error");
    } finally {
      setPayBusy(false);
    }
  }

  async function sendClassReminders() {
    const token = getAdminToken();
    if (!token) return;
    setClassBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/reminders/class-sessions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as {
        ok?: boolean;
        recipients?: number;
        skippedNoAccess?: number;
        message?: string;
      };
      if (!res.ok) {
        setErr(json.message ?? "Send failed");
        return;
      }
      setMsg(
        `Class reminders sent: ${json.recipients ?? 0} email(s). (${json.skippedNoAccess ?? 0} users skipped — no dashboard access yet.)`,
      );
      await loadPreview();
    } catch {
      setErr("Network error");
    } finally {
      setClassBusy(false);
    }
  }

  if (loading && !preview) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--color-muted)]">
        Send emails immediately. Payment reminders go only to <strong>individual</strong> accounts with{" "}
        <strong>pending</strong> payment. Class reminders go to everyone who can use the dashboard:{" "}
        <strong>paid</strong> individuals and <strong>approved corporate (free)</strong> users — not unpaid
        registrants.
      </p>

      {preview && !preview.emailConfigured && (
        <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 px-4 py-3 text-sm text-[var(--color-text)]">
          Email is not configured (SES/SMTP). Sends are logged only in server logs — configure{" "}
          <code className="rounded bg-[var(--color-surface-muted)] px-1">SES_SMTP_*</code> or{" "}
          <code className="rounded bg-[var(--color-surface-muted)] px-1">SMTP_*</code> for real delivery.
        </p>
      )}

      {err && <p className="text-sm text-[var(--color-danger)]">{err}</p>}
      {msg && <p className="text-sm text-[var(--color-success)]">{msg}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--color-border)] p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
            Payment reminder
          </h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Unpaid individual users get a link to complete payment (same flow as registration email).
          </p>
          <p className="mt-3 text-sm font-medium text-[var(--color-text)]">
            Matching users now:{" "}
            <span className="tabular-nums">{preview?.pendingPaymentCount ?? "—"}</span>
          </p>
          <Button
            type="button"
            className="mt-4"
            disabled={payBusy || (preview?.pendingPaymentCount ?? 0) === 0}
            onClick={() => void sendPaymentReminders()}
          >
            {payBusy ? <Spinner className="size-4" /> : "Send to all unpaid"}
          </Button>
        </Card>

        <Card className="border-[var(--color-border)] p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
            Class session reminder
          </h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Today&apos;s session times + dashboard link — for users who already have access (paid or corporate
            approved).
          </p>
          <p className="mt-3 text-sm font-medium text-[var(--color-text)]">
            Matching users now:{" "}
            <span className="tabular-nums">{preview?.eligibleForClassCount ?? "—"}</span>
          </p>
          <Button
            type="button"
            className="mt-4"
            disabled={classBusy || (preview?.eligibleForClassCount ?? 0) === 0}
            onClick={() => void sendClassReminders()}
          >
            {classBusy ? <Spinner className="size-4" /> : "Send class reminder to all with access"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
