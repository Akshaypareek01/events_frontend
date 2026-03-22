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
      className="text-sm"
      onClick={() => {
        clearAdminToken();
        router.push("/admin/login");
      }}
    >
      Log out
    </Button>
  );
}
