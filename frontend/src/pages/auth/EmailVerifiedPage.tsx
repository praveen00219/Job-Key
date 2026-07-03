import { useEffect } from "react";
import { CircleCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { ROUTES } from "@/lib/routes";

export default function EmailVerifiedPage() {
  const navigate = useNavigate();

  // Simulates the post-verification hand-off to company-profile setup (Phase 2).
  useEffect(() => {
    const t = setTimeout(() => navigate(ROUTES.dashboard), 3200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <FeaturedIcon icon={CircleCheck} tone="success" pulse className="mb-8" />
        <h1 className="text-heading-xl font-semibold text-grey-900">Email Verified!</h1>
        <p className="mt-3 text-body-md text-grey-600">Setting up your account&hellip;</p>

        <div className="mt-8 flex items-center gap-2 text-body-sm text-grey-500">
          <Loader2 className="size-4 animate-spin" />
          Redirecting you to the company profile setup&hellip;
        </div>
      </div>
    </AuthLayout>
  );
}
