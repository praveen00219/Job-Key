import { useState } from "react";

import { cn } from "@/lib/utils";
import { monthlyEarnings } from "@/lib/mockEarnings";

const RANGES = ["This Month", "Quarter", "Year", "All Time"] as const;
const MAX_K = 30;
const Y_TICKS = [30, 25, 20, 15, 10, 5, 0];

/**
 * "Earnings over time" bar chart. Single series — the card title names it, so
 * no legend (per dataviz guidance); per-bar hover tooltip matches the design.
 * The alternating light/dark orange bars are a JobKey brand treatment from the
 * source design, not an encoding.
 */
export function EarningsChart() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("This Month");
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="rounded-lg bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-heading-sm font-semibold text-grey-950">Earnings over time</h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-3 py-1.5 text-body-xs font-medium transition-colors",
                range === r ? "bg-orange-100 text-orange-700" : "text-grey-600 hover:text-grey-900"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <div className="flex flex-col justify-between pb-6 text-right text-body-xs text-grey-400">
          {Y_TICKS.map((t) => (
            <span key={t}>£{t}k</span>
          ))}
        </div>
        <div className="relative flex h-56 flex-1 items-end gap-[3%] border-b border-grey-100 pb-0">
          {monthlyEarnings.map((m, i) => (
            <div key={m.month} className="relative flex h-full flex-1 flex-col items-center justify-end">
              {hovered === i && (
                <div className="absolute -top-1 z-10 -translate-y-full whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-body-xs font-semibold text-grey-900 shadow-lg">
                  £{m.amountK}k <span className="font-normal text-grey-500">Earned</span>
                </div>
              )}
              <button
                type="button"
                aria-label={`${m.month}: £${m.amountK}k earned`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "w-full max-w-[36px] rounded-t-[4px] transition-opacity",
                  i % 2 === 0 ? "bg-orange-200" : "bg-orange-400",
                  hovered !== null && hovered !== i && "opacity-60"
                )}
                style={{ height: `${(m.amountK / MAX_K) * 100}%` }}
              />
              <span className="mt-2 text-body-xs text-grey-400">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
