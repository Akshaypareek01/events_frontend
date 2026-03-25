"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { LoginSplitLayout } from "@/components/auth/LoginSplitLayout";
import { Spinner } from "@/components/ui/Spinner";
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [serverRetrySec, setServerRetrySec] = useState<number | null>(null);
  const [sendCount, setSendCount] = useState(0);
  const [payHref, setPayHref] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  useEffect(() => { setPayHref(null); }, [email]);

  const requestOtp = useCallback(async () => {
    setErr(null);
    setSuccessMsg(null);
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
      setSuccessMsg(`We sent a 6-digit code to ${email}`);
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
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
    setOtp(["", "", "", "", "", ""]);
    await requestOtp();
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const code = otp.join("");
      const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
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
    setOtp(["", "", "", "", "", ""]);
    setErr(null);
    setSuccessMsg(null);
    setResendCooldown(0);
    setServerRetrySec(null);
    setPayHref(null);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  }

  const resendDisabled = busy || resendCooldown > 0 || serverRetrySec !== null;

  const inputClass =
    "w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

  /* ── Info box ── */
  const InfoBox = () => (
    <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
      <p className="mb-0.5 flex items-center gap-1.5 text-sm font-semibold text-blue-700">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        Login Return Status
      </p>
      <p className="text-xs text-blue-600 leading-relaxed">
        Email OTP - Use the same email you registered with (after payment/corporate approval).
        Up to 3 codes, wait 60 seconds between sends.
      </p>
    </div>
  );

  /* ── Email step ── */
  if (step === "email") {
    return (
      <LoginSplitLayout>
        <h1 className="mb-1 text-center text-3xl font-bold text-gray-900">Email Verification</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Verify your email address to continue</p>

        <InfoBox />

        <form onSubmit={onSubmitEmail}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {err && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {err}
              </p>
            )}

            {payHref && (
              <button
                type="button"
                onClick={() => router.push(payHref)}
                className="w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Pay now
              </button>
            )}

            <button
              type="submit"
              disabled={busy || Boolean(payHref)}
              className="w-full rounded-full bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {busy ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Spinner className="size-4 border-t-white" /> Sending…
                </span>
              ) : (
                "Send Code"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Teacher (username & password)?{" "}
          <Link href="/teacher/login" className="font-semibold text-orange-500 hover:text-orange-600">
            Teacher login
          </Link>
        </p>
      </LoginSplitLayout>
    );
  }

  /* ── OTP step ── */
  return (
    <LoginSplitLayout>
      <h1 className="mb-1 text-center text-3xl font-bold text-gray-900">Email Verification</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Verify your email address to continue</p>

      <InfoBox />

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          We sent a 6-digit code to{" "}
          <span className="font-semibold">{email}</span>
        </div>
      )}

      <form onSubmit={verifyOtp}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md space-y-5">
          <div>
            <p className="mb-3 text-center text-sm font-semibold text-gray-700">
              Verification Code <span className="text-orange-500">*</span>
            </p>
            <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`h-12 w-12 rounded-xl border text-center text-lg font-semibold outline-none transition
                    ${digit
                      ? "border-orange-400 bg-white text-gray-900 ring-2 ring-orange-100"
                      : "border-gray-200 bg-gray-50 text-gray-900"
                    } focus:border-orange-400 focus:ring-2 focus:ring-orange-100`}
                />
              ))}
            </div>
          </div>

          {err && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {err}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy || otp.join("").length < 6}
              className="flex-1 rounded-full bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {busy ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Spinner className="size-4 border-t-white" /> Verifying…
                </span>
              ) : (
                "Verify"
              )}
            </button>
            <button
              type="button"
              onClick={goBackToEmail}
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Back
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-between px-1 text-sm text-gray-500">
        <span>Didn&apos;t receive the code?</span>
        <span className="flex items-center gap-2">
          {(resendCooldown > 0 || serverRetrySec !== null) && (
            <span className="text-gray-400">
              {resendCooldown > 0 ? `${resendCooldown}s` : `${serverRetrySec}s`}
            </span>
          )}
          <button
            type="button"
            disabled={resendDisabled}
            onClick={() => void onResend()}
            className={`font-semibold transition ${resendDisabled ? "cursor-not-allowed text-gray-300" : "text-orange-500 hover:text-orange-600"}`}
          >
            Resend Code
          </button>
        </span>
      </div>

      {sendCount >= 3 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Need a fresh start?{" "}
          <button type="button" onClick={goBackToEmail} className="text-orange-500 underline">
            Change email
          </button>
        </p>
      )}
    </LoginSplitLayout>
  );
}