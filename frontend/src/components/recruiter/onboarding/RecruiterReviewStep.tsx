import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { RecruiterOnboardingState } from "@/lib/recruiterOnboarding";

interface RecruiterReviewStepProps {
  state: RecruiterOnboardingState;
  onEditStep: (step: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1 text-body-sm font-semibold text-orange-600 hover:text-orange-700">
      <Pencil className="size-3.5" />
      Edit
    </button>
  );
}

export function RecruiterReviewStep({ state, onEditStep, onBack, onSubmit }: RecruiterReviewStepProps) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedCode, setAgreedCode] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canSubmit = agreedTerms && agreedCode && confirmed;

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Review Your Application</h1>
      <p className="mt-1 text-body-sm text-grey-600">
        Please review your information before submitting. You can edit any section by clicking the edit button.
      </p>

      <div className="mt-6 space-y-6">
        <section className="rounded-lg bg-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-orange-100 text-body-md font-semibold text-orange-600">
                {state.personalInfo.fullName
                  ? state.personalInfo.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "?"}
              </span>
              <div>
                <p className="text-body-md font-semibold text-grey-950">{state.personalInfo.fullName || "—"}</p>
                <p className="text-body-sm text-grey-500">Recruiter</p>
              </div>
            </div>
            <EditLink onClick={() => onEditStep(0)} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-body-sm sm:grid-cols-2">
            <p>
              <span className="text-grey-500">LinkedIn: </span>
              <span className="text-grey-900">{state.personalInfo.linkedinUrl || "—"}</span>
            </p>
            <p>
              <span className="text-grey-500">Phone: </span>
              <span className="text-grey-900">{state.personalInfo.phone || "—"}</span>
            </p>
            <p>
              <span className="text-grey-500">Website: </span>
              <span className="text-grey-900">{state.personalInfo.websiteUrl || "—"}</span>
            </p>
            <p>
              <span className="text-grey-500">Languages: </span>
              <span className="text-grey-900">{state.personalInfo.languages.join(", ") || "—"}</span>
            </p>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Bio</h2>
            <EditLink onClick={() => onEditStep(0)} />
          </div>
          <p className="mt-2 text-body-sm text-grey-700">{state.personalInfo.bio || "—"}</p>
        </section>

        <section className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Professional Experience</h2>
            <EditLink onClick={() => onEditStep(1)} />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 text-body-sm sm:grid-cols-2">
            <div>
              <p className="text-grey-500">Experience</p>
              <p className="text-grey-900">{state.experience.experienceLevel || "—"}</p>
            </div>
            <div>
              <p className="text-grey-500">Specializations</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {state.experience.specializations.length > 0 ? (
                  state.experience.specializations.map((s) => (
                    <span key={s} className="rounded-full bg-orange-50 px-2 py-0.5 text-body-xs text-orange-700">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-grey-900">—</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">References</h2>
            <EditLink onClick={() => onEditStep(1)} />
          </div>
          {state.experience.references.length > 0 ? (
            <div className="mt-3 space-y-2">
              {state.experience.references.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between rounded-md bg-grey-50 p-3 text-body-sm">
                  <span className="font-medium text-grey-900">{ref.name}</span>
                  <span className="text-grey-500">{ref.company}</span>
                  <span className="text-grey-500">{ref.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-body-sm text-grey-500">No references added.</p>
          )}
        </section>

        <section className="rounded-lg bg-white p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Terms &amp; Agreements</h2>
          <div className="mt-3 space-y-3">
            <label className="flex items-start gap-2.5">
              <Checkbox checked={agreedTerms} onCheckedChange={(v) => setAgreedTerms(v === true)} />
              <span className="text-body-sm text-grey-700">
                I agree to JobKey&rsquo;s Terms of Service and Privacy Policy
              </span>
            </label>
            <label className="flex items-start gap-2.5">
              <Checkbox checked={agreedCode} onCheckedChange={(v) => setAgreedCode(v === true)} />
              <span className="text-body-sm text-grey-700">
                I agree to the Recruiter Code of Conduct and Marketplace Guidelines
              </span>
            </label>
            <label className="flex items-start gap-2.5">
              <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
              <span className="text-body-sm text-grey-700">
                I confirm that all information provided in this application is accurate and complete to the best of my knowledge
              </span>
            </label>
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-grey-100 pt-5">
        <button type="button" onClick={onBack} className="text-body-sm font-medium text-grey-700 hover:text-grey-900">
          ← Back
        </button>
        <Button
          type="button"
          size="md"
          className="bg-grey-950 hover:bg-grey-800"
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}
