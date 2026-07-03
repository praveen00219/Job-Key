import { useState } from "react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ToggleSwitch } from "@/components/employer/ToggleSwitch";
import { cn } from "@/lib/utils";

interface NotificationRow {
  category: string;
  label: string;
  email: boolean;
  inApp: boolean;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  { category: "Application & Submission", label: "New Application", email: true, inApp: false },
  { category: "Application & Submission", label: "New recruiter submission", email: true, inApp: false },
  { category: "Application & Submission", label: "New direct application", email: true, inApp: false },
  { category: "Pipeline Activity", label: "Candidate stage changes", email: true, inApp: false },
  { category: "Pipeline Activity", label: "Offer accepted/rejected", email: false, inApp: false },
  { category: "Billing", label: "Invoice generated", email: false, inApp: false },
  { category: "Billing", label: "Payments reminder", email: false, inApp: false },
  { category: "Team Activity", label: "Team member actions", email: false, inApp: false },
];

export default function NotificationsSettingsPage() {
  const [frequency, setFrequency] = useState<"immediate" | "digest">("immediate");
  const [rows, setRows] = useState(NOTIFICATION_ROWS);

  const toggle = (index: number, field: "email" | "inApp") => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: !row[field] } : row))
    );
  };

  let lastCategory = "";

  return (
    <SettingsPageShell title="Notifications Preferences" subtitle="Choose how you want to be notified">
      <div className="rounded-lg bg-white p-5">
        <h2 className="text-heading-sm font-semibold text-grey-950">Email Delivery</h2>
        <div className="mt-4 space-y-1.5">
          <p className="text-body-sm text-grey-700">Send notifications to</p>
          <div className="rounded-md bg-grey-100 px-3 py-2.5">
            <p className="text-body-md text-grey-500">employer@company.com</p>
          </div>
        </div>
        <div className="mt-5 space-y-1">
          <p className="text-body-md font-medium text-grey-900">Additional recipients</p>
          <p className="text-body-sm text-grey-500">team@company.com, manager@company.com</p>
          <p className="text-body-sm text-grey-700">
            Useful for keeping your team informed. Separate email with comma.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5">
        <h2 className="text-heading-sm font-semibold text-grey-950">Delivery timing</h2>
        <p className="mt-4 text-body-sm text-grey-700">Email frequency</p>
        <div className="mt-3 flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-start gap-2">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                frequency === "immediate" ? "border-brand-500 bg-brand-500" : "border-grey-200 bg-white"
              )}
              onClick={() => setFrequency("immediate")}
            >
              {frequency === "immediate" && <span className="size-2 rounded-full bg-white" />}
            </span>
            <span className="text-body-sm">
              <span className="font-medium text-grey-700">Immediate</span>{" "}
              <span className="text-grey-500">- Send as events happen</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                frequency === "digest" ? "border-brand-500 bg-brand-500" : "border-grey-200 bg-white"
              )}
              onClick={() => setFrequency("digest")}
            >
              {frequency === "digest" && <span className="size-2 rounded-full bg-white" />}
            </span>
            <span className="text-body-sm">
              <span className="font-medium text-grey-700">Daily digest</span>{" "}
              <span className="text-grey-500">- Summary email once per day</span>
            </span>
          </label>
        </div>
        <div className="mt-4 rounded-md bg-brand-100 p-3">
          <p className="text-body-sm text-grey-950">
            <span className="font-medium">Note:</span> Critical notifications (invoices, payments) are
            always sent immediately.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5">
        <h2 className="text-heading-sm font-semibold text-grey-950">Notifications types</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-grey-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-grey-100 text-left">
                <th className="px-6 py-3 text-body-xs font-medium text-grey-600">Type</th>
                <th className="w-28 px-6 py-3 text-center text-body-xs font-medium text-grey-600">In Email</th>
                <th className="w-28 px-6 py-3 text-center text-body-xs font-medium text-grey-600">In App</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const showCategory = row.category !== lastCategory;
                lastCategory = row.category;
                return (
                  <tr key={row.label} className="border-t border-grey-200">
                    <td className="px-6 py-4">
                      {showCategory && (
                        <p className="mb-1 text-body-md font-semibold text-grey-950">{row.category}</p>
                      )}
                      <p className="text-body-md text-grey-500">{row.label}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <ToggleSwitch checked={row.email} onCheckedChange={() => toggle(i, "email")} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <ToggleSwitch checked={row.inApp} onCheckedChange={() => toggle(i, "inApp")} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SettingsPageShell>
  );
}
