/** Meta Pixel id for The Moon Within. Shared by the loader and event calls. */
export const META_PIXEL_ID = "860541446358408";

const CONTENT_ID = "the-moon-within";
const CONTENT_NAME = "The Moon Within";

/** Fallback ticket price in INR when the gateway amount is not available yet. */
export const META_TICKET_INR = 199;

type MetaParams = Record<string, string | number | string[] | MetaContent[]>;

type MetaContent = { id: string; quantity: number };

type FbqArgs = unknown[];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const sentKeys = new Set<string>();
const pending: FbqArgs[] = [];
let flushing = false;

/**
 * Shared content params Meta uses to tie events to this event ticket.
 */
function contentParams(): MetaParams {
  return {
    content_ids: [CONTENT_ID],
    content_name: CONTENT_NAME,
    content_category: "Event",
    content_type: "product",
    contents: [{ id: CONTENT_ID, quantity: 1 }],
  };
}

/**
 * Ticket value params. Revenue events should use the gateway amount, not this fallback.
 */
function ticketValue(valueInr: number = META_TICKET_INR): MetaParams {
  return { value: valueInr, currency: "INR", num_items: 1 };
}

/**
 * True when this key was already sent in this tab session.
 */
function alreadySent(key: string): boolean {
  if (sentKeys.has(key)) return true;
  try {
    if (sessionStorage.getItem(key)) {
      sentKeys.add(key);
      return true;
    }
  } catch {
    /* private mode: in-memory set still dedupes this load */
  }
  return false;
}

/**
 * Marks a dedupe key so a refresh or React strict-mode replay does not double-count.
 */
function markSent(key: string): void {
  sentKeys.add(key);
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage blocked; in-memory set is enough for this page load */
  }
}

/**
 * Pushes a pixel call now, or queues it until the fbevents stub exists.
 */
function send(method: "track" | "trackCustom" | "init", ...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const payload: FbqArgs = [method, ...args];
  if (typeof window.fbq === "function") {
    window.fbq(...payload);
    return;
  }
  pending.push(payload);
  armFlush();
}

/**
 * Drains queued calls once `fbq` is defined by the pixel snippet.
 */
function armFlush(): void {
  if (flushing) return;
  flushing = true;
  const id = window.setInterval(() => {
    if (typeof window.fbq !== "function") return;
    window.clearInterval(id);
    flushing = false;
    const batch = pending.splice(0);
    for (const args of batch) window.fbq?.(...args);
  }, 100);
  window.setTimeout(() => {
    window.clearInterval(id);
    flushing = false;
  }, 8000);
}

/**
 * Sends a standard event once per browser session.
 */
function trackOnce(key: string, event: string, params?: MetaParams): void {
  const storageKey = `meta:${key}`;
  if (alreadySent(storageKey)) return;
  markSent(storageKey);
  send("track", event, params);
}

/**
 * PageView for client-side route changes. The first view is sent by the pixel snippet.
 */
export function trackPageView(): void {
  send("track", "PageView");
}

/**
 * Landing view of The Moon Within.
 */
export function trackViewContent(): void {
  trackOnce("view-content", "ViewContent", { ...contentParams(), ...ticketValue() });
}

/**
 * Visitor clicked through to registration (add-to-cart equivalent for a single ticket).
 */
export function trackAddToCart(): void {
  trackOnce("add-to-cart", "AddToCart", { ...contentParams(), ...ticketValue() });
}

/**
 * Mailto / contact click.
 */
export function trackContact(): void {
  trackOnce("contact", "Contact");
}

/**
 * Passes email, phone, and name into the pixel for advanced matching.
 * Meta hashes these in the browser before they leave the page.
 */
export function identifyMetaUser(user: {
  email?: string;
  phone?: string;
  name?: string;
  city?: string;
  externalId?: string;
}): void {
  const payload: Record<string, string> = {};
  const email = user.email?.trim().toLowerCase();
  const phone = user.phone?.replace(/\D/g, "");
  const city = user.city?.trim().toLowerCase().replace(/\s+/g, "");
  if (email) payload.em = email;
  if (phone) payload.ph = phone;
  if (city) payload.ct = city;
  if (user.externalId) payload.external_id = user.externalId;
  const parts = user.name?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  if (parts[0]) payload.fn = parts[0];
  if (parts.length > 1) payload.ln = parts.slice(1).join(" ");
  if (Object.keys(payload).length === 0) return;
  send("init", META_PIXEL_ID, payload);
}

/**
 * Successful registration: lead, completed form, application, and dated-seat booking.
 */
export function trackRegistration(input: {
  userType: "normal" | "corporate";
  email: string;
  phone: string;
  name: string;
  city: string;
  userId?: string;
}): void {
  identifyMetaUser(input);
  const params: MetaParams = {
    ...contentParams(),
    status: input.userType === "corporate" ? "corporate" : "individual",
  };
  send("track", "Lead", params);
  send("track", "CompleteRegistration", params);
  send("track", "SubmitApplication", params);
  send("track", "Schedule", params);
}

/**
 * Checkout page opened for a specific registrant.
 */
export function trackInitiateCheckout(userId: string): void {
  trackOnce(`checkout:${userId}`, "InitiateCheckout", { ...contentParams(), ...ticketValue() });
}

/**
 * Razorpay modal opened, so payment details are about to be entered.
 */
export function trackAddPaymentInfo(orderId: string, amountPaise: number, currency: string): void {
  trackOnce(`payment-info:${orderId}`, "AddPaymentInfo", {
    ...contentParams(),
    ...ticketValue(amountPaise / 100),
    currency: currency || "INR",
  });
}

/**
 * Payment verified. `amountPaise` is the Razorpay order amount (199 INR = 19900).
 */
export function trackPurchase(paymentId: string, amountPaise: number, currency: string): void {
  const storageKey = `meta:purchase:${paymentId}`;
  if (alreadySent(storageKey)) return;
  markSent(storageKey);
  send(
    "track",
    "Purchase",
    {
      ...contentParams(),
      value: amountPaise / 100,
      currency: currency || "INR",
      num_items: 1,
    },
    { eventID: paymentId },
  );
}

/**
 * Email OTP login succeeded.
 */
export function trackLogin(email: string): void {
  identifyMetaUser({ email });
  send("trackCustom", "Login");
}

/**
 * Paid or corporate member opened the live circle.
 */
export function trackJoinSession(): void {
  send("trackCustom", "JoinSession", contentParams());
}

/**
 * App-store banner click. Kept custom so it does not mix with the ₹199 ticket events.
 */
export function trackAppDownloadClick(store: "app_store" | "play_store"): void {
  send("trackCustom", "AppDownloadClick", {
    content_name: "Samsara Wellness App",
    store,
  });
}
