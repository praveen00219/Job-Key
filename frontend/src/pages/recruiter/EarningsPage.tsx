import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Banknote, CircleAlert, Landmark, Wallet } from "lucide-react";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { EarningsChart } from "@/components/recruiter/earnings/EarningsChart";
import { RequestPayoutModal } from "@/components/recruiter/earnings/RequestPayoutModal";
import { TierJourney } from "@/components/recruiter/TierJourney";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  earningsStats,
  earningsTransactions,
  extensionRequests as initialExtensionRequests,
  industryBreakdown,
  payoutMethods,
  placementStats,
  type EarningsTransaction,
} from "@/lib/mockEarnings";

const TABS = ["Overview", "Transactions", "Extension Requests"] as const;
type Tab = (typeof TABS)[number];

function TransactionIcon({ kind }: { kind: EarningsTransaction["kind"] }) {
  if (kind === "commission")
    return (
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success-50">
        <ArrowDownLeft className="size-4 text-success-600" />
      </span>
    );
  if (kind === "payout")
    return (
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50">
        <ArrowUpRight className="size-4 text-brand-600" />
      </span>
    );
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-warning-50">
      <CircleAlert className="size-4 text-warning-500" />
    </span>
  );
}

function TransactionList({ transactions, onResolveDelay }: { transactions: EarningsTransaction[]; onResolveDelay: (id: string) => void }) {
  return (
    <div className="divide-y divide-grey-100">
      {transactions.map((t) => (
        <div key={t.id} className="py-3.5 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <TransactionIcon kind={t.kind} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium text-grey-900">{t.title}</p>
              <p className="truncate text-body-xs text-grey-500">{t.subtitle}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className={cn("text-body-sm font-semibold", t.kind === "payout" ? "text-grey-900" : t.kind === "pending" ? "text-grey-700" : "text-success-600")}>
                {t.amount}
              </p>
              <p className="text-body-xs text-grey-400">{t.date}</p>
            </div>
          </div>
          {t.delay && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-md bg-grey-50 p-2.5 pl-12">
              <span className="text-body-xs text-grey-700">Reason: {t.delay.reason}</span>
              <span className="rounded bg-white px-2 py-0.5 text-body-xs text-grey-600">Current due: {t.delay.currentDue}</span>
              <span className="rounded bg-white px-2 py-0.5 text-body-xs text-orange-600">Requested: {t.delay.requestedDue}</span>
              <span className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => onResolveDelay(t.id)}
                  className="rounded-md border border-danger-300 px-3 py-1 text-body-xs font-medium text-danger-500 hover:bg-danger-50"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => onResolveDelay(t.id)}
                  className="rounded-md bg-success-600 px-3 py-1 text-body-xs font-medium text-white hover:bg-success-600/90"
                >
                  Accept
                </button>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function EarningsPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [showPayout, setShowPayout] = useState(false);
  const [transactions, setTransactions] = useState(earningsTransactions);
  const [extensionRequests, setExtensionRequests] = useState(initialExtensionRequests);

  const resolveDelay = (id: string) =>
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, kind: "commission" as const, delay: undefined, amount: t.amount.startsWith("+") ? t.amount : `+${t.amount}` } : t)));

  const resolveExtension = (id: string) => setExtensionRequests((prev) => prev.filter((r) => r.id !== id));

  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle
            title="Earnings"
            subtitle="Track, manage, and analyze your earnings in one place."
            actions={
              <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => setShowPayout(true)}>
                <Banknote className="size-4" />
                Request Payout
              </Button>
            }
          />
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-white/40">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-2.5 text-body-sm font-semibold transition-colors",
                  tab === t ? "border-grey-950 text-grey-950" : "border-transparent text-grey-600 hover:text-grey-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </RecruiterHero>
      }
    >
      {tab === "Overview" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {earningsStats.map((s) => (
              <div key={s.label} className="min-w-[180px] flex-1 rounded-lg bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <p className="text-heading-md font-semibold text-grey-950">{s.value}</p>
                  <span className="grid size-9 place-items-center rounded-lg bg-grey-50">
                    <Wallet className="size-4 text-grey-500" />
                  </span>
                </div>
                <p className="mt-1 text-body-sm font-medium text-grey-800">{s.label}</p>
                <p className={cn("text-body-xs", s.sublabelClass)}>{s.sublabel}</p>
              </div>
            ))}
          </div>

          <EarningsChart />

          <div className="rounded-lg bg-white p-5 shadow-xs">
            <h2 className="text-heading-sm font-semibold text-grey-950">By industry</h2>
            <div className="mt-4 space-y-4">
              {industryBreakdown.map((row) => (
                <div key={row.industry}>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-grey-800">{row.industry}</span>
                    <span className="text-grey-900">
                      {row.amount} <span className="text-grey-400">({row.pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-grey-100">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-grey-100 pt-5 sm:grid-cols-3">
              {placementStats.map((p) => (
                <div key={p.label} className="rounded-md border border-grey-200 p-4">
                  <p className="text-body-xs text-grey-500">{p.label}</p>
                  <p className="mt-1 text-heading-md font-semibold text-grey-950">{p.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-sm font-semibold text-grey-950">Recent transactions</h2>
              <button type="button" onClick={() => setTab("Transactions")} className="text-body-sm font-semibold text-orange-600 hover:text-orange-700">
                View All
              </button>
            </div>
            <div className="mt-4">
              <TransactionList transactions={transactions} onResolveDelay={resolveDelay} />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-heading-sm font-semibold text-grey-950">Payout methods</h2>
              <button type="button" className="text-body-sm font-semibold text-orange-600 hover:text-orange-700">
                Add Method
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {payoutMethods.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-md bg-grey-100">
                      <Landmark className="size-5 text-grey-600" />
                    </span>
                    <div>
                      <p className="text-body-sm font-semibold text-grey-950">{m.title}</p>
                      <p className="text-body-xs text-grey-500">{m.subtitle}</p>
                      <p className="text-body-xs text-grey-400">{m.added}</p>
                    </div>
                  </div>
                  {m.primary && (
                    <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-body-xs font-medium text-success-600">Primary</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <TierJourney />
        </div>
      )}

      {tab === "Transactions" && (
        <div className="rounded-lg bg-white p-5 shadow-xs">
          <h2 className="text-heading-sm font-semibold text-grey-950">All transactions</h2>
          <div className="mt-4">
            <TransactionList transactions={transactions} onResolveDelay={resolveDelay} />
          </div>
        </div>
      )}

      {tab === "Extension Requests" && (
        <div className="rounded-lg bg-white shadow-xs">
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <h2 className="text-heading-sm font-semibold text-grey-950">Extension Requests</h2>
              <p className="text-body-sm text-grey-500">Employers requesting more time to pay placement invoices</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-y border-grey-200 bg-grey-50 text-left">
                  {["Invoice #", "Vacancy", "Candidate", "Amount", "Current due", "Requested", "Reason", "Actions"].map((col) => (
                    <th key={col} className="px-4 py-2.5 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {extensionRequests.map((r) => (
                  <tr key={r.id} className="border-b border-grey-100 last:border-0">
                    <td className="px-4 py-3 text-body-sm font-medium text-grey-900">{r.invoice}</td>
                    <td className="px-4 py-3 text-body-sm text-grey-700">{r.vacancy}</td>
                    <td className="px-4 py-3 text-body-sm text-grey-700">{r.candidate}</td>
                    <td className="px-4 py-3 text-body-sm text-grey-700">{r.amount}</td>
                    <td className="px-4 py-3 text-body-sm text-grey-700">{r.currentDue}</td>
                    <td className="px-4 py-3 text-body-sm text-orange-600">{r.requestedDue}</td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-body-sm text-grey-500" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => resolveExtension(r.id)}
                          className="rounded-md border border-danger-300 px-3 py-1.5 text-body-xs font-medium text-danger-500 hover:bg-danger-50"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveExtension(r.id)}
                          className="rounded-md bg-success-600 px-3 py-1.5 text-body-xs font-medium text-white hover:bg-success-600/90"
                        >
                          Accept
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {extensionRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-body-sm text-grey-500">
                      No pending extension requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPayout && <RequestPayoutModal onClose={() => setShowPayout(false)} />}
    </RecruiterLayout>
  );
}
