import { RecruiterSignupForm } from "@/components/recruiter/RecruiterSignupForm";
import { ROUTES } from "@/lib/routes";

export default function RecruiterSignupPage() {
  return (
    <RecruiterSignupForm
      title="Create Your Recruiter Account"
      subtitle="Source candidates and earn commissions on JobKey."
      onSuccessRoute={ROUTES.recruiterOnboarding}
    />
  );
}
