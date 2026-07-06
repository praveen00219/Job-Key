import { useState } from "react";
import { Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { candidateApplications, type CandidateAppStatus } from "@/lib/mockPublicJobs";
import { ROUTES } from "@/lib/routes";

const STATUS_STYLES: Record<CandidateAppStatus, string> = {
  "Under Review": "bg-brand-50 text-brand-600",
  Interview: "bg-warning-50 text-warning-700",
  Offer: "bg-success-50 text-success-600",
  "Not Selected": "bg-grey-100 text-grey-500",
  Withdrawn: "bg-grey-100 text-grey-400",
};

/**
 * Candidate application tracking (PRD Flow C2): simplified statuses only —
 * deliberately no recruiter names and no internal pipeline stages.
 */
export default function CandidateApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(candidateApplications);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const withdraw = (id: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Withdrawn" as const, hasOffer: false } : a)));
    setConfirmingId(null);
  };

  return (
    <div className="min-h-dvh bg-grey-100">
      <header className="flex items-center justify-between bg-white px-5 py-4 shadow-xs sm:px-8 lg:px-14">
        <JobKeyLogo size="sm" />
        <div className="flex items-center gap-4">
          <span className="hidden text-body-sm text-grey-600 sm:block">jamie.fletcher@example.com</span>
          <Link to={ROUTES.candidateLogin} className="text-body-sm font-medium text-grey-600 hover:text-grey-900">
            Sign out
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-8">
        <h1 className="font-heading text-[26px] font-semibold text-grey-950">My Applications</h1>
        <p className="mt-1 text-body-sm text-grey-600">Track the status of every job you&rsquo;ve applied to.</p>

        <div className="mt-6 space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="rounded-lg bg-white p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-grey-100">
                    <Building2 className="size-5 text-grey-500" />
                  </span>
                  <div>
                    <p className="text-body-sm font-semibold text-grey-950">{app.jobTitle}</p>
                    <p className="text-body-xs text-grey-500">
                      {app.company} · Applied {app.appliedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-body-xs font-medium", STATUS_STYLES[app.status])}>
                    {app.status}
                  </span>
                  {app.hasOffer && (
                    <Button size="sm" className="bg-grey-950 hover:bg-grey-800" onClick={() => navigate("/candidate/offers/1")}>
                      View Offer
                    </Button>
                  )}
                  {app.status !== "Withdrawn" && app.status !== "Not Selected" && (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(app.id)}
                      className="text-body-xs font-medium text-grey-400 hover:text-danger-500"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {confirmingId === app.id && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md bg-danger-50 p-3">
                  <p className="text-body-sm text-danger-600">
                    Withdraw this application? The employer will be notified and this can&rsquo;t be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="rounded-md border border-grey-200 bg-white px-3 py-1.5 text-body-xs font-medium text-grey-700"
                    >
                      Keep Application
                    </button>
                    <button
                      type="button"
                      onClick={() => withdraw(app.id)}
                      className="rounded-md bg-danger-500 px-3 py-1.5 text-body-xs font-medium text-white hover:bg-danger-600"
                    >
                      Confirm Withdrawal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
