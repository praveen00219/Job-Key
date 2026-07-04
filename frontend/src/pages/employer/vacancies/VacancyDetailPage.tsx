import { useState } from "react";
import { ChevronDown, FileText, Hand, LayoutGrid, ListFilter, Search, Settings2 } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero } from "@/components/employer/EmployerHero";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/employer/vacancies/KanbanBoard";
import { ROUTES } from "@/lib/routes";
import { kanbanColumns, vacancyList } from "@/lib/mockVacancyData";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "pipeline", label: "Pipeline", icon: FileText },
  { id: "bids", label: "Bids", icon: Hand },
  { id: "settings", label: "Settings", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function VacancyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabId>("pipeline");

  const vacancy = vacancyList.find((v) => v.id === id);
  if (!vacancy) return <Navigate to={ROUTES.vacancies} replace />;

  const totalCandidates = kanbanColumns.reduce((sum, col) => sum + col.totalCount, 0);

  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-[26px] font-semibold text-grey-950 sm:text-[30px]">
              {vacancy.title}
            </h1>
            <Button size="md" className="w-full bg-grey-950 hover:bg-grey-800 sm:w-auto">
              Add Candidate
              <ChevronDown className="size-4" />
            </Button>
          </div>
          <div className="mt-5 flex gap-1 border-b border-white/40">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "border-grey-950 text-grey-950"
                    : "border-transparent text-grey-600 hover:text-grey-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </EmployerHero>
      }
    >
      {activeTab === "pipeline" ? (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
              >
                <ListFilter className="size-4" />
                Filters
              </button>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
                <input
                  placeholder="Search"
                  className="h-9 rounded-md border border-grey-200 py-2 pl-9 pr-3 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-body-sm text-grey-500">Showing {totalCandidates} Candidates</span>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
              >
                View
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
              >
                Sort
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className="rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50"
              >
                Bulk Move
              </button>
            </div>
          </div>

          <div className="mt-4">
            <KanbanBoard initialColumns={kanbanColumns} />
          </div>
        </div>
      ) : (
        <ComingSoonCard
          icon={TABS.find((t) => t.id === activeTab)!.icon}
          title={`${TABS.find((t) => t.id === activeTab)!.label} coming soon`}
          description="This tab will be built out in a later phase."
        />
      )}
    </EmployerLayout>
  );
}
