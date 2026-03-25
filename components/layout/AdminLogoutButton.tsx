"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { clearAdminToken } from "@/lib/auth";

/** Log out and return to admin login. Use in `AdminShell` header only. */
export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      type="button"
      className="rounded-sm border border-[rgba(232,84,26,0.25)] bg-transparent text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E8541A] hover:bg-[#E8541A]/10 hover:text-[#C2400D]"
      onClick={() => {
        clearAdminToken();
        router.push("/admin/login");
      }}
    >
      Log out
    </Button>
  );
}
