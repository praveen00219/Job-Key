import { useState } from "react";
import { Building2, Check, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero } from "@/components/recruiter/RecruiterHero";
import { CandidatesTable } from "@/components/recruiter/crm/CandidatesTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { crmCandidates } from "@/lib/mockCrm";
import { ROUTES } from "@/lib/routes";

const STEPS = [
  { label: "Candidate", sublabel: "Pick your strongest match" },
  { label: "Commission", sublabel: "Set your bid & see earnings" },
  { label: "Notes", sublabel: "Share why they're the right fit" },
  { label: "Review", sublabel: "Confirm & submit" },
];

const VACANCY = {
  title: "Quality Assurance Tester Manual Intern",
  company: "Amazon.com, Inc.",
  role: "UI/UX Designer",
  experience: "2-5 years",
  location: "Austin, Texas",
  salary: "£70,000 - £90,000 per year",
  posted: "Posted 5 days ago · Closes in 25 days",
  salaryMidpoint: 80000,
};

function WizardSteps({ current }: { current: number }) {
  return (
    <div className="flex items-start gap-2 overflow-x-auto pb-1 pt-4">
      {STEPS.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <div key={step.label} className="flex min-w-[130px] flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span className={cn("h-0.5 flex-1", i === 0 ? "invisible" : state === "upcoming" ? "bg-white/50" : "bg-orange-500")} />
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border-2 bg-white",
                  state === "done" && "border-orange-500 bg-orange-500",
                  state === "active" && "border-orange-500",
                  state === "upcoming" && "border-white/70"
                )}
              >
                {state === "done" ? (
                  <Check className="size-3.5 text-white" strokeWidth={3} />
                ) : (
                  <span className={cn("size-2 rounded-full", state === "active" ? "bg-orange-500" : "bg-transparent")} />
                )}
              </span>
              <span
                className={cn("h-0.5 flex-1", i === STEPS.length - 1 ? "invisible" : state === "done" ? "bg-orange-500" : "bg-white/50")}
              />
            </div>
            <div className="text-center">
              <p className={cn("max-w-full truncate text-body-sm", state === "upcoming" ? "text-grey-600" : "font-medium text-grey-950")}>
                {step.label}
              </p>
              <p className="hidden max-w-full truncate text-body-xs text-grey-600 sm:block">{step.sublabel}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SubmitToVacancyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set([crmCandidates[0].id]));
  const [bid, setBid] = useState("15");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCandidates = crmCandidates.filter((c) => selected.has(c.id));
  const estimatedEarnings = Math.round((VACANCY.salaryMidpoint * Number(bid || 0)) / 100);

  if (submitted) {
    return (
      <RecruiterLayout hero={<RecruiterHero>{<WizardSteps current={4} />}</RecruiterHero>}>
        <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4 rounded-lg bg-white p-10 text-center shadow-xs">
          <CheckCircle2 className="size-12 text-success-600" />
          <h1 className="text-heading-lg font-semibold text-grey-950">Candidate Submitted!</h1>
          <p className="text-body-sm text-grey-600">
            {selectedCandidates.length > 1
              ? `${selectedCandidates.length} candidates were submitted`
              : `${selectedCandidates[0]?.name ?? "Your candidate"} was submitted`}{" "}
            to <span className="font-semibold text-grey-900">{VACANCY.title}</span> at {VACANCY.company}. The
            employer typically responds within 48 hours.
          </p>
          <div className="rounded-md bg-orange-50 px-4 py-2 text-body-sm font-medium text-orange-700">
            Estimated earnings if placed: £{estimatedEarnings.toLocaleString()} per placement
          </div>
          <div className="mt-2 flex gap-3">
            <Button variant="secondary" onClick={() => navigate(ROUTES.recruiterCandidates)}>
              Back to Candidates
            </Button>
            <Button className="bg-grey-950 hover:bg-grey-800" onClick={() => navigate("/recruiter/submissions")}>
              Track Submission
            </Button>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout hero={<RecruiterHero>{<WizardSteps current={step} />}</RecruiterHero>}>
      <div className="rounded-lg bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-grey-950">
              <Building2 className="size-5 text-white" />
            </span>
            <div>
              <h1 className="text-heading-sm font-semibold text-grey-950">{VACANCY.title}</h1>
              <p className="text-body-sm text-grey-500">{VACANCY.company}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.recruiterCandidates)}>
            Exit
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Role", value: VACANCY.role },
            { label: "Experience", value: VACANCY.experience },
            { label: "Location", value: VACANCY.location },
          ].map((f) => (
            <div key={f.label} className="rounded-md bg-grey-50 p-3">
              <p className="text-body-xs text-grey-500">{f.label}</p>
              <span className="mt-1 inline-block rounded bg-orange-50 px-2 py-0.5 text-body-xs font-medium text-orange-700">
                {f.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-body-md font-semibold text-grey-950">{VACANCY.salary}</p>
          <p className="text-body-xs text-grey-400">{VACANCY.posted}</p>
        </div>
      </div>

      <div className="mt-6">
        {step === 0 && (
          <>
            <div className="rounded-lg bg-white shadow-xs">
              <CandidatesTable candidates={crmCandidates} selected={selected} onToggleSelect={toggleSelect} showMatch />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-xs">
              <p className="text-body-sm text-grey-700">
                {String(selected.size).padStart(2, "0")} Candidates selected{" "}
                <button
                  type="button"
                  onClick={() => setSelected(new Set(crmCandidates.map((c) => c.id)))}
                  className="ml-2 font-semibold text-orange-600 hover:text-orange-700"
                >
                  Select All
                </button>
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={() => navigate(ROUTES.recruiterCandidates)}>
                  Back
                </Button>
                <Button size="md" className="bg-grey-950 hover:bg-grey-800" disabled={selected.size === 0} onClick={() => setStep(1)}>
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div className="mx-auto max-w-[560px] rounded-lg bg-white p-5 shadow-xs">
            <h2 className="text-heading-sm font-semibold text-grey-950">Set Your Commission Bid</h2>
            <p className="mt-1 text-body-sm text-grey-500">The bid is locked once submitted and applies to each selected candidate.</p>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="bid">Commission bid %</Label>
              <Input id="bid" type="number" min={8} max={25} value={bid} onChange={(e) => setBid(e.target.value)} />
              <p className="text-body-xs text-grey-500">Typical range for this role: 12%-18%</p>
            </div>
            <div className="mt-4 rounded-md bg-orange-50 p-4">
              <p className="text-body-sm text-orange-700">
                Estimated earnings per placement:{" "}
                <span className="font-semibold">£{estimatedEarnings.toLocaleString()}</span>
              </p>
              <p className="mt-1 text-body-xs text-orange-600">
                Based on the salary midpoint (£{VACANCY.salaryMidpoint.toLocaleString()}) × your {bid || 0}% bid, before platform fee.
              </p>
            </div>
            <div className="mt-5 flex justify-between">
              <Button variant="secondary" size="md" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button size="md" className="bg-grey-950 hover:bg-grey-800" disabled={!bid || Number(bid) <= 0} onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mx-auto max-w-[560px] rounded-lg bg-white p-5 shadow-xs">
            <h2 className="text-heading-sm font-semibold text-grey-950">Notes for the Employer</h2>
            <p className="mt-1 text-body-sm text-grey-500">Share why {selectedCandidates.length > 1 ? "these candidates are" : "this candidate is"} the right fit.</p>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Proven track record delivering user-centric products in complex domains…"
              className="mt-4 w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
            />
            <div className="mt-5 flex justify-between">
              <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mx-auto max-w-[560px] space-y-4">
            <div className="rounded-lg bg-white p-5 shadow-xs">
              <h2 className="text-heading-sm font-semibold text-grey-950">Review &amp; Submit</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-body-xs text-grey-500">Candidates ({selectedCandidates.length})</p>
                  <div className="mt-1.5 space-y-1.5">
                    {selectedCandidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-md bg-grey-50 p-2.5 text-body-sm">
                        <span className="font-medium text-grey-900">{c.name}</span>
                        <span className="text-grey-500">Match {c.matchPct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-grey-500">Commission bid</span>
                  <span className="font-semibold text-grey-900">{bid}%</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-grey-500">Est. earnings per placement</span>
                  <span className="font-semibold text-grey-900">£{estimatedEarnings.toLocaleString()}</span>
                </div>
                {notes && (
                  <div>
                    <p className="text-body-xs text-grey-500">Notes</p>
                    <p className="mt-1 rounded-md bg-grey-50 p-2.5 text-body-sm text-grey-700">{notes}</p>
                  </div>
                )}
              </div>
              <label className="mt-4 flex items-start gap-2.5 border-t border-grey-100 pt-4">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                <span className="text-body-sm text-grey-700">
                  I confirm I have obtained candidate consent to submit them for this role
                </span>
              </label>
            </div>
            <div className="flex justify-between">
              <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button size="md" className="bg-grey-950 hover:bg-grey-800" disabled={!consent} onClick={() => setSubmitted(true)}>
                Submit {selectedCandidates.length > 1 ? `${selectedCandidates.length} Candidates` : "Candidate"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
}
