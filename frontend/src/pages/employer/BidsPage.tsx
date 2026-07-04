import { useState } from "react";
import { Check, X } from "lucide-react";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bidRows as initialBidRows, TIER_STYLES, type BidRow, type BidStatus } from "@/lib/mockBids";

const TABS: { id: BidStatus; label: string }[] = [
  { id: "Pending", label: "Pending" },
  { id: "Accepted", label: "Accepted" },
  { id: "Rejected", label: "Rejected" },
];

function BidCard({
  bid,
  onAccept,
  onReject,
}: {
  bid: BidRow;
  onAccept: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const estimatedCommission = Math.round((bid.estimatedSalary * bid.commissionPct) / 100);

  return (
    <div className="rounded-lg bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-full text-body-sm font-semibold text-grey-700",
              bid.avatarColor
            )}
          >
            {bid.candidateName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <div>
            <p className="text-body-md font-semibold text-grey-950">{bid.candidateName}</p>
            <p className="text-body-sm text-grey-600">{bid.candidateTitle}</p>
            <p className="mt-1 text-body-sm text-grey-500">
              for <span className="font-medium text-grey-800">{bid.vacancy}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-heading-sm font-semibold text-grey-950">{bid.commissionPct}%</p>
          <p className="text-body-xs text-grey-500">≈ £{estimatedCommission.toLocaleString()} commission</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-grey-50 p-3">
        <span className="text-body-sm text-grey-600">Submitted by</span>
        <span className="text-body-sm font-medium text-grey-900">{bid.recruiterName}</span>
        <span className="text-body-sm text-grey-500">· {bid.agencyName}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", TIER_STYLES[bid.recruiterTier])}>
          {bid.recruiterTier}
        </span>
        <span className="ml-auto text-body-xs text-grey-400">{bid.submittedDate}</span>
      </div>

      <p className="mt-3 text-body-sm text-grey-700">{bid.notes}</p>

      {bid.status === "Pending" && (
        <div className="mt-4 border-t border-grey-100 pt-4">
          {showReject ? (
            <div className="space-y-3">
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional: share a reason for the recruiter"
                className="w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-2.5 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
              />
              <div className="flex justify-end gap-3">
                <Button variant="secondary" size="sm" onClick={() => setShowReject(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={() => onReject(bid.id, reason)}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setShowReject(true)}>
                <X className="size-4" />
                Reject
              </Button>
              <Button size="sm" className="bg-success-600 hover:bg-success-600/90" onClick={() => onAccept(bid.id)}>
                <Check className="size-4" />
                Accept Bid
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BidsPage() {
  const [bids, setBids] = useState(initialBidRows);
  const [tab, setTab] = useState<BidStatus>("Pending");

  const accept = (id: string) => setBids((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Accepted" } : b)));
  const reject = (id: string) => setBids((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Rejected" } : b)));

  const filtered = bids.filter((b) => b.status === tab);
  const counts = {
    Pending: bids.filter((b) => b.status === "Pending").length,
    Accepted: bids.filter((b) => b.status === "Accepted").length,
    Rejected: bids.filter((b) => b.status === "Rejected").length,
  };

  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <PageBannerTitle title="Bids" subtitle="Review recruiter submissions and commission bids" />
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-white/40">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-2.5 text-body-sm font-semibold transition-colors",
                  tab === t.id ? "border-grey-950 text-grey-950" : "border-transparent text-grey-600 hover:text-grey-900"
                )}
              >
                {t.label} ({counts[t.id]})
              </button>
            ))}
          </div>
        </EmployerHero>
      }
    >
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-16 text-center">
          <h2 className="text-heading-sm font-semibold text-grey-950">No {tab.toLowerCase()} bids</h2>
          <p className="max-w-[46ch] text-body-sm text-grey-500">
            Recruiter submissions for your vacancies will show up here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((bid) => (
            <BidCard key={bid.id} bid={bid} onAccept={accept} onReject={reject} />
          ))}
        </div>
      )}
    </EmployerLayout>
  );
}
