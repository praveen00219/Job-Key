import { ChevronDown, Reply } from "lucide-react";

import { commentEntries } from "@/lib/mockCandidateDetail";

export function CommentsTab() {
  return (
    <div className="rounded-lg bg-white p-5">
      <div className="divide-y divide-grey-100">
        {commentEntries.map((c) => (
          <div key={c.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
            <span className={`grid size-8 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700 ${c.avatarColor}`}>
              {c.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1 text-body-sm font-semibold text-grey-950">
                  {c.authorName}
                  <span className="flex items-center gap-0.5 text-body-xs font-normal text-grey-400">
                    · {c.visibility}
                    <ChevronDown className="size-3" />
                  </span>
                </p>
                <span className="shrink-0 text-body-xs text-grey-400">{c.timestamp}</span>
              </div>
              <p className="mt-1 text-body-sm text-grey-700">{c.body}</p>
            </div>
            <button type="button" aria-label="Reply" className="shrink-0 text-grey-300 hover:text-grey-600">
              <Reply className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
