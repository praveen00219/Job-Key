import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AttentionItem } from "@/lib/mockDashboardData";

export function AttentionAlert({ icon: Icon, borderClass, iconClass, text, linkText, linkClass }: AttentionItem) {
  return (
    <div className={cn("flex flex-1 items-center gap-3 border-l-4 bg-grey-50 py-3 pl-4 pr-3", borderClass)}>
      <Icon className={cn("size-5 shrink-0", iconClass)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm text-grey-800">{text}</p>
        <button type="button" className={cn("text-body-sm font-semibold hover:underline", linkClass)}>
          {linkText}
        </button>
      </div>
      <button type="button" aria-label="Dismiss" className="shrink-0 text-grey-400 hover:text-grey-600">
        <X className="size-4" />
      </button>
    </div>
  );
}
