import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/employer/vacancies/TagInput";
import { FileUploadBox } from "@/components/recruiter/FileUploadBox";
import { OnboardingFooter } from "@/components/recruiter/OnboardingFooter";
import type { RecruiterOnboardingState, ReferenceEntry } from "@/lib/recruiterOnboarding";

interface SelectFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

function SelectField({ label, placeholder, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
      </div>
    </div>
  );
}

interface ExperienceStepProps {
  data: RecruiterOnboardingState["experience"];
  onChange: (patch: Partial<RecruiterOnboardingState["experience"]>) => void;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function ExperienceStep({ data, onChange, onBack, onCancel, onContinue }: ExperienceStepProps) {
  const [draft, setDraft] = useState({ name: "", company: "", email: "", relationship: "" });

  const addReference = () => {
    if (!draft.name.trim() || data.references.length >= 3) return;
    const entry: ReferenceEntry = { id: crypto.randomUUID(), ...draft };
    onChange({ references: [...data.references, entry] });
    setDraft({ name: "", company: "", email: "", relationship: "" });
  };

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Your Recruitment Experience</h1>
      <p className="mt-1 text-body-sm text-grey-600">
        Tell us about your expertise so we can match you with the right opportunities.
      </p>

      <div className="mt-6 space-y-4 rounded-lg bg-white p-5">
        <SelectField
          label="Experience Level"
          placeholder="Select your experience level"
          value={data.experienceLevel}
          onChange={(experienceLevel) => onChange({ experienceLevel })}
          options={["0-2 years", "3-5 years", "6-10 years", "10+ years"]}
        />
        <div className="space-y-1.5">
          <Label>Specializations</Label>
          <TagInput
            tags={data.specializations}
            onChange={(specializations) => onChange({ specializations })}
            placeholder="Select the industries"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Role Types You Recruit</Label>
          <TagInput
            tags={data.roleTypes}
            onChange={(roleTypes) => onChange({ roleTypes })}
            placeholder="Select the roles"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Geographic Focus</Label>
          <TagInput
            tags={data.geographicFocus}
            onChange={(geographicFocus) => onChange({ geographicFocus })}
            placeholder="Select the regions"
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-5">
        <h2 className="text-heading-sm font-semibold text-grey-950">Professional References</h2>
        <p className="mt-1 text-body-sm text-grey-500">Add up to 3 references to strengthen your application</p>

        {data.references.length > 0 && (
          <ul className="mt-4 space-y-2">
            {data.references.map((ref) => (
              <li key={ref.id} className="rounded-md bg-grey-50 p-3 text-body-sm">
                <span className="font-medium text-grey-900">{ref.name}</span>{" "}
                <span className="text-grey-500">
                  · {ref.company} · {ref.relationship}
                </span>
              </li>
            ))}
          </ul>
        )}

        {data.references.length < 3 && (
          <div className="mt-4 space-y-4">
            <FileUploadBox label="Profile Picture (Optional)" hint="PNG, JPG, SVG up to 2MB" compact />
            <div className="space-y-1.5">
              <Label htmlFor="refName">Name</Label>
              <Input
                id="refName"
                placeholder="Reference full name"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="refCompany">Company</Label>
              <Input
                id="refCompany"
                placeholder="Company name"
                value={draft.company}
                onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="refEmail">Email</Label>
              <Input
                id="refEmail"
                type="email"
                placeholder="reference@company.com"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              />
            </div>
            <SelectField
              label="Relationship"
              placeholder="Select relationship"
              value={draft.relationship}
              onChange={(relationship) => setDraft((d) => ({ ...d, relationship }))}
              options={["Former Manager", "Former Colleague", "Client", "Project Manager"]}
            />
            <div className="flex justify-between">
              <Button type="button" variant="secondary" size="md" onClick={() => setDraft({ name: "", company: "", email: "", relationship: "" })}>
                Cancel
              </Button>
              <Button type="button" size="md" className="bg-grey-950 hover:bg-grey-800" onClick={addReference}>
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <OnboardingFooter onBack={onBack} onCancel={onCancel} onContinue={onContinue} />
      </div>
    </div>
  );
}
