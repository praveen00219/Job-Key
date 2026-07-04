import { useState } from "react";
import { Lock, Phone, Plus, Search, Send, UserPlus, Users, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "@/components/employer/ToggleSwitch";
import type { AccessMode, PipelineSettingsData } from "@/lib/vacancyWizard";
import { DualRangeSlider } from "./DualRangeSlider";
import { WizardFooter } from "./WizardFooter";

const STAGE_ICONS = [
  { label: "Sourced", icon: Search },
  { label: "Applied", icon: UserPlus },
  { label: "Phone screen", icon: Phone },
  { label: "Shortlist", icon: Users },
  { label: "Interview", icon: Users },
  { label: "Offer", icon: Send },
];

const BENEFIT_GROUPS: { category: string; items: string[] }[] = [
  { category: "Health", items: ["Health Insurance", "Mental Health Support"] },
  { category: "Financial", items: ["Pension Scheme", "Stock Options", "Life Insurance"] },
  { category: "Work-Life Balance", items: ["Flexible Hours"] },
  { category: "Development", items: ["Learning Budget"] },
];

const TEAM_MEMBERS = [
  { name: "Olivia Rhye", email: "olivia@company.com", role: "Admin", owner: true },
  { name: "John Smith", email: "john@acme.inc", role: "Hiring Manager", owner: false },
];

const ACCESS_MODES: { value: AccessMode; label: string; hint: string }[] = [
  { value: "Open Marketplace", label: "Open Marketplace", hint: "All verified recruiters" },
  { value: "Invite Only", label: "Invite Only", hint: "Hand-picked recruiters" },
  { value: "Tier Restricted", label: "Tier Restricted", hint: "Performance-based access" },
];

interface PipelineSettingsStepProps {
  data: PipelineSettingsData;
  onChange: (patch: Partial<PipelineSettingsData>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onContinue: () => void;
}

export function PipelineSettingsStep({ data, onChange, onBack, onSaveDraft, onContinue }: PipelineSettingsStepProps) {
  const [members, setMembers] = useState(TEAM_MEMBERS);

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Pipeline &amp; Settings</h1>
      <p className="mt-1 text-body-sm text-grey-600">Configure your hiring process and vacancy settings.</p>

      <div className="mt-6 space-y-6">
        <section className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Recruiting pipeline</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-body-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <Plus className="size-4" />
              Create new Pipeline
            </button>
          </div>
          <p className="mt-1 text-body-sm text-grey-500">
            To generate consistent reports, every stage in a pipeline is mapped to a stage of the reporting
            pipeline.
          </p>
          <select
            defaultValue={data.pipelineName}
            className="mt-3 h-11 w-full rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          >
            <option>Default</option>
          </select>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {STAGE_ICONS.map((stage) => (
              <div
                key={stage.label}
                className="flex flex-col items-center gap-2 rounded-md bg-brand-50 p-3 text-center"
              >
                <stage.icon className="size-5 text-brand-600" />
                <span className="text-body-xs text-grey-700">{stage.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Compensation</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Pay Type</Label>
              <select
                defaultValue={data.payType}
                className="h-11 w-full rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
              >
                <option>Annually</option>
                <option>Monthly</option>
                <option>Hourly</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <select
                defaultValue={data.currency}
                className="h-11 w-full rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
              >
                <option>USD ($)</option>
                <option>GBP (£)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Label>Annual Salary Range</Label>
            <DualRangeSlider
              min={0}
              max={300000}
              step={1000}
              from={data.salaryFrom}
              to={data.salaryTo}
              onChange={(salaryFrom, salaryTo) => onChange({ salaryFrom, salaryTo })}
            />
            <div className="flex items-center justify-between text-body-sm text-grey-700">
              <span>
                From <span className="ml-1 rounded bg-grey-100 px-2 py-1 font-medium">${data.salaryFrom.toLocaleString()}</span>
              </span>
              <span>
                To <span className="ml-1 rounded bg-grey-100 px-2 py-1 font-medium">${data.salaryTo.toLocaleString()}</span>
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.5">
            <ToggleSwitch checked={data.hideSalary} onCheckedChange={(hideSalary) => onChange({ hideSalary })} />
            <span className="text-body-sm text-grey-700">Hide salary from candidates</span>
          </div>
          <p className="mt-1 text-body-xs text-grey-500">Hidden salaries may reduce applications</p>
        </section>

        <section className="rounded-lg bg-white p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Vacancy Benefits</h2>
          <p className="mt-1 text-body-sm text-grey-500">
            Pulled from your company profile. Changes here only affect this vacancy.
          </p>
          <div className="mt-4 space-y-3">
            {BENEFIT_GROUPS.map((group) => (
              <div key={group.category}>
                <p className="text-body-sm font-medium text-grey-800">{group.category}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1 rounded-md bg-brand-50 px-2.5 py-1 text-body-sm text-brand-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-grey-200 py-2.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
          >
            <Plus className="size-4" />
            Add from company benefits
          </button>
        </section>

        <section className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Team Access</h2>
            <span className="text-body-sm text-grey-500">{members.length} members</span>
          </div>
          <p className="mt-1 text-body-sm text-grey-500">Only assigned members can view and manage this vacancy.</p>
          <div className="mt-3 rounded-md border-l-4 border-brand-500 bg-brand-50 p-3 text-body-sm text-grey-700">
            The account owner always has access and cannot be removed.
          </div>
          <ul className="mt-3 space-y-2">
            {members.map((m) => (
              <li key={m.email} className="flex items-center justify-between rounded-md bg-grey-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-brand-200 text-body-sm font-semibold text-brand-700">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-body-sm font-medium text-grey-900">{m.name}</p>
                    <p className="text-body-xs text-grey-500">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs font-medium text-brand-700">
                    {m.role}
                  </span>
                  {m.owner ? (
                    <Lock className="size-4 text-grey-400" />
                  ) : (
                    <button
                      type="button"
                      aria-label={`Remove ${m.name}`}
                      onClick={() => setMembers((prev) => prev.filter((x) => x.email !== m.email))}
                      className="text-grey-400 hover:text-danger-500"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 flex items-center gap-1.5 text-body-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="size-4" />
            Add team member
          </button>
        </section>

        <section className="rounded-lg bg-white p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Distribution</h2>
          <p className="mt-1 text-body-sm text-grey-500">
            Choose how recruiters discover and submit candidates for this vacancy.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-md bg-grey-50 p-3.5">
            <span className="text-body-sm font-medium text-grey-800">Market Place</span>
            <ToggleSwitch
              checked={data.marketplaceEnabled}
              onCheckedChange={(marketplaceEnabled) => onChange({ marketplaceEnabled })}
            />
          </div>

          {data.marketplaceEnabled && (
            <>
              <p className="mb-2 mt-4 text-body-sm font-medium text-grey-800">Access Mode</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ACCESS_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => onChange({ accessMode: mode.value })}
                    className={cn(
                      "rounded-md border p-3 text-left transition-colors",
                      data.accessMode === mode.value
                        ? "border-brand-500 bg-brand-50"
                        : "border-grey-200 hover:border-grey-300"
                    )}
                  >
                    <span className="block text-body-sm font-medium text-grey-900">{mode.label}</span>
                    <span className="block text-body-xs text-grey-500">{mode.hint}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 rounded-md border-l-4 border-brand-500 bg-brand-50 p-3 text-body-sm text-grey-700">
                All verified recruiters on JobKey can view and submit candidates for this vacancy.
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mt-6">
        <WizardFooter onBack={onBack} onSaveDraft={onSaveDraft} onContinue={onContinue} />
      </div>
    </div>
  );
}
