import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { Button } from "@/components/ui/button";
import { candidateOffer } from "@/lib/mockPublicJobs";
import { ROUTES } from "@/lib/routes";

type Resolution = { kind: "accepted" } | { kind: "rejected" } | { kind: "countered"; message: string };

/** Offer response (PRD Flow C3): view terms, then Accept / Reject / Counter. */
export default function OfferResponsePage() {
  const navigate = useNavigate();
  const [showCounter, setShowCounter] = useState(false);
  const [counterMessage, setCounterMessage] = useState("");
  const [resolution, setResolution] = useState<Resolution | null>(null);

  const offer = candidateOffer;

  return (
    <div className="min-h-dvh bg-grey-100">
      <header className="flex items-center justify-between bg-white px-5 py-4 shadow-xs sm:px-8 lg:px-14">
        <JobKeyLogo size="sm" />
        <Link to={ROUTES.candidateApplications} className="flex items-center gap-1.5 text-body-sm font-medium text-grey-600 hover:text-grey-900">
          <ArrowLeft className="size-4" />
          My Applications
        </Link>
      </header>

      <main className="mx-auto max-w-[640px] px-5 py-8">
        {resolution ? (
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-10 text-center shadow-xs">
            <CheckCircle2 className="size-12 text-success-600" />
            <h1 className="text-heading-lg font-semibold text-grey-950">
              {resolution.kind === "accepted" && "Offer Accepted!"}
              {resolution.kind === "rejected" && "Offer Declined"}
              {resolution.kind === "countered" && "Counter-Offer Sent"}
            </h1>
            <p className="max-w-[44ch] text-body-sm text-grey-600">
              {resolution.kind === "accepted" &&
                `Congratulations! ${offer.company} has been notified. They'll be in touch with next steps before your ${offer.startDate} start date.`}
              {resolution.kind === "rejected" && `${offer.company} has been notified of your decision. Your other applications are unaffected.`}
              {resolution.kind === "countered" && `Your counter-offer was sent to ${offer.company}. We'll email you as soon as they respond.`}
            </p>
            <Button className="mt-2 bg-grey-950 hover:bg-grey-800" onClick={() => navigate(ROUTES.candidateApplications)}>
              Back to Applications
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-[26px] font-semibold text-grey-950">You have an offer 🎉</h1>
            <p className="mt-1 text-body-sm text-grey-600">
              {offer.company} has extended an offer for <span className="font-medium text-grey-900">{offer.jobTitle}</span>.
              Respond by {offer.expiresOn}.
            </p>

            <div className="mt-6 rounded-lg bg-white p-5 shadow-xs">
              <h2 className="text-heading-sm font-semibold text-grey-950">Offer Terms</h2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-body-sm sm:grid-cols-2">
                <div>
                  <p className="text-grey-500">Base Salary</p>
                  <p className="mt-0.5 font-medium text-grey-900">{offer.baseSalary}</p>
                </div>
                <div>
                  <p className="text-grey-500">Bonus</p>
                  <p className="mt-0.5 font-medium text-grey-900">{offer.bonus}</p>
                </div>
                <div>
                  <p className="text-grey-500">Contract Type</p>
                  <p className="mt-0.5 font-medium text-grey-900">{offer.contractType}</p>
                </div>
                <div>
                  <p className="text-grey-500">Start Date</p>
                  <p className="mt-0.5 font-medium text-grey-900">{offer.startDate}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-grey-500">Benefits</p>
                  <p className="mt-0.5 font-medium text-grey-900">{offer.benefits}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-grey-500">Perks &amp; Additional Details</p>
                  <p className="mt-0.5 text-grey-700">{offer.perks}</p>
                </div>
              </div>
            </div>

            {showCounter ? (
              <div className="mt-4 rounded-lg bg-white p-5 shadow-xs">
                <h2 className="text-heading-sm font-semibold text-grey-950">Counter-Offer</h2>
                <p className="mt-1 text-body-sm text-grey-500">Tell {offer.company} what would make this work for you.</p>
                <textarea
                  rows={4}
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  placeholder="e.g. I'm excited about the role — I'd be ready to sign at $98,000 base…"
                  className="mt-3 w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
                />
                <div className="mt-4 flex justify-between">
                  <Button variant="secondary" onClick={() => setShowCounter(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-grey-950 hover:bg-grey-800"
                    disabled={!counterMessage.trim()}
                    onClick={() => setResolution({ kind: "countered", message: counterMessage })}
                  >
                    Send Counter-Offer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1 bg-success-600 hover:bg-success-600/90" onClick={() => setResolution({ kind: "accepted" })}>
                  Accept Offer
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setShowCounter(true)}>
                  Counter-Offer
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => setResolution({ kind: "rejected" })}>
                  Decline
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
