import { Crown, Hexagon, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { TIERS, recruiterTierProgress } from "@/lib/mockTiers";

const TIER_ICONS = [Hexagon, Sparkles, ShieldCheck, Crown];

export function TierJourney() {
  const { currentTierIndex, placements, nextTierPlacements, placementsToGo } = recruiterTierProgress;
  const current = TIERS[currentTierIndex];
  const progressPct = Math.min(100, (placements / nextTierPlacements) * 100);

  return (
    <div className="rounded-lg bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-grey-950">Your Tier Journey</h2>
        <p className="text-body-xs text-grey-500">Track your progress to higher commission rates</p>
      </div>

      <div className="mt-4 rounded-md bg-orange-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-md font-semibold text-grey-950">{current.name}</p>
            <p className="text-body-xs text-grey-500">Current tier · {current.commissionPct}% commission</p>
          </div>
          <div className="text-right">
            <p className="text-body-xs text-grey-500">Next milestone</p>
            <p className="text-body-sm font-medium text-orange-600">{placementsToGo} placements to go</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-orange-100">
          <div className="h-full rounded-full bg-orange-500" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-body-xs text-grey-500">
          <span>{placements} placements</span>
          <span>
            {nextTierPlacements} placements ({TIERS[currentTierIndex + 1]?.name ?? "Max tier"})
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIERS.map((tier, i) => {
          const Icon = TIER_ICONS[i];
          const isCurrent = i === currentTierIndex;
          return (
            <div
              key={tier.name}
              className={cn(
                "rounded-md border p-3 text-center",
                isCurrent ? "border-orange-400 bg-orange-50" : "border-grey-200"
              )}
            >
              <Icon className={cn("mx-auto size-5", isCurrent ? "text-orange-500" : "text-grey-400")} />
              <p className="mt-1.5 text-body-sm font-semibold text-grey-900">{tier.name}</p>
              <div className="mt-2 space-y-0.5 text-body-xs text-grey-500">
                <p>Commission {tier.commissionPct}%</p>
                <p>Platform Fee {tier.platformFeePct}%</p>
                <p>Support {tier.support}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
