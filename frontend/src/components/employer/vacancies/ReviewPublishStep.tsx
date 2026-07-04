import { CircleAlert, Pencil } from "lucide-react";

import { PIPELINE_STAGE_LABELS, type VacancyWizardState } from "@/lib/vacancyWizard";
import { WizardFooter } from "./WizardFooter";

interface ReviewPublishStepProps {
  state: VacancyWizardState;
  onEditStep: (stepIndex: number) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-body-sm font-semibold text-brand-600 hover:text-brand-700"
    >
      <Pencil className="size-3.5" />
      Edit
    </button>
  );
}

function SummaryCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-grey-950">{title}</h2>
        <EditLink onClick={onEdit} />
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ReviewPublishStep({ state, onEditStep, onBack, onSaveDraft, onPublish }: ReviewPublishStepProps) {
  const issues: string[] = [];
  if (!state.roleBasics.jobTitle) issues.push("Role Basics: Job title is missing");
  if (state.roleBasics.locations.length === 0) issues.push("Role Basics: At least one location is required");
  if (!state.jobDetails.description) issues.push("Job Details: Description is missing");
  if (!state.jobDetails.requirements) issues.push("Job Details: Requirements are missing");
  if (state.jobDetails.skills.length === 0) issues.push("Job Details: At least one skill is required");

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Review &amp; Publish</h1>
      <p className="mt-1 text-body-sm text-grey-600">Check all details before publishing your vacancy.</p>

      {issues.length > 0 && (
        <div className="mt-6 rounded-md border-l-4 border-danger-500 bg-danger-50 p-4">
          <p className="flex items-center gap-2 text-body-sm font-medium text-danger-600">
            <CircleAlert className="size-4" />
            Complete all required fields to publish
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-body-sm text-danger-600">
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 space-y-6">
        <SummaryCard title="Role Summary" onEdit={() => onEditStep(0)}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-body-sm sm:grid-cols-2">
            <div>
              <p className="text-grey-500">Job Title</p>
              <p className="text-grey-900">{state.roleBasics.jobTitle || "—"}</p>
            </div>
            <div>
              <p className="text-grey-500">Department</p>
              <p className="text-grey-900">{state.roleBasics.department || "—"}</p>
            </div>
            <div>
              <p className="text-grey-500">Employment type</p>
              <p className="text-grey-900">{state.roleBasics.employmentType}</p>
            </div>
            <div>
              <p className="text-grey-500">Location</p>
              <p className="text-grey-900">{state.roleBasics.locations.join(", ") || "—"}</p>
            </div>
            <div>
              <p className="text-grey-500">Workplace</p>
              <p className="text-grey-900">{state.roleBasics.workplace}</p>
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title="Job Details" onEdit={() => onEditStep(1)}>
          <div className="space-y-3 text-body-sm">
            <div>
              <p className="text-grey-500">Overview</p>
              <p className="line-clamp-2 text-grey-900">{state.jobDetails.description || "—"}</p>
            </div>
            <div>
              <p className="text-grey-500">Requirements</p>
              <p className="line-clamp-2 text-grey-900">{state.jobDetails.requirements || "—"}</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <p className="text-grey-500">Experience</p>
                <p className="text-grey-900">
                  {state.jobDetails.experienceFrom}–{state.jobDetails.experienceTo} Yrs
                </p>
              </div>
              <div>
                <p className="text-grey-500">Skills</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {state.jobDetails.skills.length > 0 ? (
                    state.jobDetails.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs text-brand-700">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-grey-900">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SummaryCard>

        <SummaryCard title="Recruiting pipeline" onEdit={() => onEditStep(2)}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {PIPELINE_STAGE_LABELS.map((label) => (
              <div key={label} className="rounded-md bg-grey-50 p-2.5 text-center">
                <span className="text-body-xs text-grey-700">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-body-xs text-grey-500">{PIPELINE_STAGE_LABELS.length} stages</p>
        </SummaryCard>

        <SummaryCard title="Screening Questions" onEdit={() => onEditStep(3)}>
          {state.screeningQuestions.length > 0 ? (
            <ul className="space-y-2 text-body-sm">
              {state.screeningQuestions.map((q) => (
                <li key={q.id} className="flex items-center justify-between">
                  <span className="text-grey-900">{q.text}</span>
                  <span className="shrink-0 text-body-xs text-grey-500">
                    {q.type}
                    {q.knockout ? " · Knockout" : q.required ? " · Required" : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-grey-500">No screening questions added.</p>
          )}
        </SummaryCard>

        <SummaryCard title="Distribution &amp; Compensation" onEdit={() => onEditStep(2)}>
          <div className="flex items-center justify-between text-body-sm">
            <p className="text-grey-900">
              ${state.pipelineSettings.salaryFrom.toLocaleString()} — $
              {state.pipelineSettings.salaryTo.toLocaleString()} {state.pipelineSettings.payType}
            </p>
            <span className={state.pipelineSettings.hideSalary ? "text-grey-500" : "text-success-600"}>
              {state.pipelineSettings.hideSalary ? "Hidden from candidates" : "Visible to candidates"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-md bg-grey-50 p-3 text-body-sm">
            <span className="text-grey-700">Marketplace</span>
            <span className="font-medium text-grey-900">
              {state.pipelineSettings.marketplaceEnabled ? state.pipelineSettings.accessMode : "Disabled"}
            </span>
          </div>
        </SummaryCard>
      </div>

      <div className="mt-6">
        <WizardFooter onBack={onBack} onSaveDraft={onSaveDraft} onContinue={onPublish} continueLabel="Publish Vacancy" />
      </div>
    </div>
  );
}
