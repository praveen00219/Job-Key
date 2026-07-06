import { useEffect } from "react";
import { Briefcase, Building2, Check, Globe, MapPin, Monitor, Users } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { publicJobs } from "@/lib/mockPublicJobs";
import { ROUTES } from "@/lib/routes";

const SKILL_TINTS = [
  "bg-brand-50 text-brand-600",
  "bg-pink-50 text-pink-300",
  "bg-orange-50 text-orange-600",
  "bg-warning-50 text-warning-700",
  "bg-success-50 text-success-600",
];

const CULTURE_TINTS = ["bg-brand-100", "bg-orange-100", "bg-pink-50", "bg-warning-50", "bg-success-50", "bg-grey-200"];

/** Public, crawlable job posting page (Flow C1 entry point) — also statically prerendered. */
export default function PublicJobPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const job = publicJobs.find((j) => j.slug === slug);

  useEffect(() => {
    if (job) document.title = `${job.title} at ${job.company} — JobKey`;
    return () => {
      document.title = "JobKey — Employer Portal";
    };
  }, [job]);

  if (!job) return <Navigate to={ROUTES.login} replace />;

  const apply = () => navigate(`/jobs/${job.slug}/apply`);

  return (
    <div className="min-h-dvh bg-grey-100">
      <header className="flex items-center justify-between bg-white px-5 py-4 shadow-xs sm:px-8 lg:px-14">
        <JobKeyLogo size="sm" />
        <Link to={ROUTES.candidateLogin} className="text-body-sm font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-[880px] px-5 py-8">
        <div className="rounded-lg bg-white p-6 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-grey-950">
                <Building2 className="size-6 text-white" />
              </span>
              <div>
                <p className="text-body-md font-semibold text-grey-950">{job.company}</p>
                <p className="text-body-xs text-grey-500">{job.companyMeta}</p>
              </div>
            </div>
            <p className="shrink-0 text-body-xs text-grey-400">{job.postedAgo}</p>
          </div>

          <h1 className="mt-5 font-heading text-[26px] font-semibold text-grey-950">{job.title}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-xs text-grey-500">
            <span className="flex items-center gap-1">
              <Briefcase className="size-3.5" />
              {job.employmentType}
            </span>
            <span className="flex items-center gap-1">
              <Monitor className="size-3.5" />
              {job.workplace}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {job.department}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              Employee location: {job.employeeLocation}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Salary", value: job.salary },
              { label: "Experience", value: job.experience },
              { label: "Location", value: job.location },
            ].map((f) => (
              <div key={f.label} className="rounded-md bg-grey-50 p-3">
                <p className="text-body-xs text-grey-500">{f.label}</p>
                <span className="mt-1 inline-block rounded bg-brand-100 px-2 py-0.5 text-body-xs font-medium text-brand-700">
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          <Button className="mt-5 w-full" onClick={apply}>
            Apply for this Position
          </Button>
        </div>

        <div className="mt-4 rounded-lg bg-white p-6 shadow-xs">
          <h2 className="text-body-md font-semibold text-grey-950">Description</h2>
          <div className="mt-2 space-y-3">
            {job.description.map((p, i) => (
              <p key={i} className="text-body-sm leading-relaxed text-grey-600">
                {p}
              </p>
            ))}
          </div>

          <h2 className="mt-6 text-body-md font-semibold text-grey-950">Requirements</h2>
          <ul className="mt-2 space-y-1.5">
            {job.requirements.map((r) => (
              <li key={r} className="flex gap-2 text-body-sm text-grey-600">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-grey-400" />
                {r}
              </li>
            ))}
          </ul>

          <h2 className="mt-6 text-body-md font-semibold text-grey-950">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.skills.map((s, i) => (
              <span key={s} className={cn("rounded-full px-2.5 py-0.5 text-body-xs font-medium", SKILL_TINTS[i % SKILL_TINTS.length])}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-white p-6 shadow-xs">
          <h2 className="text-body-md font-semibold text-grey-950">Get to know our culture</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CULTURE_TINTS.map((tint, i) => (
              <div key={i} className={cn("relative aspect-[4/3] rounded-md", tint)}>
                {i === CULTURE_TINTS.length - 1 && (
                  <span className="absolute inset-0 grid place-items-center rounded-md bg-grey-950/50 text-heading-md font-semibold text-white">
                    +2
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-white p-6 shadow-xs">
          <h2 className="text-body-md font-semibold text-grey-950">Benefits of working with us</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {job.benefits.map((b) => (
              <p key={b} className="flex items-center gap-2 text-body-sm text-grey-700">
                <span className="grid size-4 place-items-center rounded-full bg-success-600">
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                </span>
                {b}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-white p-6 shadow-xs">
          <h2 className="text-body-md font-semibold text-grey-950">About {job.company.split(",")[0].split(".")[0]}</h2>
          <p className="mt-2 text-body-sm leading-relaxed text-grey-600">{job.about}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 text-body-sm text-grey-700 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Building2 className="size-4 text-grey-400" />
              Industry: {job.aboutIndustry}
            </p>
            <p className="flex items-center gap-2">
              <Users className="size-4 text-grey-400" />
              Company Size: {job.aboutSize}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-grey-400" />
              Headquarters: {job.aboutHq}
            </p>
            <p className="flex items-center gap-2">
              <Globe className="size-4 text-grey-400" />
              <span className="text-brand-600">{job.aboutWebsite}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-lg bg-brand-50 p-5 sm:flex-row">
          <p className="text-body-sm text-grey-700">
            These roles fill fast – typically within 2 days.
            <br className="hidden sm:block" />
            Don&rsquo;t miss out — submit your application today.
          </p>
          <Button size="md" className="w-full bg-grey-950 hover:bg-grey-800 sm:w-auto" onClick={apply}>
            Apply
          </Button>
        </div>
      </main>
    </div>
  );
}
