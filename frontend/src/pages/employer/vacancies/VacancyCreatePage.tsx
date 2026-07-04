import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero } from "@/components/employer/EmployerHero";
import { VacancyStepper } from "@/components/employer/vacancies/VacancyStepper";
import { RoleBasicsStep } from "@/components/employer/vacancies/RoleBasicsStep";
import { JobDetailsStep } from "@/components/employer/vacancies/JobDetailsStep";
import { PipelineSettingsStep } from "@/components/employer/vacancies/PipelineSettingsStep";
import { ScreeningQuestionsStep } from "@/components/employer/vacancies/ScreeningQuestionsStep";
import { ReviewPublishStep } from "@/components/employer/vacancies/ReviewPublishStep";
import { ROUTES } from "@/lib/routes";
import { initialWizardState, type VacancyWizardState } from "@/lib/vacancyWizard";

export default function VacancyCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<VacancyWizardState>(initialWizardState);

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const saveDraft = () => navigate(ROUTES.vacancies);
  const publish = () => navigate(ROUTES.vacancies);

  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <VacancyStepper currentStep={step} />
        </EmployerHero>
      }
    >
      <div className="mx-auto max-w-[832px]">
        {step === 0 && (
          <RoleBasicsStep
            data={state.roleBasics}
            onChange={(patch) => setState((s) => ({ ...s, roleBasics: { ...s.roleBasics, ...patch } }))}
            onSaveDraft={saveDraft}
            onContinue={goNext}
          />
        )}
        {step === 1 && (
          <JobDetailsStep
            data={state.jobDetails}
            onChange={(patch) => setState((s) => ({ ...s, jobDetails: { ...s.jobDetails, ...patch } }))}
            onBack={goBack}
            onSaveDraft={saveDraft}
            onContinue={goNext}
          />
        )}
        {step === 2 && (
          <PipelineSettingsStep
            data={state.pipelineSettings}
            onChange={(patch) =>
              setState((s) => ({ ...s, pipelineSettings: { ...s.pipelineSettings, ...patch } }))
            }
            onBack={goBack}
            onSaveDraft={saveDraft}
            onContinue={goNext}
          />
        )}
        {step === 3 && (
          <ScreeningQuestionsStep
            questions={state.screeningQuestions}
            onChange={(screeningQuestions) => setState((s) => ({ ...s, screeningQuestions }))}
            onBack={goBack}
            onSaveDraft={saveDraft}
            onContinue={goNext}
          />
        )}
        {step === 4 && (
          <ReviewPublishStep
            state={state}
            onEditStep={setStep}
            onBack={goBack}
            onSaveDraft={saveDraft}
            onPublish={publish}
          />
        )}
      </div>
    </EmployerLayout>
  );
}
