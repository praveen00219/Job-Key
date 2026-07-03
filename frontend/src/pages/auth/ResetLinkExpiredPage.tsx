import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { BackLink } from "@/components/auth/BackLink";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function ResetLinkExpiredPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <FeaturedIcon icon={TriangleAlert} tone="warning" className="mb-8" />
        <h1 className="text-heading-xl font-semibold text-grey-900">Reset Link Expired</h1>
        <p className="mt-3 max-w-[38ch] text-body-md text-grey-600">
          This link has expired. Password reset links are valid for 1 hour.
        </p>
      </div>

      <Button
        type="button"
        className="mt-8 w-full"
        onClick={() => navigate(ROUTES.forgotPassword)}
      >
        Request New Link
      </Button>

      <div className="mt-6 flex justify-center">
        <BackLink to={ROUTES.signup}>Back to Signup</BackLink>
      </div>
    </AuthLayout>
  );
}
