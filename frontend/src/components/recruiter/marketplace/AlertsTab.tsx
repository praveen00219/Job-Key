import { useState } from "react";
import { Pencil, Plus, TrendingUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/employer/ToggleSwitch";
import { CreateAlertModal } from "./CreateAlertModal";
import { alertMatches, vacancyAlerts as initialAlerts } from "@/lib/mockMarketplace";

export function AlertsTab() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showCreate, setShowCreate] = useState(false);

  const toggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const removeAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const createAlert = (name: string) => {
    setAlerts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, tags: [], delivery: "Immediate", matchesThisWeek: 0, active: true },
    ]);
    setShowCreate(false);
  };

  return (
    <div>
      <div className="rounded-lg bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-sm font-semibold text-grey-950">Vacancy Alerts</h2>
            <p className="text-body-sm text-grey-500">Get notified for matching vacancies</p>
          </div>
          <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            Create Alert
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-4 rounded-md border border-grey-200 p-4">
              <ToggleSwitch checked={alert.active} onCheckedChange={() => toggleAlert(alert.id)} />
              <div className="flex-1">
                <p className="text-body-md font-semibold text-grey-950">{alert.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {alert.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-grey-100 px-2 py-0.5 text-body-xs text-grey-600">
                      {tag}
                    </span>
                  ))}
                  <span className="rounded-md bg-orange-50 px-2 py-0.5 text-body-xs font-medium text-orange-700">
                    Delivery: {alert.delivery}
                  </span>
                </div>
                {alert.matchesThisWeek > 0 && (
                  <p className="mt-1.5 flex items-center gap-1 text-body-xs font-medium text-success-600">
                    <TrendingUp className="size-3.5" />
                    {alert.matchesThisWeek} matches this week
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1 text-grey-400">
                <button type="button" aria-label="Edit alert" className="hover:text-grey-700">
                  <Pencil className="size-4" />
                </button>
                <button type="button" aria-label="Delete alert" onClick={() => removeAlert(alert.id)} className="hover:text-danger-500">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-5 shadow-xs">
        <h2 className="text-heading-sm font-semibold text-grey-950">Latest Matches</h2>
        <p className="text-body-sm text-grey-500">Vacancies that match your alert criteria</p>
        <div className="mt-4 space-y-3">
          {alertMatches.map((match) => (
            <div key={match.id} className="rounded-md border border-grey-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-orange-50 px-2 py-0.5 text-body-xs font-medium text-orange-700">{match.alertName}</span>
                  <span className="text-body-xs text-grey-400">{match.postedAgo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs text-brand-600">{match.workplace}</span>
                  <span className="rounded-full bg-grey-100 px-2 py-0.5 text-body-xs text-grey-600">{match.employmentType}</span>
                </div>
              </div>
              <p className="mt-2 text-body-md font-semibold text-grey-950">{match.title}</p>
              <p className="text-body-sm text-grey-500">{match.company}</p>
              <p className="mt-1 text-body-sm text-grey-700">
                {match.salary} <span className="text-grey-400">·</span> Commission: {match.commission}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showCreate && <CreateAlertModal onClose={() => setShowCreate(false)} onCreate={createAlert} />}
    </div>
  );
}
