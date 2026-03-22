"use client";

import { useEffect, useState } from "react";
import { getUserToken } from "@/lib/auth";

/**
 * True when a user session token exists (after client mount). Server render is always false.
 */
export function useHasUserToken(): boolean {
  const [has, setHas] = useState(false);
  useEffect(() => {
    setHas(!!getUserToken());
  }, []);
  return has;
}
