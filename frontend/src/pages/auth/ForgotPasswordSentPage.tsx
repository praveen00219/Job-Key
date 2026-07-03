import { AuthLayout } from "@/components/auth/AuthLayout";
import { NextStepsCard } from "@/components/auth/NextStepsCard";
import { BackLink } from "@/components/auth/BackLink";
import { useAuth } from "@/context/AuthContext";
import { useCountdown } from "@/hooks/useCountdown";
import { ROUTES } from "@/lib/routes";

export default function ForgotPasswordSentPage() {
  const { pendingEmail, requestPasswordReset } = useAuth();
  const { formatted, isFinished, restart } = useCountdown(59);

  const handleResend = async () => {
    if (!isFinished) return;
    restart(59);
    if (pendingEmail) await requestPasswordReset(pendingEmail);
  };

  return (
    <AuthLayout wide>
      <div className="text-center">
        <h1 className="text-heading-xl font-semibold text-grey-900">Check Your Email</h1>
        <p className="mx-auto mt-3 max-w-[42ch] text-body-md text-grey-600">
          If an account exists for that email, you&rsquo;ll receive a password reset link shortly.
        </p>
        <p className="mt-4 text-body-sm text-grey-500">The link expires in 1 hour</p>
        <p className="mt-3 text-body-md text-grey-700">
          Didn&rsquo;t receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!isFinished}
            className="font-semibold text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-brand-300"
          >
            Resend
          </button>{" "}
          <span className="text-grey-500">({formatted})</span>
        </p>
      </div>

      <div className="my-8 h-px w-full bg-grey-200" />

      <NextStepsCard
        title="Next Steps"
        steps={[
          { label: "Click the verification link in your email" },
          { label: "Complete your company profile" },
          { label: "Start posting vacancies" },
        ]}
      />

      <div className="my-8 h-px w-full bg-grey-200" />

      <div className="flex justify-center">
        <BackLink to={ROUTES.login}>Back to Sign In</BackLink>
      </div>
    </AuthLayout>
  );
}
