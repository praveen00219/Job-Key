export interface TierInfo {
  name: string;
  minPlacements: number;
  commissionPct: number;
  platformFeePct: number;
  support: string;
}

export const TIERS: TierInfo[] = [
  { name: "Worker Bee", minPlacements: 0, commissionPct: 80, platformFeePct: 20, support: "Standard" },
  { name: "Honey Maker", minPlacements: 11, commissionPct: 80, platformFeePct: 20, support: "Priority" },
  { name: "Queen's Guard", minPlacements: 51, commissionPct: 82, platformFeePct: 18, support: "VIP" },
  { name: "Hive Legend", minPlacements: 150, commissionPct: 85, platformFeePct: 15, support: "Elite" },
];

// Reconciles a design inconsistency: one Figma instance labels the next
// milestone "50 placements (Honey Maker)", another shows "7/11 to Honey
// Maker" — the ROADMAP's documented tier thresholds (Honey Maker at 11
// placements) match the latter, so mock progress follows that.
export const recruiterTierProgress = {
  currentTierIndex: 0, // Worker Bee
  placements: 7,
  nextTierPlacements: 11,
  placementsToGo: 4,
};
