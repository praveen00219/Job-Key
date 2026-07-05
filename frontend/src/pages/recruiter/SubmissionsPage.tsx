import { useState } from "react";
import { Calendar, Eye, ListFilter, Search } from "lucide-react";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { cn } from "@/lib/utils";
import { submissionRows, type SubmissionTrackerStatus } from "@/lib/mockCrm";

const TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "placed", label: "Placed" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_STYLES: Record<SubmissionTrackerStatus, string> = {
  Interview: "bg-brand-50 text-brand-600",
  Pending: "bg-warning-50 text-warning-700",
  Rejected: "bg-grey-100 text-grey-500",
  Offer: "bg-success-50 text-success-600",
  Placed: "bg-success-50 text-success-600",
};

const ACTIVE_STATUSES: SubmissionTrackerStatus[] = ["Interview", "Pending", "Offer"];

export default function SubmissionsPage() {
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");

  const rows = submissionRows.filter((r) => {
    if (tab === "active" && !ACTIVE_STATUSES.includes(r.status)) return false;
    if (tab === "placed" && r.status !== "Placed") return false;
    return r.candidateName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle title="Submissions" subtitle="Track all candidate submissions and their progress" />
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
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-xs">
        <button type="button" className="flex items-center gap-1.5 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
          <ListFilter className="size-4" />
          Filters
        </button>
        <button type="button" className="flex items-center gap-1.5 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
          <Calendar className="size-4" />
          Date Range
        </button>
        <div className="relative min-w-[160px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
          />
        </div>
        <span className="ml-auto text-body-sm text-grey-500">Showing {rows.length} submissions</span>
      </div>

      <div className="mt-4 rounded-lg bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-grey-200 bg-grey-50 text-left">
                {["Name", "Vacancy", "Submitted", "Commission", "Potential", "Status", "Days in Stage", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-grey-100 last:border-0 hover:bg-grey-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700", r.avatarColor)}>
                        {r.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <span className="text-body-sm font-semibold text-grey-950">{r.candidateName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-body-sm font-medium text-grey-900">{r.vacancyTitle}</p>
                    <p className="text-body-xs text-grey-500">{r.vacancyCompany}</p>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-grey-700">{r.submittedDate}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-700">{r.commissionPct}%</td>
                  <td className="px-4 py-3 text-body-sm font-medium text-grey-900">{r.potential}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", STATUS_STYLES[r.status])}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-grey-700">{r.daysInStage} days</td>
                  <td className="px-4 py-3">
                    <button type="button" aria-label={`View submission for ${r.candidateName}`} className="grid size-7 place-items-center rounded text-grey-400 hover:bg-grey-100 hover:text-grey-700">
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 text-body-sm text-grey-600">
          <span className="flex items-center gap-2">
            Rows per page
            <select className="rounded-md border border-grey-200 px-2 py-1 text-body-sm">
              <option>20</option>
            </select>
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </RecruiterLayout>
  );
}
