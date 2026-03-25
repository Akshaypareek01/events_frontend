import type { ReactNode } from "react";

/** Teacher routes inherit root layout; `/teacher/login` uses `LoginSplitLayout` (same shell as `/login`). */
export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
