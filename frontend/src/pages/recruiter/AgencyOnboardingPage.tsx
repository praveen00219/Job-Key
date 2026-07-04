import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OnboardingStepper } from "@/components/recruiter/OnboardingStepper";
import { AgencyDetailsStep } from "@/components/recruiter/onboarding/AgencyDetailsStep";
import { DocumentsStep } from "@/components/recruiter/onboarding/DocumentsStep";
import { AgencyReviewStep } from "@/components/recruiter/onboarding/AgencyReviewStep";
import { ROUTES } from "@/lib/routes";
import { initialAgencyOnboarding, AGENCY_STEPS, type AgencyOnboardingState } from "@/lib/recruiterOnboarding";

export default function AgencyOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<AgencyOnboardingState>(initialAgencyOnboarding);

  const goNext = () => setStep((s) => Math.min(s + 1, 2));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const handleCancel = () => navigate(ROUTES.recruiterGetStarted);
  const handleSubmit = () => navigate(ROUTES.recruiterUnderReview);

  return (
    <div className="min-h-dvh bg-grey-100">
      <OnboardingStepper eyebrow="Agency Application" steps={AGENCY_STEPS} currentStep={step} onSaveExit={handleCancel} />

      <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8">
        {step === 0 && (
          <AgencyDetailsStep
            data={state.agencyDetails}
            onChange={(patch) => setState((s) => ({ ...s, agencyDetails: { ...s.agencyDetails, ...patch } }))}
            onCancel={handleCancel}
            onContinue={goNext}
          />
        )}
        {step === 1 && (
          <DocumentsStep
            requirements={[
              { title: "Proof of Identity", description: "Passport, driving license, or national ID card", required: true },
              { title: "Company Registration Document", description: "Certificate of incorporation, Companies House document, or equivalent" },
              { title: "Professional Indemnity Insurance Certificate", description: "Recommended for all recruiters. Required for some employer partnerships." },
            ]}
            onBack={goBack}
            onCancel={handleCancel}
            onContinue={goNext}
          />
        )}
        {step === 2 && (
          <AgencyReviewStep state={state} onEditStep={setStep} onBack={goBack} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
