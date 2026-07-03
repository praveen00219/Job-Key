import { useState } from "react";
import { TriangleAlert, Send } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { BackLink } from "@/components/auth/BackLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

export default function AccountLockedPage() {
  const { resendVerification } = useAuth();
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
        <h1 className="text-heading-xl font-semibold text-grey-900">Account Temporarily Locked</h1>
        <p className="mt-3 max-w-[40ch] text-body-md text-grey-600">
          Too many failed login attempts. Please try again in 30 minutes or reset your password.
        </p>
      </div>

      <Button type="button" className="mt-8 w-full" loading={resending} onClick={handleResend}>
        {!resending && <Send className="size-[18px]" />}
        {sent ? "Email Sent" : "Resend Email"}
      </Button>

      <div className="mt-6 flex justify-center">
        <BackLink to={ROUTES.login}>Back to Sign In</BackLink>
      </div>
    </AuthLayout>
  );
}
