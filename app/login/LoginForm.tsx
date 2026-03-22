"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { getApiBaseUrl } from "@/lib/api";
import { setUserToken } from "@/lib/auth";

const COOLDOWN_SEC = 60;

type OtpErrJson = {
  message?: string;
  code?: string;
  details?: {
    retryAfterSec?: number;
    needsPayment?: boolean;
    userId?: string;
    payToken?: string;
  };
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [serverRetrySec, setServerRetrySec] = useState<number | null>(null);
  /** Successful sends this session (info only; server enforces hard cap). */
  const [sendCount, setSendCount] = useState(0);
  /** Set when API says user must pay before OTP; links to `/pay` with token. */
  const [payHref, setPayHref] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (serverRetrySec === null || serverRetrySec <= 0) return;
    const t = window.setInterval(() => {
      setServerRetrySec((s) => {
        if (s === null || s <= 1) return null;
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [serverRetrySec]);

  useEffect(() => {
    setPayHref(null);
  }, [email]);

  const requestOtp = useCallback(async () => {
    setErr(null);
    setPayHref(null);
    setBusy(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as OtpErrJson;
      if (!res.ok) {
        if (res.status === 429 && data.details?.retryAfterSec != null) {
          setServerRetrySec(data.details.retryAfterSec);
        } else {
          setServerRetrySec(null);
        }
        if (
          data.code === "NO_ACCESS" &&
          data.details?.needsPayment &&
          data.details.userId &&
          data.details.payToken
        ) {
          const q = new URLSearchParams({
            userId: data.details.userId,
            token: data.details.payToken,
          });
          setPayHref(`/pay?${q.toString()}`);
        }
        setErr(data.message ?? "Could not send code");
        return false;
      }

      setSendCount((c) => c + 1);
      setResendCooldown(COOLDOWN_SEC);
      setServerRetrySec(null);
      setPayHref(null);
      setStep("otp");
      return true;
    } catch {
      setErr("Network error");
      return false;
    } finally {
      setBusy(false);
    }
  }, [email]);

  async function onSubmitEmail(e: FormEvent) {
    e.preventDefault();
    await requestOtp();
  }

  async function onResend() {
    if (busy || resendCooldown > 0 || serverRetrySec !== null) return;
    await requestOtp();
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = (await res.json()) as { token?: string; message?: string };
      if (!res.ok || !data.token) {
        setErr(data.message ?? "Invalid code");
        return;
      }
      setUserToken(data.token);
      router.push("/dashboard");
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  function goBackToEmail() {
    setStep("email");
    setOtp("");
    setErr(null);
    setResendCooldown(0);
    setServerRetrySec(null);
    setPayHref(null);
  }

  const resendDisabled = busy || resendCooldown > 0 || serverRetrySec !== null;
  const resendLabel =
    resendCooldown > 0
      ? `Resend code (${resendCooldown}s)`
      : serverRetrySec !== null
        ? `Try again in ${serverRetrySec}s`
        : "Resend code";

  return (
    <MarketingShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Login</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Email OTP — use the same email you registered with (after payment / corporate approval). Up to 3
          codes per hour; wait 60s between sends.
        </p>
        {step === "email" ? (
          <form onSubmit={onSubmitEmail} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            {err && <FieldError>{err}</FieldError>}
            {payHref && (
              <Button type="button" onClick={() => router.push(payHref)}>
                Pay now
              </Button>
            )}
            <Button type="submit" disabled={busy}>
              {busy ? <Spinner className="size-4" /> : "Send code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-8 space-y-4">
            <p className="text-sm text-[var(--color-muted)]">
              We sent a 6-digit code to <strong className="text-[var(--color-text)]">{email}</strong>.
            </p>
            <div>
              <label htmlFor="otp" className="text-sm font-medium">
                6-digit code
              </label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="mt-1"
              />
            </div>
            {err && <FieldError>{err}</FieldError>}
            {sendCount >= 3 && (
              <p className="text-sm text-[var(--color-muted)]">
                You&apos;ve requested several codes. If emails are delayed, wait for the cooldown or try
                again after the time shown above. Need a fresh start?{" "}
                <button
                  type="button"
                  className="font-medium text-[var(--color-primary)] underline"
                  onClick={goBackToEmail}
                >
                  Change email
                </button>
                .
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button type="submit" disabled={busy}>
                {busy ? <Spinner className="size-4" /> : "Verify"}
              </Button>
              <Button type="button" variant="secondary" onClick={goBackToEmail}>
                Back
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={resendDisabled}
                onClick={() => void onResend()}
                className="sm:ml-auto"
              >
                {resendLabel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </MarketingShell>
  );
}
