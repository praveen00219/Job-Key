import { useState } from "react";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { NextStepsCard } from "@/components/auth/NextStepsCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { pendingEmail, resendVerification } = useAuth();
  const email = pendingEmail ?? "sara.c@innovateinc.com";

  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    setSent(false);
    await resendVerification();
    setResending(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-heading-xl font-semibold text-grey-900">Check Your Email</h1>
        <p className="mt-3 text-body-md text-grey-600">We&rsquo;ve sent a verification link to</p>
        <p className="mt-1 text-body-md font-semibold text-grey-900">{email}</p>
        <p className="mt-4 text-body-md text-grey-600">
          Please click the link in the email to verify your account.
        </p>
      </div>

      {/* "Need help?" divider */}
      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-grey-200" />
        <span className="text-body-sm text-grey-500">Need help?</span>
        <span className="h-px flex-1 bg-grey-200" />
      </div>

      <p className="text-center text-body-md text-grey-600">
        Didn&rsquo;t receive it? Check your spam folder.
      </p>

      <Button
        type="button"
        className="mt-6 w-full"
        loading={resending}
        onClick={handleResend}
      >
        {!resending && <Send className="size-[18px]" />}
        {sent ? "Email Sent" : "Resend Email"}
      </Button>

      <p className="mt-4 text-center text-body-md text-grey-600">
        Wrong email?{" "}
        <button
          type="button"
          onClick={() => navigate(ROUTES.signup)}
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Change email address
        </button>
      </p>

      <NextStepsCard
        className="mt-8"
        variant="inline"
        title="What happens next"
        steps={[
          { label: "Click the verification link in your email" },
          { label: "Complete your company profile", muted: true },
          { label: "Start posting vacancies", muted: true },
        ]}
      />
    </AuthLayout>
  );
}
