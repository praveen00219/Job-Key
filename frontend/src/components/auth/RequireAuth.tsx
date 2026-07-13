import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth, type Role } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

/** Where each role lands after login / when visiting another role's area. */
export const ROLE_LANDING: Record<Role, string> = {
  employer: ROUTES.dashboard,
  recruiter: ROUTES.recruiterDashboard,
  candidate: ROUTES.candidateApplications,
  admin: ROUTES.dashboard, // real admin home arrives with module A9
};

interface RequireAuthProps {
  roles: Role[];
}

/**
 * Route-group guard (module A1, closes audit F3). Wrap a group of <Route>s:
 * unauthenticated visitors go to the group's login page; authenticated users
 * of a different role are sent to their own portal's landing page.
 */
export function RequireAuth({ roles }: RequireAuthProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-grey-100">
        <Loader2 className="size-7 animate-spin text-grey-400" />
      </div>
    );
  }

  if (!user) {
    const loginPath = roles.includes("candidate") ? ROUTES.candidateLogin : ROUTES.login;
    return <Navigate to={loginPath} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={ROLE_LANDING[user.role]} replace />;
  }

  return <Outlet />;
}
