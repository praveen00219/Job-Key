import { useState } from "react";
import { Calendar, ChevronDown, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { offerRows, offersStats, type OfferStatus } from "@/lib/mockOffers";

const TABS = [
  { id: "overview", label: "Overview", status: null },
  { id: "pending", label: "Pending (7)", status: "Pending" as OfferStatus },
  { id: "accepted", label: "Accepted", status: "Accepted" as OfferStatus },
  { id: "rejected", label: "Rejected", status: "Rejected" as OfferStatus },
  { id: "expired", label: "Expired", status: "Expired" as OfferStatus },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_STYLES: Record<OfferStatus, string> = {
  Pending: "bg-warning-50 text-warning-700",
  Accepted: "bg-success-50 text-success-600",
  Rejected: "bg-danger-50 text-danger-600",
  Expired: "bg-grey-100 text-grey-600",
  Withdrawn: "bg-grey-100 text-grey-500",
};

const SOURCE_STYLES: Record<string, string> = {
  Direct: "bg-brand-50 text-brand-600",
  Marketplace: "bg-pink-50 text-pink-300",
};

export default function OffersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("overview");

  const activeTab = TABS.find((t) => t.id === tab)!;
  const rows = activeTab.status ? offerRows.filter((r) => r.status === activeTab.status) : offerRows;
  const stats = offersStats[tab];
  const resolvedLabel = activeTab.status ?? "Resolved";

  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <PageBannerTitle
            title="Offers"
            actions={
              <Button size="md" className="bg-grey-950 hover:bg-grey-800">
                <Download className="size-4" />
                Export CSV
              </Button>
            }
          />
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
        </EmployerHero>
      }
    >
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-16 text-center">
          <h2 className="text-heading-sm font-semibold text-grey-950">No offers yet</h2>
          <p className="max-w-[46ch] text-body-sm text-grey-500">
            Create offers from candidate profiles once they reach the Interview stage in your pipeline.
          </p>
          <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => navigate("/vacancies")}>
            Go to Pipeline
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex-1 rounded-lg bg-white p-4 shadow-xs">
                <p className="text-heading-md font-semibold text-grey-950">
                  {s.value}
                  {"suffix" in s && s.suffix && (
                    <span className="ml-1 text-body-sm font-normal text-grey-500">{s.suffix}</span>
                  )}
                </p>
                <p className="mt-1 text-body-xs text-grey-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-xs">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
              <input
                placeholder="Search"
                className="h-9 w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
            >
              All Vacancies
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
            >
              <Calendar className="size-4" />
              Date Range
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
            >
              Sort by: Newest
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-grey-200 bg-grey-50 text-left">
                    {[
                      "Candidate",
                      "Vacancy",
                      "Salary Offered",
                      ...(tab === "overview" ? ["Status"] : []),
                      "Created",
                      resolvedLabel,
                      "Days Open",
                      "Actions",
                    ].map((col) => (
                      <th key={col} className="px-4 py-3 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-grey-100 last:border-0">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700",
                              row.avatarColor
                            )}
                          >
                            {row.candidateName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                          <span className="text-body-sm font-medium text-grey-900">{row.candidateName}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", SOURCE_STYLES[row.source])}>
                            {row.source}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-body-sm text-grey-700">{row.vacancy}</td>
                      <td className="px-4 py-3.5 text-body-sm text-grey-700">{row.salary}</td>
                      {tab === "overview" && (
                        <td className="px-4 py-3.5">
                          <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", STATUS_STYLES[row.status])}>
                            {row.status}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3.5 text-body-sm text-grey-700">{row.createdDate}</td>
                      <td className="px-4 py-3.5 text-body-sm text-grey-700">{row.resolvedDate}</td>
                      <td className="px-4 py-3.5 text-body-sm text-grey-700">{row.daysOpen}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/offers/${row.id}`)}
                          className="rounded-md border border-grey-200 px-3 py-1.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
                        >
                          Review
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
                  <option>4</option>
                  <option>10</option>
                  <option>25</option>
                </select>
              </span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </>
      )}
    </EmployerLayout>
  );
}
