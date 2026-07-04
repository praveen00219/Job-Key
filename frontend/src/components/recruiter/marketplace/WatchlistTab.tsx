import { useState } from "react";
import { Bookmark, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VacancyCard } from "./VacancyCard";
import {
  marketplaceVacancies,
  watchlistRows,
  type MarketplaceVacancy,
  type WatchlistFilter,
} from "@/lib/mockMarketplace";

const SUB_TABS: { id: WatchlistFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "not-submitted", label: "Not submitted" },
  { id: "submitted", label: "Submitted" },
];

interface WatchlistTabProps {
  watchlist: Set<string>;
  onToggleWatchlist: (id: string) => void;
  onSubmitCandidate: (vacancy: MarketplaceVacancy) => void;
  onBrowse: () => void;
}

export function WatchlistTab({ watchlist, onToggleWatchlist, onSubmitCandidate, onBrowse }: WatchlistTabProps) {
  const [subTab, setSubTab] = useState<WatchlistFilter>("all");

  const rows = watchlistRows.filter((r) => watchlist.has(r.vacancyId));
  const filteredRows = subTab === "all" ? rows : rows.filter((r) => (subTab === "submitted" ? r.mySubmissions > 0 : r.mySubmissions === 0));

  return (
    <div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-12 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-orange-100 text-orange-500">
            <Bookmark className="size-5" />
          </span>
          <h2 className="text-heading-sm font-semibold text-grey-950">Watchlist Empty</h2>
          <p className="max-w-[42ch] text-body-sm text-grey-500">
            Save vacancies you&rsquo;re interested in to keep track of opportunities and submit candidates when
            you&rsquo;re ready.
          </p>
          <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={onBrowse}>
            Browse Vacancies
          </Button>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-5 shadow-xs">
          <div className="flex gap-1 border-b border-grey-100">
            {SUB_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={cn(
                  "border-b-2 px-3 py-2 text-body-sm font-semibold transition-colors",
                  subTab === t.id ? "border-orange-500 text-grey-950" : "border-transparent text-grey-500 hover:text-grey-800"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="text-left">
                  {["Vacancy", "Company", "Location", "Salary", "Posted", "My Submissions", "Actions"].map((col) => (
                    <th key={col} className="px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-grey-100">
                    <td className="px-3 py-3">
                      <span className="text-body-sm font-medium text-grey-900">{row.title}</span>{" "}
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs text-brand-600">{row.workplace}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn("grid size-6 place-items-center rounded-full", row.logoColor)}>
                          <Building2 className="size-3.5 text-grey-600" />
                        </span>
                        <span className="text-body-sm text-grey-700">{row.company}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-body-sm text-grey-700">{row.location}</td>
                    <td className="px-3 py-3 text-body-sm text-grey-700">{row.salary}</td>
                    <td className="px-3 py-3 text-body-sm text-grey-500">{row.postedAgo}</td>
                    <td className="px-3 py-3 text-body-sm text-grey-700">{row.mySubmissions} submitted</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const vacancy = marketplaceVacancies.find((v) => v.id === row.vacancyId);
                            if (vacancy) onSubmitCandidate(vacancy);
                          }}
                          className="rounded-md border border-grey-200 px-3 py-1.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
                        >
                          Submit
                        </button>
                        <button type="button" className="rounded-md border border-grey-200 px-3 py-1.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50">
                          View
                        </button>
                        <button
                          type="button"
                          aria-label="Remove from watchlist"
                          onClick={() => onToggleWatchlist(row.vacancyId)}
                          className="text-orange-500 hover:text-orange-600"
                        >
                          <Bookmark className="size-4 fill-orange-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-sm font-semibold text-grey-950">Featured Opportunities</h2>
            <p className="text-body-sm text-grey-500">Premium vacancies with enhanced commission rates</p>
          </div>
          <button type="button" className="text-body-sm font-semibold text-orange-600 hover:text-orange-700">
            View All
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
    </div>
  );
}
