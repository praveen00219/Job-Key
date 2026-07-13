import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { NextStepsCard } from "@/components/auth/NextStepsCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pendingEmail, resendVerification, verifyEmail } = useAuth();
  const email = pendingEmail ?? "your email address";

  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);

  // Arriving via the emailed link (/verify-email?token=…): verify immediately.
  const token = searchParams.get("token");
  const verifyAttempted = useRef(false); // StrictMode double-invoke guard
  useEffect(() => {
    if (!token || verifyAttempted.current) return;
    verifyAttempted.current = true;
    verifyEmail(token).then((ok) =>
      navigate(ok ? ROUTES.verifyEmailSuccess : ROUTES.verifyEmailExpired, { replace: true })
    );
  }, [token, verifyEmail, navigate]);

  if (token) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Loader2 className="size-7 animate-spin text-brand-500" />
          <p className="text-body-md text-grey-600">Verifying your email…</p>
        </div>
      </AuthLayout>
    );
  }

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
