"use client";

import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { getApiBaseUrl } from "@/lib/api";
import { getUserToken } from "@/lib/auth";

export function PayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const payToken = searchParams.get("token");
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

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

      const rzp = new window.Razorpay({
        key: orderData.keyId ?? keyId,
        amount: orderData.amount,
        currency: orderData.currency ?? "INR",
        name: "Samsara Yoga",
        description: "Program fee",
        order_id: orderData.orderId,
        theme: { color: "#2f5d50" },
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
      <MarketingShell>
        <div className="mx-auto max-w-lg px-4 py-16">
          <Card>
            <p className="text-[var(--color-muted)]">Missing user. Start from registration.</p>
            <Button className="mt-4" onClick={() => router.push("/register")}>
              Register
            </Button>
          </Card>
        </div>
      </MarketingShell>
    );
  }

  if (!keyId) {
    return (
      <MarketingShell>
        <div className="mx-auto max-w-lg px-4 py-16">
          <Card>
            <p className="text-[var(--color-danger)]">
              NEXT_PUBLIC_RAZORPAY_KEY_ID is not set in the frontend environment.
            </p>
          </Card>
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
          Complete payment
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">Secured by Razorpay · ₹499 program fee</p>
        <Card className="mt-8 space-y-4">
          {err && (
            <p className="rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]">
              {err}
            </p>
          )}
          <Button type="button" disabled={!scriptReady || busy} onClick={() => void pay()}>
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" />
                Working…
              </span>
            ) : (
              "Pay with Razorpay"
            )}
          </Button>
          {!scriptReady && <p className="text-sm text-[var(--color-muted)]">Loading checkout…</p>}
        </Card>
      </div>
    </MarketingShell>
  );
}
