import { RecruiterSignupForm } from "@/components/recruiter/RecruiterSignupForm";
import { ROUTES } from "@/lib/routes";

export default function AgencySignupPage() {
  return (
    <RecruiterSignupForm
      title="Create Your Agency Account"
      subtitle="Manage your recruiting team on JobKey."
      onSuccessRoute={ROUTES.agencyOnboarding}
    />
  );
}
