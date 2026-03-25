"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { setAdminToken } from "@/lib/auth";

const iyBorder = "rgba(232,84,26,0.14)";

function BackChevronIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/** IYD landing-style admin sign-in — no AdminShell header. */
export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const goBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }, [router]);

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

  const inputClass =
    "mt-2 w-full rounded-sm border bg-white px-3 py-2.5 text-[15px] text-[#1C1208] placeholder:text-[#9A7A60] shadow-none outline-none transition focus:border-[#E8541A] focus:ring-2 focus:ring-[#E8541A]/20";

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#FDF6EE] text-[#1C1208]">
      <button
        type="button"
        onClick={goBack}
        className="absolute left-3 top-[max(1rem,env(safe-area-inset-top))] z-20 inline-flex items-center gap-2 rounded-sm border border-transparent px-2 py-2 text-[#5A3C22] transition hover:border-[rgba(232,84,26,0.2)] hover:bg-white/70 sm:left-5 sm:top-5"
        style={{ fontFamily: "var(--font-iyd-accent), ui-serif, Georgia, serif" }}
        aria-label="Go back"
      >
        <BackChevronIcon />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">Back</span>
      </button>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 pb-10 pt-[4.25rem] sm:pb-14 sm:pt-[4.5rem]">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/samsaralogomain.png"
              alt="Samsara"
              width={160}
              height={160}
              className="h-14 w-auto object-contain sm:h-16"
            />
          </div>

          <p className="text-[10px] font-normal uppercase tracking-[4px] text-[#E8541A]">Console</p>
          <h1
            className="mt-3 text-[clamp(1.5rem,4vw,2rem)] font-normal leading-tight text-[#1C1208]"
            style={{ fontFamily: "var(--font-iyd-display), ui-serif, Georgia, serif" }}
          >
            Admin login
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] font-light leading-relaxed text-[#5A3C22]">
            Authorized staff only. Use your admin email and password.
          </p>

          <div
            className="mt-8 rounded-lg border bg-white p-6 text-left shadow-[0_18px_50px_rgba(28,18,8,0.06)] sm:p-8"
            style={{ borderColor: iyBorder }}
          >
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="a-email"
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5A3C22]"
                >
                  Email
                </label>
                <input
                  id="a-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  style={{ borderColor: iyBorder }}
                />
              </div>
              <div>
                <label
                  htmlFor="a-pass"
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5A3C22]"
                >
                  Password
                </label>
                <input
                  id="a-pass"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                  style={{ borderColor: iyBorder }}
                />
              </div>

              {err && (
                <p className="rounded-lg border border-[#C2400D]/35 bg-[#E8541A]/10 px-3 py-2 text-center text-sm text-[#8B2E0E]">
                  {err}
                </p>
              )}

              <div className="flex flex-col items-center pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-11 min-w-[200px] items-center justify-center gap-2 rounded-sm bg-[#E8541A] px-8 py-3.5 text-[12px] font-bold uppercase tracking-[1.5px] text-white transition hover:bg-[#C2400D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8541A]/50 disabled:pointer-events-none disabled:opacity-50"
                  style={{ fontFamily: "var(--font-iyd-accent), ui-serif, Georgia, serif" }}
                >
                  {busy ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="size-4 border-white/35 border-t-white" />
                      Signing in…
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-[14px] font-light text-[#5A3C22]">
            <Link href="/login" className="font-semibold text-[#E8541A] underline-offset-2 hover:underline">
              Participant login
            </Link>
            <span className="mx-2 text-[#9A7A60]">·</span>
            <Link
              href="/teacher/login"
              className="font-semibold text-[#E8541A] underline-offset-2 hover:underline"
            >
              Teacher login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
