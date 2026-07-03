import { Plus } from "lucide-react";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero } from "@/components/employer/EmployerHero";
import { StatCard } from "@/components/employer/StatCard";
import { AttentionAlert } from "@/components/employer/AttentionAlert";
import { PipelineFunnel } from "@/components/employer/PipelineFunnel";
import { ActivityFeed } from "@/components/employer/ActivityFeed";
import { VacancyPerformanceTable } from "@/components/employer/VacancyPerformanceTable";
import { Button } from "@/components/ui/button";
import { statCards, attentionItems } from "@/lib/mockDashboardData";

const today = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

export default function DashboardPage() {
  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-[26px] font-semibold leading-[1.27] text-grey-950 sm:text-[30px]">
                Good morning, Sarah
              </h1>
              <p className="mt-1 text-body-md text-grey-950">{today}</p>
            </div>
            <Button size="md" className="w-full bg-grey-950 hover:bg-grey-800 sm:w-auto">
              <Plus className="size-[18px]" />
              Create Vacancy
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {statCards.map((card) => (
              <StatCard key={card.id} {...card} />
            ))}
          </div>
        </EmployerHero>
      }
    >
      <section className="rounded-lg bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-heading-sm font-semibold text-grey-950">Needs Your Attention</h2>
        <div className="flex flex-wrap gap-4">
          {attentionItems.map((item) => (
            <AttentionAlert key={item.id} {...item} />
          ))}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Pipeline Overview (All Vacancy)</h2>
            <button type="button" className="text-body-sm font-medium text-grey-600 hover:text-grey-900">
              All Vacancies
            </button>
          </div>
          <div className="mt-5">
            <PipelineFunnel />
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Recent Activity</h2>
            <button type="button" className="text-body-sm font-medium text-brand-600 hover:text-brand-700">
              View All
            </button>
          </div>
          <div className="mt-3">
            <ActivityFeed />
          </div>
        </section>
      </div>

      <div className="mt-6">
        <VacancyPerformanceTable />
      </div>
    </EmployerLayout>
  );
}
