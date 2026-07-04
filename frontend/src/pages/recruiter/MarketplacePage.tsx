import { useState } from "react";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { BrowseTab } from "@/components/recruiter/marketplace/BrowseTab";
import { WatchlistTab } from "@/components/recruiter/marketplace/WatchlistTab";
import { AlertsTab } from "@/components/recruiter/marketplace/AlertsTab";
import { SubmitCandidateModal } from "@/components/recruiter/marketplace/SubmitCandidateModal";
import { cn } from "@/lib/utils";
import type { MarketplaceVacancy } from "@/lib/mockMarketplace";

const TABS = [
  { id: "browse", label: "Browse" },
  { id: "watchlist", label: "Watchlist" },
  { id: "alerts", label: "Alerts" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function MarketplacePage() {
  const [tab, setTab] = useState<TabId>("browse");
  const [watchlist, setWatchlist] = useState<Set<string>>(
    new Set(["senior-software-engineer", "engineering-manager", "customer-success-lead", "lead-software-engineer"])
  );
  const [submitTarget, setSubmitTarget] = useState<MarketplaceVacancy | null>(null);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle title="Marketplace" subtitle="Browse and apply to premium recruitment opportunities" />
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-white/40">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-2.5 text-body-sm font-semibold transition-colors",
                  tab === t.id ? "border-grey-950 text-grey-950" : "border-transparent text-grey-600 hover:text-grey-900"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </RecruiterHero>
      }
    >
      {tab === "browse" && (
        <BrowseTab watchlist={watchlist} onToggleWatchlist={toggleWatchlist} onSubmitCandidate={setSubmitTarget} />
      )}
      {tab === "watchlist" && (
        <WatchlistTab
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onSubmitCandidate={setSubmitTarget}
          onBrowse={() => setTab("browse")}
        />
      )}
      {tab === "alerts" && <AlertsTab />}

      {submitTarget && <SubmitCandidateModal vacancy={submitTarget} onClose={() => setSubmitTarget(null)} />}
    </RecruiterLayout>
  );
}
