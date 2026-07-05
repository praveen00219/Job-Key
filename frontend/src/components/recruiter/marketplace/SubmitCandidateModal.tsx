import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crmCandidates } from "@/lib/mockCrm";
import type { MarketplaceVacancy } from "@/lib/mockMarketplace";

interface SubmitCandidateModalProps {
  vacancy: MarketplaceVacancy;
  onClose: () => void;
}

/**
 * Quick single-candidate submission (PRD Flow R4): pick a candidate from the
 * CRM, set the commission bid, confirm consent. For multi-candidate
 * submission use the full Submit-to-Vacancy wizard launched from the CRM.
 */
export function SubmitCandidateModal({ vacancy, onClose }: SubmitCandidateModalProps) {
  const [candidateId, setCandidateId] = useState("");
  const [bid, setBid] = useState("15");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const salaryMidpoint = 90000; // placeholder estimate used for the earnings preview
  const estimatedEarnings = Math.round((salaryMidpoint * Number(bid || 0)) / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-grey-950/40" />
      <div className="relative w-full max-w-[480px] rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-grey-100 p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Submit Candidate</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-grey-400 hover:text-grey-700">
            <X className="size-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-5 text-center">
            <p className="text-body-md font-semibold text-success-600">Submission sent!</p>
            <p className="mt-2 text-body-sm text-grey-600">
              Estimated earnings if placed: <span className="font-semibold text-grey-900">£{estimatedEarnings.toLocaleString()}</span>
            </p>
            <Button className="mt-5 w-full bg-grey-950 hover:bg-grey-800" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-body-sm text-grey-600">
              Submitting to <span className="font-semibold text-grey-900">{vacancy.title}</span> at {vacancy.company}
            </p>

            <div className="mt-4 space-y-1.5">
              <Label htmlFor="candidateSelect">Candidate</Label>
              <select
                id="candidateSelect"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="h-11 w-full rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs"
              >
                <option value="">Select from your CRM…</option>
                {crmCandidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.currentRole} at {c.currentCompany} ({c.matchPct}% match)
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-1.5">
              <Label htmlFor="bid">Commission bid %</Label>
              <Input id="bid" type="number" min={8} max={25} value={bid} onChange={(e) => setBid(e.target.value)} />
              <p className="text-body-xs text-grey-500">Typical range for this role: 12%-18%</p>
            </div>

            <div className="mt-4 rounded-md bg-orange-50 p-3 text-body-sm text-orange-700">
              Estimated earnings: £{estimatedEarnings.toLocaleString()}
            </div>

            <label className="mt-4 flex items-start gap-2.5">
              <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
              <span className="text-body-sm text-grey-700">I confirm I have obtained candidate consent to submit them for this role</span>
            </label>

            <Button
              className="mt-5 w-full bg-grey-950 hover:bg-grey-800"
              disabled={!consent || !candidateId}
              onClick={() => setSubmitted(true)}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
