import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/auth/BackLink";
import { cn } from "@/lib/utils";
import { offerRows, type OfferStatus } from "@/lib/mockOffers";

const STATUS_STYLES: Record<OfferStatus, string> = {
  Pending: "bg-warning-50 text-warning-700",
  Accepted: "bg-success-50 text-success-600",
  Rejected: "bg-danger-50 text-danger-600",
  Expired: "bg-grey-100 text-grey-600",
  Withdrawn: "bg-grey-100 text-grey-500",
};

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [counterMessage, setCounterMessage] = useState("");

  const offer = offerRows.find((o) => o.id === id);
  if (!offer) return <Navigate to="/offers" replace />;

  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <PageBannerTitle title={`Offer — ${offer.candidateName}`} subtitle={offer.vacancy} />
        </EmployerHero>
      }
    >
      <div className="mx-auto max-w-[720px] space-y-6">
        <BackLink to="/offers">Back to Offers</BackLink>

        <div className="rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-grey-950">Offer Terms</h2>
            <span className={cn("rounded-full px-2.5 py-1 text-body-sm font-medium", STATUS_STYLES[offer.status])}>
              {offer.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-body-sm sm:grid-cols-2">
            <div>
              <p className="text-grey-500">Base Salary</p>
              <p className="mt-0.5 text-grey-900">{offer.baseSalary}</p>
            </div>
            <div>
              <p className="text-grey-500">Bonus</p>
              <p className="mt-0.5 text-grey-900">{offer.bonus ?? "—"}</p>
            </div>
            <div>
              <p className="text-grey-500">Contract Type</p>
              <p className="mt-0.5 text-grey-900">{offer.contractType}</p>
            </div>
            <div>
              <p className="text-grey-500">Start Date</p>
              <p className="mt-0.5 text-grey-900">{offer.startDate}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-grey-500">Benefits</p>
              <p className="mt-0.5 text-grey-900">{offer.benefits}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Timeline</h2>
          <div className="mt-4 space-y-3 text-body-sm">
            <div className="flex justify-between">
              <span className="text-grey-600">Offer sent</span>
              <span className="text-grey-900">{offer.createdDate}</span>
            </div>
            {offer.resolvedDate !== "—" && (
              <div className="flex justify-between">
                <span className="text-grey-600">{offer.status}</span>
                <span className="text-grey-900">{offer.resolvedDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-grey-600">Days open</span>
              <span className="text-grey-900">{offer.daysOpen} days</span>
            </div>
          </div>
        </div>

        {offer.status === "Pending" && (
          <div className="rounded-lg bg-white p-5">
            <h2 className="text-heading-sm font-semibold text-grey-950">Negotiation</h2>
            <p className="mt-1 text-body-sm text-grey-500">
              Send a message or a revised counter-offer to {offer.candidateName}.
            </p>
            <textarea
              rows={3}
              value={counterMessage}
              onChange={(e) => setCounterMessage(e.target.value)}
              placeholder="e.g. We can offer an additional £3,000 signing bonus…"
              className="mt-3 w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" size="md">
                Send Counter-Offer
              </Button>
              <div className="flex gap-3">
                <Button variant="danger" size="md" onClick={() => navigate("/offers")}>
                  Withdraw Offer
                </Button>
                <Button
                  size="md"
                  className="bg-grey-950 hover:bg-grey-800"
                  onClick={() => navigate("/offers")}
                >
                  Mark as Accepted
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}
