import { CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RecruiterAuthLayout } from "@/components/recruiter/RecruiterAuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function ApplicationUnsuccessfulPage() {
  const navigate = useNavigate();

  return (
    <RecruiterAuthLayout>
      <div className="flex flex-col items-center text-center">
        <FeaturedIcon icon={CircleX} tone="warning" className="mb-6" />
        <h1 className="text-heading-xl font-semibold text-grey-950">Application Unsuccessful</h1>
        <p className="mt-3 max-w-[42ch] text-body-md text-grey-600">
          After careful review, we&rsquo;re unable to approve your application at this time. This may be due to
          incomplete verification or not meeting our current marketplace criteria.
        </p>
      </div>

      <div className="mt-8 rounded-lg bg-white p-5 text-body-sm text-grey-700">
        <p>
          You&rsquo;re welcome to reapply after <span className="font-medium text-grey-900">90 days</span>. If you
          believe this was a mistake, contact our support team with your application reference.
        </p>
        <p className="mt-3 font-medium text-grey-900">Application Reference: BK-2024-00847</p>
      </div>

      <Button size="md" className="mt-6 w-full bg-grey-950 hover:bg-grey-800" onClick={() => navigate(ROUTES.recruiterGetStarted)}>
        Back to Get Started
      </Button>

      <p className="mt-6 text-center text-body-sm text-grey-500">
        Questions? Email us at{" "}
        <a href="mailto:support@jobkey.io" className="font-medium text-orange-600 underline">
          support@jobkey.io
        </a>
      </p>
    </RecruiterAuthLayout>
  );
}
