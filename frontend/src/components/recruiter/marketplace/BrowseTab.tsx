import { useState } from "react";
import { ChevronDown, ListFilter, Search } from "lucide-react";

import { VacancyCard } from "./VacancyCard";
import { marketplaceVacancies, type MarketplaceVacancy } from "@/lib/mockMarketplace";

interface BrowseTabProps {
  watchlist: Set<string>;
  onToggleWatchlist: (id: string) => void;
  onSubmitCandidate: (vacancy: MarketplaceVacancy) => void;
}

export function BrowseTab({ watchlist, onToggleWatchlist, onSubmitCandidate }: BrowseTabProps) {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-xs">
        <div className="relative min-w-[160px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
          />
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
          <ListFilter className="size-4" />
          More Filters
        </button>
        {["Industry", "Job Type", "Location"].map((f) => (
          <button key={f} type="button" className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
            {f}
            <ChevronDown className="size-4" />
          </button>
        ))}
        <span className="ml-auto text-body-sm text-grey-500">Showing {marketplaceVacancies.length} jobs</span>
        <button type="button" className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
          Sort
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {marketplaceVacancies.map((v) => (
          <VacancyCard
            key={v.id}
            vacancy={v}
            watchlisted={watchlist.has(v.id)}
            onToggleWatchlist={onToggleWatchlist}
            onSubmitCandidate={onSubmitCandidate}
          />
        ))}
      </div>
    </div>
  );
}
