import { useState } from "react";
import { ArrowLeft, Linkedin, Mail, MapPin, MessageSquare, Phone, Plus, Send } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { VacancyCard } from "@/components/recruiter/marketplace/VacancyCard";
import { SubmitCandidateModal } from "@/components/recruiter/marketplace/SubmitCandidateModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { crmCandidates } from "@/lib/mockCrm";
import { submissionRows } from "@/lib/mockCrm";
import { marketplaceVacancies, type MarketplaceVacancy } from "@/lib/mockMarketplace";
import { ROUTES } from "@/lib/routes";

const TABS = ["Overview", "Experience", "Submissions", "Notes"] as const;
type Tab = (typeof TABS)[number];

const WORK_HISTORY = [
  { range: "2022 – Present", role: "Director of Marketing at Future Technologies" },
  { range: "2013 – 2015", role: "Digital Marketing Specialist at TechCorp" },
];

const EDUCATION = [
  { title: "Master of Design", detail: "Interaction Design · Royal College of Art", meta: "2015 - 2017 · London, UK" },
  { title: "Bachelor of Arts", detail: "Graphic Design · University of the Arts London", meta: "2011 - 2015 · London, UK" },
  { title: "Certificate in UX Design", detail: "Online Course · Coursera", meta: "2020 · Remote" },
];

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");
  const [submitTarget, setSubmitTarget] = useState<MarketplaceVacancy | null>(null);
  const [notes, setNotes] = useState<string[]>(["Strong portfolio — walked through two case studies on our intro call.", "Prefers roles with a design-systems component."]);
  const [noteDraft, setNoteDraft] = useState("");

  const candidate = crmCandidates.find((c) => c.id === id);
  if (!candidate) return <Navigate to={ROUTES.recruiterCandidates} replace />;

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const candidateSubmissions = submissionRows.slice(0, 3);
  const similar = crmCandidates.filter((c) => c.id !== candidate.id).slice(0, 3);

  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle
            title="Candidates"
            subtitle="Easily manage candidate applications, schedule interviews, and collect feedback — all in one place."
          />
        </RecruiterHero>
      }
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.recruiterCandidates)}
          className="flex items-center gap-1.5 rounded-md border border-grey-200 bg-white px-3 py-2 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Email candidate" className="grid size-9 place-items-center rounded-md border border-grey-200 bg-white text-grey-500 hover:text-grey-800">
            <Mail className="size-4" />
          </button>
          <button type="button" aria-label="Message candidate" className="grid size-9 place-items-center rounded-md border border-grey-200 bg-white text-grey-500 hover:text-grey-800">
            <MessageSquare className="size-4" />
          </button>
          <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => setSubmitTarget(marketplaceVacancies[0])}>
            <Send className="size-4" />
            Submit to Vacancy
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className={cn("grid size-14 shrink-0 place-items-center rounded-full text-body-md font-semibold text-grey-700", candidate.avatarColor)}>
              {initials}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-heading-sm font-semibold text-grey-950">{candidate.name}</h1>
                <Linkedin className="size-4 text-brand-600" />
              </div>
              <p className="text-body-sm text-grey-600">
                {candidate.currentRole} | {candidate.currentCompany} | {candidate.experienceYears} years exp
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[...candidate.skills, "Node.js", "PostgreSQL"].map((s, i) => (
                  <span key={`${s}-${i}`} className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-700">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-xs text-grey-500">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5" />
                  {candidate.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" />
                  {candidate.email}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-body-xs text-grey-600">
                {WORK_HISTORY.map((w) => (
                  <p key={w.range}>
                    <span className="text-grey-400">{w.range}</span>
                    <span className="ml-3">{w.role}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-body-sm font-semibold text-orange-700">
            Match {candidate.matchPct}%
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-md bg-grey-50 p-1 sm:grid-cols-4">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded px-3 py-2 text-body-sm font-semibold transition-colors",
                tab === t ? "bg-orange-100 text-grey-950" : "text-grey-500 hover:text-grey-800"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {tab === "Overview" && (
          <>
            <section>
              <h2 className="mb-3 text-heading-sm font-semibold text-grey-950">Summary</h2>
              <div className="rounded-lg bg-white p-5 shadow-xs">
                <p className="text-body-sm leading-relaxed text-grey-700">{candidate.summary}</p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-heading-sm font-semibold text-grey-950">Preferences</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: "Location", value: candidate.preferredLocation },
                  { label: "Salary Expectation", value: candidate.salaryExpectation },
                  { label: "Notice Period", value: candidate.noticePeriod },
                  { label: "Job Types", value: candidate.jobTypes },
                ].map((p) => (
                  <div key={p.label} className="rounded-lg bg-white p-4 shadow-xs">
                    <p className="text-body-xs text-grey-500">{p.label}</p>
                    <p className="mt-0.5 text-body-sm font-medium text-grey-900">{p.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-heading-sm font-semibold text-grey-950">Education</h2>
                <button type="button" className="flex items-center gap-1 rounded-md border border-grey-200 bg-white px-3 py-1.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50">
                  <Plus className="size-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {EDUCATION.map((e) => (
                  <div key={e.title} className="rounded-lg bg-white p-4 shadow-xs">
                    <p className="text-body-md font-semibold text-grey-950">{e.title}</p>
                    <p className="text-body-sm text-grey-600">{e.detail}</p>
                    <p className="text-body-xs text-grey-400">{e.meta}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-heading-sm font-semibold text-grey-950">Matching vacancies</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {marketplaceVacancies.slice(0, 2).map((v) => (
                  <VacancyCard
                    key={v.id}
                    vacancy={v}
                    watchlisted={false}
                    onToggleWatchlist={() => {}}
                    onSubmitCandidate={setSubmitTarget}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-1 text-heading-sm font-semibold text-grey-950">Similar Candidates</h2>
              <p className="mb-3 text-body-sm text-grey-500">Other candidates with similar profiles and skills</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {similar.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      navigate(`/recruiter/candidates/${c.id}`);
                      setTab("Overview");
                    }}
                    className="rounded-lg bg-white p-4 text-left shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("grid size-9 place-items-center rounded-full text-body-xs font-semibold text-grey-700", c.avatarColor)}>
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                        <div>
                          <p className="text-body-sm font-semibold text-grey-950">{c.name}</p>
                          <p className="text-body-xs text-grey-500">
                            {c.currentRole} · {c.experienceYears} years exp
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-body-xs font-semibold text-orange-700">
                        Match {c.matchPct}%
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {c.skills.map((s) => (
                        <span key={s} className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-600">
                          {s}
                        </span>
                      ))}
                      {c.extraSkills > 0 && (
                        <span className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-500">+{c.extraSkills}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === "Experience" && (
          <section className="rounded-lg bg-white p-5 shadow-xs">
            <h2 className="text-heading-sm font-semibold text-grey-950">Work History</h2>
            <div className="mt-4 space-y-5">
              {[
                { role: candidate.currentRole, company: candidate.currentCompany, range: "2022 - Present", dot: "bg-success-600" },
                { role: "Product Designer", company: "Canterbury Transport", range: "2019 - 2022", dot: "bg-grey-500" },
                { role: "UX/UI Designer", company: "Snap Chat", range: "2017 - 2019", dot: "bg-warning-500" },
              ].map((job) => (
                <div key={job.range} className="flex gap-3">
                  <span className={`mt-1 size-2.5 shrink-0 rounded-full ${job.dot}`} />
                  <div>
                    <p className="text-body-sm font-semibold text-grey-950">{job.role}</p>
                    <p className="text-body-sm text-grey-700">{job.company}</p>
                    <p className="text-body-xs text-grey-400">{job.range}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "Submissions" && (
          <section className="rounded-lg bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-grey-200 bg-grey-50 text-left">
                    {["Vacancy", "Submitted", "Commission", "Potential", "Status", "Days in Stage"].map((col) => (
                      <th key={col} className="px-4 py-2.5 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidateSubmissions.map((s) => (
                    <tr key={s.id} className="border-b border-grey-100 last:border-0">
                      <td className="px-4 py-3">
                        <p className="text-body-sm font-medium text-grey-900">{s.vacancyTitle}</p>
                        <p className="text-body-xs text-grey-500">{s.vacancyCompany}</p>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-grey-700">{s.submittedDate}</td>
                      <td className="px-4 py-3 text-body-sm text-grey-700">{s.commissionPct}%</td>
                      <td className="px-4 py-3 text-body-sm text-grey-700">{s.potential}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs font-medium text-brand-600">{s.status}</span>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-grey-700">{s.daysInStage} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "Notes" && (
          <section className="rounded-lg bg-white p-5 shadow-xs">
            <h2 className="text-heading-sm font-semibold text-grey-950">Private Notes</h2>
            <p className="text-body-sm text-grey-500">Only visible to you and your agency team.</p>
            <div className="mt-4 space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="rounded-md bg-grey-50 p-3 text-body-sm text-grey-700">
                  {n}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a note…"
                className="h-10 flex-1 rounded-md border border-grey-200 px-3 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
              />
              <Button
                size="sm"
                className="bg-grey-950 hover:bg-grey-800"
                disabled={!noteDraft.trim()}
                onClick={() => {
                  setNotes((prev) => [...prev, noteDraft.trim()]);
                  setNoteDraft("");
                }}
              >
                Add Note
              </Button>
            </div>
          </section>
        )}
      </div>

      {submitTarget && <SubmitCandidateModal vacancy={submitTarget} onClose={() => setSubmitTarget(null)} />}
    </RecruiterLayout>
  );
}
