import { useState } from "react";
import { Check, CheckCircle2, Linkedin } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { FileUploadBox } from "@/components/recruiter/FileUploadBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { publicJobs } from "@/lib/mockPublicJobs";
import { ROUTES } from "@/lib/routes";

const STEPS = ["Your Details", "Screening Questions", "Review"];

const LINKEDIN_PROFILE = {
  name: "Jamie Fletcher",
  email: "jamie.fletcher@example.com",
  phone: "+1 (512) 555-0147",
  headline: "Senior Product Designer · 6 years exp",
};

export default function ApplyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const job = publicJobs.find((j) => j.slug === slug);

  const [step, setStep] = useState(0);
  const [prefilled, setPrefilled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!job) return <Navigate to={ROUTES.login} replace />;

  const prefillFromLinkedIn = () => {
    setPrefilled(true);
    setName(LINKEDIN_PROFILE.name);
    setEmail(LINKEDIN_PROFILE.email);
    setPhone(LINKEDIN_PROFILE.phone);
  };

  const requiredAnswered = job.screeningQuestions.filter((q) => q.required).every((q) => (answers[q.id] ?? "").trim() !== "");

  return (
    <div className="min-h-dvh bg-grey-100">
      <header className="flex items-center justify-between bg-white px-5 py-4 shadow-xs sm:px-8 lg:px-14">
        <JobKeyLogo size="sm" />
        <Link to={`/jobs/${job.slug}`} className="text-body-sm font-medium text-grey-600 hover:text-grey-900">
          Back to job
        </Link>
      </header>

      <main className="mx-auto max-w-[640px] px-5 py-8">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-10 text-center shadow-xs">
            <CheckCircle2 className="size-12 text-success-600" />
            <h1 className="text-heading-lg font-semibold text-grey-950">Application Submitted!</h1>
            <p className="text-body-sm text-grey-600">
              Your application for <span className="font-semibold text-grey-900">{job.title}</span> at {job.company} has
            been received. We&rsquo;ll email you when the status changes.
            </p>
            <div className="mt-2 flex gap-3">
              <Button variant="secondary" onClick={() => navigate(`/jobs/${job.slug}`)}>
                Back to Job
              </Button>
              <Button className="bg-grey-950 hover:bg-grey-800" onClick={() => navigate(ROUTES.candidateApplications)}>
                Track Application
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-5 shadow-xs">
              <p className="text-body-xs text-grey-500">Applying for</p>
              <h1 className="text-heading-sm font-semibold text-grey-950">{job.title}</h1>
              <p className="text-body-sm text-grey-600">
                {job.company} · {job.location}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-body-xs font-semibold",
                      i < step ? "bg-brand-500 text-white" : i === step ? "border-2 border-brand-500 bg-white text-brand-600" : "border border-grey-300 bg-white text-grey-400"
                    )}
                  >
                    {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={cn("truncate text-body-xs", i === step ? "font-semibold text-grey-900" : "text-grey-500")}>{s}</span>
                  {i < STEPS.length - 1 && <span className="h-px flex-1 bg-grey-200" />}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-white p-5 shadow-xs">
              {step === 0 && (
                <div className="space-y-4">
                  {!prefilled && (
                    <button
                      type="button"
                      onClick={prefillFromLinkedIn}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0A66C2] py-3 text-body-sm font-semibold text-white hover:bg-[#004182]"
                    >
                      <Linkedin className="size-4" />
                      Autofill with LinkedIn
                    </button>
                  )}
                  {prefilled && (
                    <p className="flex items-center gap-2 rounded-md bg-success-50 p-3 text-body-sm text-success-600">
                      <CheckCircle2 className="size-4" />
                      Profile imported from LinkedIn — review and edit below.
                    </p>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="applyName">
                      Full name <span className="text-danger-500">*</span>
                    </Label>
                    <Input id="applyName" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="applyEmail">
                        Email <span className="text-danger-500">*</span>
                      </Label>
                      <Input id="applyEmail" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="applyPhone">Phone</Label>
                      <Input id="applyPhone" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      CV / Resume <span className="text-danger-500">*</span>
                    </Label>
                    <FileUploadBox hint="PDF or Word · Max 10MB" />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-grey-950 hover:bg-grey-800" disabled={!name.trim() || !email.trim()} onClick={() => setStep(1)}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  {job.screeningQuestions.map((q) => (
                    <div key={q.id} className="space-y-1.5">
                      <Label htmlFor={q.id}>
                        {q.text} {q.required && <span className="text-danger-500">*</span>}
                      </Label>
                      {q.type === "Yes/No" ? (
                        <div className="flex gap-2">
                          {["Yes", "No"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                              className={cn(
                                "flex-1 rounded-md border py-2.5 text-body-sm font-medium transition-colors",
                                answers[q.id] === opt ? "border-brand-500 bg-brand-50 text-brand-700" : "border-grey-200 text-grey-700 hover:bg-grey-50"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : q.type === "Number" ? (
                        <Input
                          id={q.id}
                          type="number"
                          min={0}
                          placeholder="0"
                          value={answers[q.id] ?? ""}
                          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                        />
                      ) : (
                        <textarea
                          id={q.id}
                          rows={3}
                          value={answers[q.id] ?? ""}
                          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                          placeholder="Type your answer…"
                          className="w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(0)}>
                      Back
                    </Button>
                    <Button className="bg-grey-950 hover:bg-grey-800" disabled={!requiredAnswered} onClick={() => setStep(2)}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-body-xs text-grey-500">Contact</p>
                    <p className="text-body-sm text-grey-900">
                      {name} · {email}
                      {phone && ` · ${phone}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-xs text-grey-500">CV</p>
                    <p className="text-body-sm text-grey-900">document.pdf</p>
                  </div>
                  <div>
                    <p className="text-body-xs text-grey-500">Screening answers</p>
                    <div className="mt-1.5 space-y-2">
                      {job.screeningQuestions.map((q) => (
                        <div key={q.id} className="rounded-md bg-grey-50 p-3">
                          <p className="text-body-xs text-grey-500">{q.text}</p>
                          <p className="mt-0.5 text-body-sm font-medium text-grey-900">{answers[q.id] || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-grey-100 pt-4">
                    <Button variant="secondary" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="bg-grey-950 hover:bg-grey-800" onClick={() => setSubmitted(true)}>
                      Submit Application
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
