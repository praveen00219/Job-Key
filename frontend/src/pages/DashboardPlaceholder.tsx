import { Link } from "react-router-dom";

import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

/**
 * Temporary landing spot for the authenticated happy path. The real employer
 * dashboard + company-profile onboarding are Phase 2 (see plan roadmap).
 */
export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 bg-grey-100 px-5 text-center">
      <JobKeyLogo />
      <div>
        <h1 className="text-heading-lg font-semibold text-grey-900">You&rsquo;re signed in 🎉</h1>
        <p className="mt-2 max-w-[46ch] text-body-md text-grey-600">
          {user ? `Welcome, ${user.email}. ` : ""}
          The employer dashboard and company-profile onboarding are coming in the next phase.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild size="md" variant="secondary">
          <Link to={ROUTES.login} onClick={logout}>
            Log out
          </Link>
        </Button>
      </div>
    </div>
  );
}
