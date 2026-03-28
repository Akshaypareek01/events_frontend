"use client";

import Image from "next/image";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getUserToken } from "@/lib/auth";

/** IYD landing tokens — same as `public/samsara-iyd-landing.html` */
const iy = {
  border: "rgba(232,84,26,0.14)",
} as const;

/**
 * Logo URL passed to Razorpay `image` — their servers fetch it, so it must be absolute and
 * publicly reachable (HTTPS in production). Optional full URL if assets live elsewhere.
 */
function razorpayCheckoutLogoUrl(): string {
  const full = process.env.NEXT_PUBLIC_CHECKOUT_LOGO_URL?.trim();
  if (full) return full;
  return `${window.location.origin}/adaptive-icon.png`;
}

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

/** Top-left back; main area padded so centered copy doesn’t collide with the control. */
function PaySurface({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const goBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }, [router]);

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
        {children}
      </main>
    </div>
  );
}

/** Centered column; card innards use flex to center the CTA. */
function IydCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex w-full max-w-lg flex-col items-center rounded-lg border bg-white p-6 text-center shadow-[0_18px_50px_rgba(28,18,8,0.06)] sm:p-8 ${className}`}
      style={{ borderColor: iy.border }}
    >
      {children}
    </div>
  );
}

function IydPrimaryButton({
  children,
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-11 min-w-[220px] touch-manipulation items-center justify-center gap-2 rounded-sm bg-[#E8541A] px-9 py-4 text-[12px] font-bold uppercase tracking-[1.5px] text-white transition hover:bg-[#C2400D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8541A]/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      style={{ fontFamily: "var(--font-iyd-accent), ui-serif, Georgia, serif" }}
    >
      {children}
    </button>
  );
}

export function PayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const payToken = searchParams.get("token");
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

  /**
   * `next/script` `onLoad` often does not run after client-side navigation when the script is
   * already cached — `scriptReady` stayed false until a full refresh. Detect `window.Razorpay`
   * directly + `onReady`, with a short poll as fallback.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setScriptReady(true);
      return;
    }
    const id = window.setInterval(() => {
      if (window.Razorpay) {
        setScriptReady(true);
        window.clearInterval(id);
      }
    }, 50);
    const timeout = window.setTimeout(() => window.clearInterval(id), 20_000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, []);

  const pay = useCallback(async () => {
    if (!userId || !keyId) return;
    const sessionJwt = getUserToken();
    if (!payToken && !sessionJwt) {
      setErr(
        "Use the link from your registration email, or log in with your email first and open Pay from your dashboard.",
      );
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (sessionJwt) headers.Authorization = `Bearer ${sessionJwt}`;
      const body: { userId: string; payToken?: string } = { userId };
      if (payToken) body.payToken = payToken;

      const orderRes = await fetch(`${getApiBaseUrl()}/api/v1/payments/create-order`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const orderData = (await orderRes.json()) as {
        message?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
      };
      if (!orderRes.ok) {
        setErr(orderData.message ?? "Could not start payment");
        return;
      }
      if (!window.Razorpay || !orderData.orderId || orderData.amount == null) {
        setErr("Checkout unavailable");
        return;
      }

      const checkoutLogoUrl = razorpayCheckoutLogoUrl();

      const rzp = new window.Razorpay({
        key: orderData.keyId ?? keyId,
        amount: orderData.amount,
        currency: orderData.currency ?? "INR",
        /** Merchant title on Razorpay modal (font is usually set in Razorpay Dashboard → Checkout styling → Times). */
        name: "Samsara",
        description: "Program fee",
        image: checkoutLogoUrl,
        order_id: orderData.orderId,
        theme: { color: "#E8541A" },
        handler: async (response) => {
          const verifyRes = await fetch(`${getApiBaseUrl()}/api/v1/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (!verifyRes.ok) {
            setErr("Payment verification failed — contact support with your receipt.");
            return;
          }
          router.push("/dashboard");
        },
      });
      rzp.open();
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }, [keyId, router, userId, payToken]);

  if (!userId) {
    return (
      <PaySurface>
        <div className="w-full max-w-lg text-balance text-center">
          <IydCard className="gap-4">
            <p className="max-w-md text-[15px] font-light leading-relaxed text-[#5A3C22]">
              Missing user. Start from registration.
            </p>
            <IydPrimaryButton onClick={() => router.push("/register")}>Register</IydPrimaryButton>
          </IydCard>
        </div>
      </PaySurface>
    );
  }

  if (!keyId) {
    return (
      <PaySurface>
        <div className="w-full max-w-lg text-balance text-center">
          <IydCard>
            <p className="max-w-md text-[15px] font-light leading-relaxed text-[#C2400D]">
              NEXT_PUBLIC_RAZORPAY_KEY_ID is not set in the frontend environment.
            </p>
          </IydCard>
        </div>
      </PaySurface>
    );
  }

  return (
    <PaySurface>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
      />
      <div className="w-full max-w-lg text-balance text-center">
        <div className="mb-5 flex justify-center">
          <Image
            src="/adaptive-icon.png"
            alt="Samsara"
            width={88}
            height={88}
            className="rounded-full shadow-[0_10px_28px_rgba(28,18,8,0.12)]"
            priority
          />
        </div>
        <p className="text-[10px] font-normal uppercase tracking-[4px] text-[#E8541A]">Checkout</p>
        <h1
          className="mt-3 text-[clamp(1.75rem,4vw,2.25rem)] font-normal leading-tight text-[#1C1208]"
          style={{ fontFamily: "var(--font-iyd-display), ui-serif, Georgia, serif" }}
        >
          Complete payment
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] font-light leading-relaxed text-[#5A3C22]">
          Secured by Razorpay · ₹499 + 18% GST (total ₹588.82)
        </p>
        <IydCard className="mt-8 gap-4">
          {err && (
            <p className="w-full max-w-md break-words rounded-lg border border-[#C2400D]/35 bg-[#E8541A]/10 px-3 py-2 text-sm text-[#8B2E0E]">
              {err}
            </p>
          )}
          <IydPrimaryButton disabled={!scriptReady || busy} onClick={() => void pay()}>
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4 border-white/35 border-t-white" />
                Working…
              </span>
            ) : (
              "Pay with Razorpay"
            )}
          </IydPrimaryButton>
          {!scriptReady && (
            <p className="text-sm font-light text-[#9A7A60]">Loading checkout…</p>
          )}
        </IydCard>
      </div>
    </PaySurface>
  );
}
