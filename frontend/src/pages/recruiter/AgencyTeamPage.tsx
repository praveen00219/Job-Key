import { useState } from "react";
import { BarChart3, DollarSign, LayoutGrid, Plus, Users } from "lucide-react";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { agencyTeamMembers, pendingInvitations, teamPerformanceStats, topPerformers } from "@/lib/mockAgencyTeam";
import { agencyFinancialStats, teamEarningsBreakdown } from "@/lib/mockEarnings";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "team", label: "Team Management", icon: Users },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "financials", label: "Financials", icon: DollarSign },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AgencyTeamPage() {
  const [tab, setTab] = useState<TabId>("team");

  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle title="Agency" subtitle="Track, manage, and analyze your earnings in one place." />
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
      {tab === "team" ? (
        <div className="space-y-6">
          <section className="rounded-lg bg-white p-5">
            <h2 className="text-heading-sm font-semibold text-grey-950">Team Performance Overview</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {teamPerformanceStats.map((s) => (
                <div key={s.label} className="flex-1 rounded-md bg-grey-50 p-4">
                  <p className="text-heading-md font-semibold text-grey-950">
                    {s.value}
                    {"suffix" in s && s.suffix && <span className="ml-1 text-body-sm font-normal text-grey-500">{s.suffix}</span>}
                  </p>
                  <p className="mt-1 text-body-xs text-grey-500">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-white p-5">
            <h2 className="text-heading-sm font-semibold text-grey-950">Top Performers This Month</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-grey-200 text-left">
                    {["Rank", "Member", "Role", "Placements", "Revenue", "Growth"].map((col) => (
                      <th key={col} className="px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((p) => (
                    <tr key={p.rank} className="border-b border-grey-100 last:border-0">
                      <td className="px-3 py-3">
                        <span className="grid size-6 place-items-center rounded-full bg-orange-100 text-body-xs font-semibold text-orange-700">
                          {p.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-body-sm font-medium text-grey-900">{p.name}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{p.role}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{p.placements}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{p.revenue}</td>
                      <td className="px-3 py-3 text-body-sm font-medium text-success-600">+{p.growthPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-sm font-semibold text-grey-950">Team members</h2>
              <Button size="sm" className="bg-grey-950 hover:bg-grey-800">
                <Plus className="size-4" />
                Invite Team Member
              </Button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-grey-200 text-left">
                    {["Name", "Current Role", "Email", "Placements", "Earned"].map((col) => (
                      <th key={col} className="px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agencyTeamMembers.map((m) => (
                    <tr key={m.id} className="border-b border-grey-100 last:border-0">
                      <td className="px-3 py-3 text-body-sm font-medium text-grey-900">{m.name}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{m.role}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{m.email}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{m.placements}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{m.earned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg bg-white p-5">
            <h2 className="text-heading-sm font-semibold text-grey-950">Pending Invitations</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-grey-200 text-left">
                    {["Name", "Current Role", "Email", "Sent", "Actions"].map((col) => (
                      <th key={col} className="px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingInvitations.map((inv) => (
                    <tr key={inv.id} className="border-b border-grey-100 last:border-0">
                      <td className="px-3 py-3 text-body-sm font-medium text-grey-900">{inv.name}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{inv.role}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{inv.email}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-500">{inv.sentAgo}</td>
                      <td className="px-3 py-3">
                        <button type="button" className="mr-3 text-body-sm font-medium text-orange-600 hover:text-orange-700">
                          Resend
                        </button>
                        <button type="button" className="text-body-sm font-medium text-danger-500 hover:text-danger-600">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : tab === "financials" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Financials</h2>
            <Button variant="secondary" size="sm">
              Commission Settings
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            {agencyFinancialStats.map((s) => (
              <div key={s.label} className="min-w-[180px] flex-1 rounded-lg bg-white p-4 shadow-xs">
                <p className="text-heading-md font-semibold text-grey-950">{s.value}</p>
                <p className="mt-1 text-body-xs text-grey-500">{s.label}</p>
              </div>
            ))}
          </div>
          <section className="rounded-lg bg-white p-5 shadow-xs">
            <h3 className="text-body-md font-semibold text-grey-950">Team Earnings Breakdown</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-grey-200 text-left">
                    {["Member", "Role", "Placements", "Gross Revenue", "Commission Rate", "Earnings"].map((col) => (
                      <th key={col} className="px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamEarningsBreakdown.map((row) => (
                    <tr key={row.id} className="border-b border-grey-100 last:border-0">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700", row.avatarColor)}>
                            {row.member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                          <span className="text-body-sm font-medium text-grey-900">{row.member}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{row.role}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{String(row.placements).padStart(2, "0")}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{row.grossRevenue}</td>
                      <td className="px-3 py-3 text-body-sm text-grey-700">{row.commissionRate}</td>
                      <td className="px-3 py-3 text-body-sm font-medium text-grey-900">{row.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <ComingSoonCard
          icon={TABS.find((t) => t.id === tab)!.icon}
          title={`${TABS.find((t) => t.id === tab)!.label} coming soon`}
          description="This section will be built out in a later phase."
          tone="orange"
        />
      )}
    </RecruiterLayout>
  );
}
