import { Star, Trash2 } from "lucide-react";

import { reviewEntries } from "@/lib/mockCandidateDetail";

export function ReviewTab() {
  return (
    <div className="rounded-lg bg-white p-5">
      <div className="divide-y divide-grey-100">
        {reviewEntries.map((review) => (
          <div key={review.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500">
              <Star className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-body-sm font-semibold text-grey-950">{review.reviewerName}</p>
                  <p className="text-body-xs text-grey-500">{review.stageTag}</p>
                </div>
                <span className="shrink-0 text-body-xs text-grey-400">{review.timestamp}</span>
              </div>
              <p className="mt-1.5 text-body-sm text-grey-700">{review.body}</p>
            </div>
            <button type="button" aria-label="Delete review" className="shrink-0 text-grey-300 hover:text-danger-500">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
