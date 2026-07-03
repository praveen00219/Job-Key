import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function PasswordUpdatedPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <FeaturedIcon icon={CircleCheck} tone="success" pulse className="mb-8" />
        <h1 className="text-heading-xl font-semibold text-grey-900">Password Updated</h1>
        <p className="mt-3 max-w-[42ch] text-body-md text-grey-600">
          Your password has been changed successfully. All other sessions have been logged out.
        </p>
      </div>

      <Button type="button" className="mt-8 w-full" onClick={() => navigate(ROUTES.login)}>
        Sign in
      </Button>

      <p className="mt-5 text-center text-body-md text-grey-600">
        Need help?{" "}
        <button type="button" className="text-grey-700 hover:text-brand-600">
          Contact Support
        </button>
      </p>
    </AuthLayout>
  );
}
