import { cn } from "@/lib/cn";

export type DashboardAlertColor = "info" | "success" | "warning" | "danger";

export function DashboardAlert(props: { message: string; color: DashboardAlertColor; className?: string }) {
  const base =
    "rounded-2xl border px-4 py-3 text-sm shadow-sm sm:px-5 sm:py-4 whitespace-pre-wrap break-words";
  const styles: Record<DashboardAlertColor, string> = {
    info: "border-[#F7C5AC] bg-[#FFF3EB] text-[#1C1208]",
    success: "border-[#B7E2C2] bg-[#ECFFF2] text-[#12331D]",
    warning: "border-[#F2D18B] bg-[#FFF7E6] text-[#2A1D06]",
    danger: "border-[#F3B6B6] bg-[#FFF0F0] text-[#3B0B0B]",
  };

  return <div className={cn(base, styles[props.color], props.className)}>{props.message}</div>;
}

