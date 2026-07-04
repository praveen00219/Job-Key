import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnboardingStepper } from "@/components/recruiter/OnboardingStepper";
import { PersonalInfoStep } from "@/components/recruiter/onboarding/PersonalInfoStep";
import { ExperienceStep } from "@/components/recruiter/onboarding/ExperienceStep";
import { DocumentsStep } from "@/components/recruiter/onboarding/DocumentsStep";
import { RecruiterReviewStep } from "@/components/recruiter/onboarding/RecruiterReviewStep";
import { ROUTES } from "@/lib/routes";
import { initialRecruiterOnboarding, RECRUITER_STEPS, type RecruiterOnboardingState } from "@/lib/recruiterOnboarding";

export default function RecruiterOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<RecruiterOnboardingState>(initialRecruiterOnboarding);

  const goNext = () => setStep((s) => Math.min(s + 1, 3));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const handleCancel = () => navigate(ROUTES.recruiterGetStarted);
  const handleSubmit = () => navigate(ROUTES.recruiterUnderReview);

  return (
    <div className="min-h-dvh bg-grey-100">
      <OnboardingStepper
        eyebrow="Recruiter Application"
        steps={RECRUITER_STEPS}
        currentStep={step}
        onSaveExit={handleCancel}
      />

      <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8">
        {step === 0 && (
          <PersonalInfoStep
            data={state.personalInfo}
            onChange={(patch) => setState((s) => ({ ...s, personalInfo: { ...s.personalInfo, ...patch } }))}
            onCancel={handleCancel}
            onContinue={goNext}
          />
        )}
        {step === 1 && (
          <ExperienceStep
            data={state.experience}
            onChange={(patch) => setState((s) => ({ ...s, experience: { ...s.experience, ...patch } }))}
            onBack={goBack}
            onCancel={handleCancel}
            onContinue={goNext}
          />
        )}
        {step === 2 && (
          <DocumentsStep
            requirements={[
              { title: "Proof of Identity", description: "Passport, driving license, or national ID card", required: true },
            ]}
            onBack={goBack}
            onCancel={handleCancel}
            onContinue={goNext}
          />
        )}
        {step === 3 && (
          <RecruiterReviewStep state={state} onEditStep={setStep} onBack={goBack} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
