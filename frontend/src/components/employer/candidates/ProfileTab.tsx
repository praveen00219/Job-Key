import { Download, Sparkles } from "lucide-react";

import { candidateDetail } from "@/lib/mockCandidateDetail";

export function ProfileTab() {
  const d = candidateDetail;

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5">
        <h3 className="text-heading-sm font-semibold text-grey-950">Professional Summary</h3>
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-body-sm sm:grid-cols-2">
          <div>
            <p className="text-grey-500">Current Company</p>
            <p className="mt-0.5 text-grey-900">{d.currentCompany}</p>
          </div>
          <div>
            <p className="text-grey-500">Salary Expectation</p>
            <p className="mt-0.5 text-grey-900">{d.salaryExpectation}</p>
          </div>
          <div>
            <p className="text-grey-500">Notice Period</p>
            <p className="mt-0.5 text-grey-900">{d.noticePeriod}</p>
          </div>
          <div>
            <p className="text-grey-500">Preferred Location</p>
            <p className="mt-0.5 text-grey-900">{d.preferredLocation}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-white p-5">
        <h3 className="text-heading-sm font-semibold text-grey-950">Work History</h3>
        <div className="mt-4 space-y-5">
          {d.workHistory.map((job, i) => (
            <div key={i} className="flex gap-3">
              <span className={`mt-1 size-2.5 shrink-0 rounded-full ${job.dotColor}`} />
              <div>
                <p className="text-body-sm font-semibold text-grey-950">{job.role}</p>
                <p className="text-body-sm text-grey-700">{job.company}</p>
                <p className="text-body-xs text-grey-400">{job.dateRange}</p>
                <p className="mt-1 text-body-sm text-grey-600">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-md border border-grey-200 py-2.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
        >
          Show all 5 roles
        </button>
      </section>

      <section className="rounded-lg bg-white p-5">
        <h3 className="text-heading-sm font-semibold text-grey-950">Education</h3>
        <div className="mt-3 space-y-2">
          {d.education.map((e, i) => (
            <div key={i} className="flex gap-4 text-body-sm">
              <span className="w-24 shrink-0 text-grey-400">{e.years}</span>
              <span className="text-grey-800">{e.degree}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white p-5">
        <h3 className="text-heading-sm font-semibold text-grey-950">Documents</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {d.documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between rounded-md border border-grey-200 p-3">
              <div>
                <p className="text-body-sm font-medium text-grey-900">{doc.name}</p>
                <p className="text-body-xs text-grey-400">{doc.date}</p>
              </div>
              <Download className="size-4 shrink-0 text-grey-400" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white p-5">
        <h3 className="flex items-center gap-1.5 text-heading-sm font-semibold text-grey-950">
          <Sparkles className="size-4 text-brand-500" />
          Why this candidate?
        </h3>
        <p className="mt-3 text-body-sm leading-relaxed text-grey-700">{d.whyThisCandidate}</p>
      </section>

      {d.consented && (
        <p className="flex items-center gap-1.5 text-body-sm text-success-600">
          <span>✓</span> Candidate has consented to this submission
        </p>
      )}
    </div>
  );
}
