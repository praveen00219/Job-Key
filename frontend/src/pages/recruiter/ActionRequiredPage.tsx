import { Clock, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RecruiterAuthLayout } from "@/components/recruiter/RecruiterAuthLayout";
import { FeaturedIcon } from "@/components/auth/FeaturedIcon";
import { ApplicationTracker } from "@/components/recruiter/ApplicationTracker";
import { FileUploadBox } from "@/components/recruiter/FileUploadBox";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function ActionRequiredPage() {
  const navigate = useNavigate();

  return (
    <RecruiterAuthLayout wide>
      <div className="flex flex-col items-center text-center">
        <FeaturedIcon icon={Clock} tone="orange" className="mb-6" />
        <h1 className="text-heading-xl font-semibold text-grey-950">Action Required</h1>
        <p className="mt-3 text-body-md text-grey-600">Please provide the following to continue your application review</p>
      </div>

      <div className="mt-8 rounded-lg bg-white p-5">
        <h3 className="text-body-md font-semibold text-grey-900">Application information</h3>
        <div className="mt-3 grid grid-cols-2 gap-4 text-body-sm">
          <div>
            <p className="text-grey-500">Application Reference</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-medium text-grey-900">
              BK-2024-00847
              <Copy className="size-3.5 text-grey-400" />
            </p>
          </div>
          <div>
            <p className="text-grey-500">Submitted</p>
            <p className="mt-0.5 font-medium text-grey-900">15 January 2025 at 14:32 GMT</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ApplicationTracker
          steps={[
            { title: "Application Submitted", description: "Your application was received successfully", timestamp: "15 January 2025 at 14:32", state: "done" },
            { title: "Additional Information Needed", description: "Identity Document Issue. Please upload again", state: "current" },
            { title: "Decision Sent", description: "You'll receive an email with our decision and next steps", state: "upcoming" },
          ]}
        />
      </div>

      <div className="mt-6 rounded-lg bg-white p-5">
        <h3 className="text-body-md font-semibold text-grey-900">Additional Information Needed</h3>
        <p className="mt-2 text-body-sm font-medium text-grey-800">Identity Document Issue</p>
        <p className="mt-1 text-body-sm text-grey-500">
          The document you uploaded appears to be expired or unclear. Please upload a current, clear copy of your
          passport or driving license.
        </p>
        <div className="mt-3">
          <FileUploadBox hint="Accepted formats: PDF, JPG or PNG · Max 10MB" />
        </div>
      </div>

      <Button size="md" className="mt-6 w-full bg-grey-950 hover:bg-grey-800" onClick={() => navigate(ROUTES.recruiterUnderReview)}>
        Submit for review
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
