"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function ChatbotLandingOnly() {
  const pathname = usePathname();
  const enabled =
    pathname === "/login" ||
    pathname === "/dashboard" ||
    pathname === "/register" ||
    pathname.startsWith("/register/");
  if (!enabled) return null;

  return (
    <Script
      src="https://apis.chatbot.nvhotech.in/chatbot.js"
      strategy="afterInteractive"
      data-user-id="69ce0a8ddb5e1b75035784e3"
    />
  );
}

