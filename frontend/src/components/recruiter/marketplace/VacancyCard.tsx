import { useState } from "react";
import { Bookmark, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarketplaceVacancy } from "@/lib/mockMarketplace";

interface VacancyCardProps {
  vacancy: MarketplaceVacancy;
  watchlisted: boolean;
  onToggleWatchlist: (id: string) => void;
  onSubmitCandidate: (vacancy: MarketplaceVacancy) => void;
}

export function VacancyCard({ vacancy, watchlisted, onToggleWatchlist, onSubmitCandidate }: VacancyCardProps) {
  const [avatarSeed] = useState(() => Math.floor(Math.random() * 3) + 1);

  return (
    <div className="rounded-lg bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", vacancy.logoColor)}>
            <Building2 className="size-5 text-grey-600" />
          </span>
          <div>
            <p className="text-body-md font-semibold text-grey-950">{vacancy.title}</p>
            <p className="text-body-sm text-grey-500">
              {vacancy.company} · {vacancy.location} · {vacancy.employmentType} · {vacancy.experience}
            </p>
          </div>
        </div>
        <p className="shrink-0 text-body-md font-semibold text-grey-950">{vacancy.salaryRange}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {vacancy.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-orange-50 px-2 py-0.5 text-body-xs text-orange-700">
            {tag}
          </span>
        ))}
        {vacancy.extraTags > 0 && (
          <span className="rounded-md bg-grey-100 px-2 py-0.5 text-body-xs text-grey-600">+{vacancy.extraTags}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-body-xs text-grey-500">
          <span className="flex -space-x-1.5">
            {Array.from({ length: Math.min(2, avatarSeed) }).map((_, i) => (
              <span key={i} className="size-5 rounded-full border border-white bg-grey-200" />
            ))}
          </span>
          {vacancy.candidatesMatch} candidates match · {vacancy.postedAgo}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
            onClick={() => onToggleWatchlist(vacancy.id)}
            className={cn("text-grey-400 hover:text-orange-500", watchlisted && "text-orange-500")}
          >
            <Bookmark className={cn("size-4", watchlisted && "fill-orange-500")} />
          </button>
          <Button size="sm" variant="secondary" onClick={() => onSubmitCandidate(vacancy)}>
            Submit candidate
          </Button>
        </div>
      </div>
    </div>
  );
}
