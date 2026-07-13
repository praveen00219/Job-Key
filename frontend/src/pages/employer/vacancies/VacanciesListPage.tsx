import { useEffect, useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { vacancyList as mockVacancyList, type VacancyListItem, type VacancyStatus } from "@/lib/mockVacancyData";
import { apiFetch, getToken } from "@/lib/api";

const STATUS_STYLES: Record<VacancyStatus, string> = {
  Active: "bg-success-50 text-success-600",
  Paused: "bg-grey-100 text-grey-600",
  Draft: "bg-warning-50 text-warning-700",
  Closed: "bg-danger-50 text-danger-600",
};

interface ApiVacancy {
  slug: string;
  title: string;
  department: string;
  status: string;
  applications_count: number;
  location: string;
  posted_at: string;
}

function fromApi(v: ApiVacancy): VacancyListItem {
  return {
    id: v.slug,
    title: v.title,
    department: v.department || "—",
    // Backend statuses match the frontend's set except it also allows "Filled"
    status: (["Active", "Paused", "Draft", "Closed"].includes(v.status) ? v.status : "Active") as VacancyStatus,
    applications: v.applications_count,
    location: v.location || "—",
    postedDate: new Date(v.posted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
}

export default function VacanciesListPage() {
  const navigate = useNavigate();

  // Live vacancies come from the real backend (Phase 11) when a session
  // exists; otherwise this falls back to the mock catalogue unchanged so
  // the page still works for anonymous/dev browsing.
  const [vacancyList, setVacancyList] = useState<VacancyListItem[]>(mockVacancyList);
  const [source, setSource] = useState<"live" | "mock">("mock");

  useEffect(() => {
    if (!getToken()) return;
    apiFetch<{ items: ApiVacancy[] }>("/vacancies")
      .then((data) => {
        setVacancyList(data.items.map(fromApi));
        setSource("live");
      })
      .catch(() => {
        // Session expired or request failed — keep showing mock data.
        // (This fallback is removed in module A3 per the hard-cut policy.)
      });
  }, []);

  const createButton = (
    <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => navigate(ROUTES.vacancyNew)}>
      <Plus className="size-[18px]" />
      Create Vacancy
    </Button>
  );

  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <PageBannerTitle
            title="Vacancies"
            subtitle="Create and manage your job vacancies"
            actions={createButton}
          />
        </EmployerHero>
      }
    >
      {source === "live" && (
        <p className="mb-3 flex items-center gap-1.5 text-body-xs font-medium text-success-600">
          <span className="size-1.5 rounded-full bg-success-600" />
          Live from your JobKey account
        </p>
      )}
      {vacancyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-brand-50">
            <Briefcase className="size-7 text-brand-600" />
          </span>
          <h2 className="text-heading-sm font-semibold text-grey-950">No vacancies yet</h2>
          <p className="max-w-[46ch] text-body-sm text-grey-500">
            Create your first vacancy to start receiving candidates from direct applications and
            marketplace recruiters.
          </p>
          {createButton}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-xs">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-grey-200 bg-grey-50 text-left">
                {["Vacancy", "Department", "Applications", "Location", "Posted", ""].map((col) => (
                  <th key={col} className="px-5 py-3 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vacancyList.map((v) => (
                <tr
                  key={v.id}
                  className="cursor-pointer border-b border-grey-100 last:border-0 hover:bg-grey-50"
                  // VacancyDetailPage still reads from mock data (unwired until
                  // a later phase); it redirects back here for unknown ids, so
                  // this is safe for both mock and live rows.
                  onClick={() => navigate(`/vacancies/${v.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-semibold text-grey-950">{v.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-body-xs font-medium ${STATUS_STYLES[v.status]}`}>
                        {v.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-body-sm text-grey-700">{v.department}</td>
                  <td className="px-5 py-4 text-body-sm text-grey-700">{v.applications}</td>
                  <td className="px-5 py-4 text-body-sm text-grey-700">{v.location}</td>
                  <td className="px-5 py-4 text-body-sm text-grey-700">{v.postedDate}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-body-sm font-semibold text-brand-600">View Pipeline</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </EmployerLayout>
  );
}
