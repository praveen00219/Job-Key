import { cn } from "@/lib/utils";
import type { StatCardData } from "@/lib/mockDashboardData";

export function StatCard({ icon: Icon, iconBg, iconColor, value, label, sublabel, sublabelClass }: StatCardData) {
  return (
    <div className="flex-1 rounded-lg bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between">
        <span className="text-heading-lg font-semibold text-grey-950">{value}</span>
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", iconBg)}>
          <Icon className={cn("size-5", iconColor)} />
        </span>
      </div>
      <p className="mt-3 text-body-sm font-medium text-grey-800">{label}</p>
      <p className={cn("mt-0.5 text-body-xs", sublabelClass ?? "text-grey-500")}>{sublabel}</p>
    </div>
  );
}
