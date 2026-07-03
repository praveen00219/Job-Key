import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { vacancyPerformance, type SourceTag, type VacancyStatus } from "@/lib/mockDashboardData";

const STATUS_STYLES: Record<VacancyStatus, string> = {
  Active: "bg-success-50 text-success-600",
  Paused: "bg-grey-100 text-grey-600",
};

const SOURCE_STYLES: Record<SourceTag, string> = {
  Direct: "bg-brand-50 text-brand-600",
  Marketplace: "bg-pink-50 text-pink-300",
};

const PAGE_NUMBERS = [1, 2, 3, "…", 8, 9, 10] as const;

export function VacancyPerformanceTable() {
  const [page, setPage] = useState(1);

  return (
    <div className="rounded-lg bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <h2 className="text-heading-sm font-semibold text-grey-950">Vacancy Performance</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
          >
            All Statuses
          </button>
          <button
            type="button"
            className="rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
          >
            Last 30 days
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-grey-950 px-3 py-2 text-body-sm font-medium text-white hover:bg-grey-800"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-y border-grey-200 bg-grey-50 text-left">
              {["Vacancy", "Applications", "In Pipeline", "Conversion", "Avg. Time", "Top Source", ""].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-2.5 text-body-xs font-medium uppercase tracking-wide text-grey-500"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {vacancyPerformance.map((row) => (
              <tr key={row.id} className="border-b border-grey-100">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-semibold text-grey-950">{row.name}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-body-xs font-medium",
                        STATUS_STYLES[row.status]
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-body-sm text-grey-700">{row.applications}</td>
                <td className="px-4 py-4 text-body-sm text-grey-700">{row.inPipeline}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-9 text-body-sm text-grey-700">{row.conversionPct}%</span>
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-grey-100">
                      <span
                        className="block h-full rounded-full bg-success-500"
                        style={{ width: `${Math.max(row.conversionPct, 3)}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-body-sm text-grey-700">{row.avgTime}</td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-body-xs font-medium",
                      SOURCE_STYLES[row.topSource]
                    )}
                  >
                    {row.topSource}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button type="button" className="text-body-sm font-semibold text-brand-600 hover:text-brand-700">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-5">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 text-body-sm font-medium text-grey-700 hover:text-grey-900"
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {PAGE_NUMBERS.map((n, i) =>
            n === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-body-sm text-grey-400">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={cn(
                  "grid size-8 place-items-center rounded-md text-body-sm font-medium",
                  page === n ? "bg-brand-500 text-white" : "text-grey-700 hover:bg-grey-50"
                )}
              >
                {n}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center gap-1 text-body-sm font-medium text-grey-700 hover:text-grey-900"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
