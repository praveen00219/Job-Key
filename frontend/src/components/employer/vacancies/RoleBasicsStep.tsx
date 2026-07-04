import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EmploymentType, RoleBasicsData, Workplace } from "@/lib/vacancyWizard";
import { TagInput } from "./TagInput";
import { WizardFooter } from "./WizardFooter";

const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];

const WORKPLACE_OPTIONS: { value: Workplace; label: string; hint: string }[] = [
  { value: "On-site", label: "On-site", hint: "Work exclusively from the office" },
  { value: "Hybrid", label: "Hybrid", hint: "Work from both office and home" },
  { value: "Remote", label: "Remote", hint: "Work exclusively from home" },
];

interface RoleBasicsStepProps {
  data: RoleBasicsData;
  onChange: (patch: Partial<RoleBasicsData>) => void;
  onSaveDraft: () => void;
  onContinue: () => void;
}

export function RoleBasicsStep({ data, onChange, onSaveDraft, onContinue }: RoleBasicsStepProps) {
  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Role Basics</h1>
      <p className="mt-1 text-body-sm text-grey-600">Define the fundamental details of this position.</p>

      <div className="mt-6 space-y-6 rounded-lg bg-white p-5">
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">
            Job Title <span className="text-danger-500">*</span>
          </Label>
          <Input
            id="jobTitle"
            placeholder="e.g., Senior Product Designer"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="Select an industry"
            value={data.department}
            onChange={(e) => onChange({ department: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Employment Type</Label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ employmentType: type })}
                className={cn(
                  "rounded-md px-3.5 py-2 text-body-sm font-medium transition-colors",
                  data.employmentType === type
                    ? "bg-brand-500 text-white"
                    : "bg-grey-100 text-grey-700 hover:bg-grey-200"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>
            Location <span className="text-danger-500">*</span>
          </Label>
          <TagInput
            tags={data.locations}
            onChange={(locations) => onChange({ locations })}
            placeholder="Add a location and press Enter"
          />
          {data.locations.length === 0 && (
            <p className="text-body-sm text-grey-500">At least one location is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Workplace <span className="text-danger-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {WORKPLACE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ workplace: opt.value })}
                className={cn(
                  "flex items-start gap-2.5 rounded-md border p-3.5 text-left transition-colors",
                  data.workplace === opt.value
                    ? "border-brand-500 bg-brand-50"
                    : "border-grey-200 hover:border-grey-300"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2",
                    data.workplace === opt.value ? "border-brand-500" : "border-grey-300"
                  )}
                >
                  {data.workplace === opt.value && <span className="size-2 rounded-full bg-brand-500" />}
                </span>
                <span>
                  <span className="block text-body-sm font-medium text-grey-900">{opt.label}</span>
                  <span className="block text-body-xs text-grey-500">{opt.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="employeeLocation">Employee location</Label>
          <Input
            id="employeeLocation"
            placeholder="Country or State"
            value={data.employeeLocation}
            onChange={(e) => onChange({ employeeLocation: e.target.value })}
          />
          <p className="text-body-sm text-grey-500">
            Write a country, state or city where you&rsquo;d like to advertise this job.
          </p>
        </div>

        <div>
          <p className="mb-1.5 text-body-sm font-medium text-grey-800">Additional office locations</p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-body-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="size-4" />
            Add Location
          </button>
        </div>
      </div>

      <div className="mt-6">
        <WizardFooter showBack={false} onSaveDraft={onSaveDraft} onContinue={onContinue} />
      </div>
    </div>
  );
}
