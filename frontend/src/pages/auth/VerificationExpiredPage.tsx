import { useState } from "react";
import { TriangleAlert, Send } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { BackLink } from "@/components/auth/BackLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function VerificationExpiredPage() {
  const { pendingEmail, resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await resendVerification();
    setResending(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <FeaturedIcon icon={TriangleAlert} tone="warning" className="mb-8" />
        <h1 className="text-heading-xl font-semibold text-grey-900">Verification Link Expired</h1>
        <p className="mt-3 max-w-[36ch] text-body-md text-grey-600">
          This link has expired or is invalid. Request a new verification email.
        </p>
      </div>

      <div className="mt-8 w-full">
        <div className="flex h-[52px] w-full items-center justify-center rounded-md bg-grey-200 px-4 text-body-md font-medium text-grey-700">
          {pendingEmail ?? "[email@company.com]"}
        </div>

        <Button type="button" className="mt-4 w-full" loading={resending} onClick={handleResend}>
          {!resending && <Send className="size-[18px]" />}
          {sent ? "Email Sent" : "Resend Email"}
        </Button>
      </div>

      <div className="mt-6 flex justify-center">
        <BackLink to={ROUTES.signup}>Back to Signup</BackLink>
      </div>
    </AuthLayout>
  );
}
