import { ArrowRight, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RecruiterAuthLayout } from "@/components/recruiter/RecruiterAuthLayout";
import { ROUTES } from "@/lib/routes";

export default function GetStartedPage() {
  const navigate = useNavigate();

  return (
    <RecruiterAuthLayout>
      <div className="text-center">
        <h1 className="text-heading-xl font-semibold text-grey-900">Get started on JobKey</h1>
        <p className="mt-3 text-body-md text-grey-600">Trusted by 500+ recruiters and 200+ agencies</p>
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.recruiterSignup)}
          className="flex w-full items-center gap-4 rounded-lg bg-white p-5 text-left shadow-xs transition-shadow hover:shadow-sm"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-500">
            <User className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block text-body-md font-semibold text-grey-900">Sign up as Recruiter</span>
            <span className="block text-body-sm text-grey-500">Source candidates independently and earn commissions</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-grey-400" />
        </button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.agencySignup)}
          className="flex w-full items-center gap-4 rounded-lg bg-white p-5 text-left shadow-xs transition-shadow hover:shadow-sm"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-500">
            <Users className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block text-body-md font-semibold text-grey-900">Sign up as Recruiting Agency</span>
            <span className="block text-body-sm text-grey-500">Manage your team and scale placements together</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-grey-400" />
        </button>
      </div>
    </RecruiterAuthLayout>
  );
}
