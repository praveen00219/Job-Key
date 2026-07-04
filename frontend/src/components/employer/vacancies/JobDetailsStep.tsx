import { CircleHelp } from "lucide-react";

import { Label } from "@/components/ui/label";
import type { JobDetailsData } from "@/lib/vacancyWizard";
import { DualRangeSlider } from "./DualRangeSlider";
import { TagInput } from "./TagInput";
import { WizardFooter } from "./WizardFooter";

interface JobDetailsStepProps {
  data: JobDetailsData;
  onChange: (patch: Partial<JobDetailsData>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onContinue: () => void;
}

const MAX_LEN = 1000;

export function JobDetailsStep({ data, onChange, onBack, onSaveDraft, onContinue }: JobDetailsStepProps) {
  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Job Details</h1>
      <p className="mt-1 text-body-sm text-grey-600">Describe the role and what you&rsquo;re looking for.</p>

      <div className="mt-6 space-y-6 rounded-lg bg-white p-5">
        <div className="space-y-1.5">
          <Label htmlFor="description">
            Description <span className="text-danger-500">*</span>
          </Label>
          <textarea
            id="description"
            rows={4}
            maxLength={MAX_LEN}
            placeholder="Include key areas of responsibility and what the candidate might do on a typical day."
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          />
          <p className="text-right text-body-xs text-grey-400">
            {data.description.length}/{MAX_LEN}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="requirements">
            Requirements <span className="text-danger-500">*</span>
          </Label>
          <textarea
            id="requirements"
            rows={4}
            maxLength={MAX_LEN}
            placeholder="Soft skills to the specific qualifications needed to perform the role."
            value={data.requirements}
            onChange={(e) => onChange({ requirements: e.target.value })}
            className="w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          />
          <p className="text-right text-body-xs text-grey-400">
            {data.requirements.length}/{MAX_LEN}
          </p>
        </div>

        <div className="border-t border-grey-100 pt-6">
          <h2 className="text-heading-sm font-semibold text-grey-950">Experience &amp; Skills</h2>

          <div className="mt-4 space-y-2">
            <Label>Experience Required</Label>
            <DualRangeSlider
              min={0}
              max={15}
              from={data.experienceFrom}
              to={data.experienceTo}
              onChange={(experienceFrom, experienceTo) => onChange({ experienceFrom, experienceTo })}
            />
            <div className="flex items-center justify-between text-body-sm text-grey-700">
              <span>
                From <span className="ml-1 rounded bg-grey-100 px-2 py-1 font-medium">{data.experienceFrom} Yrs</span>
              </span>
              <span>
                To <span className="ml-1 rounded bg-grey-100 px-2 py-1 font-medium">{data.experienceTo} Yrs</span>
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label>
                Skills <span className="text-danger-500">*</span>
              </Label>
              <CircleHelp className="size-3.5 text-grey-400" />
            </div>
            <TagInput
              tags={data.skills}
              onChange={(skills) => onChange({ skills })}
              placeholder="Add a skill and press Enter"
            />
            {data.skills.length === 0 && (
              <p className="text-body-sm text-grey-500">Add at least one skill</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <WizardFooter onBack={onBack} onSaveDraft={onSaveDraft} onContinue={onContinue} />
      </div>
    </div>
  );
}
