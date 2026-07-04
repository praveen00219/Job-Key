import { ChevronDown, Reply, Trash2 } from "lucide-react";

import { timelineEntries } from "@/lib/mockCandidateDetail";

export function TimelineTab() {
  return (
    <div className="rounded-lg bg-white p-5">
      <div className="divide-y divide-grey-100">
        {timelineEntries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
            <span className={`grid size-9 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700 ${entry.avatarColor}`}>
              {entry.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-body-sm">
                  <span className="font-semibold text-grey-950">{entry.authorName}</span>{" "}
                  <span className="text-grey-600">{entry.action}</span>
                  {entry.visibility && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-body-xs text-grey-400">
                      · {entry.visibility}
                      <ChevronDown className="size-3" />
                    </span>
                  )}
                </p>
                <span className="shrink-0 text-body-xs text-grey-400">{entry.timestamp}</span>
              </div>
              {entry.body && (
                <p className="mt-1.5 whitespace-pre-line rounded-md bg-grey-50 p-3 text-body-sm text-grey-700">
                  {entry.body}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1 text-grey-300">
              <button type="button" aria-label="Reply" className="hover:text-grey-600">
                <Reply className="size-3.5" />
              </button>
              <button type="button" aria-label="Delete" className="hover:text-danger-500">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
