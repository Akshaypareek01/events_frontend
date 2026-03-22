const USER_KEY = "yoga_token";
const ADMIN_KEY = "yoga_admin_token";

export function setUserToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, token);
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function clearUserToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_KEY, token);
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_KEY);
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_KEY);
}
