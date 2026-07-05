import { useState } from "react";
import { ChevronDown, FileSpreadsheet, Folder, Linkedin, ListFilter, Plus, Search, Upload, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { CandidatesTable } from "@/components/recruiter/crm/CandidatesTable";
import { AddCandidateModal } from "@/components/recruiter/crm/AddCandidateModal";
import { LinkedInImportModal } from "@/components/recruiter/crm/LinkedInImportModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryGroups, crmCandidates } from "@/lib/mockCrm";
import { ROUTES } from "@/lib/routes";

const TABS = [
  { id: "all", label: "All Candidates" },
  { id: "groups", label: "Category Groups" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type ModalKind = "manual" | "linkedin" | null;

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [search, setSearch] = useState("");

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = crmCandidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle
            title="Candidates"
            subtitle="Your candidate database — organize, track, and submit"
            actions={
              <div className="relative">
                <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => setAddMenuOpen((v) => !v)}>
                  Add Candidate
                  <ChevronDown className="size-4" />
                </Button>
                {addMenuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg bg-white p-1.5 shadow-lg">
                    {[
                      { icon: UserPlus, label: "Manual entry", action: () => setModal("manual") },
                      { icon: Linkedin, label: "Import from LinkedIn URL", action: () => setModal("linkedin") },
                      { icon: Upload, label: "Upload CV", action: () => setModal("manual") },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setAddMenuOpen(false);
                          item.action();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-body-sm text-grey-800 hover:bg-grey-50"
                      >
                        <item.icon className="size-4 text-grey-500" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          />
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
                {t.label}
              </button>
            ))}
          </div>
        </RecruiterHero>
      }
    >
      {tab === "all" ? (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-xs">
            <button type="button" className="flex items-center gap-1.5 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
              <ListFilter className="size-4" />
              Filters
            </button>
            <div className="relative min-w-[160px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="h-9 w-full rounded-md border border-grey-200 py-2 pl-9 pr-3 text-body-sm text-grey-900 placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
              />
            </div>
            <span className="text-body-sm text-grey-500">Showing {filtered.length} candidates</span>
            <button type="button" className="flex items-center gap-1 rounded-md border border-grey-200 px-3 py-2 text-body-sm text-grey-700 hover:bg-grey-50">
              Sort
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-white shadow-xs">
            <CandidatesTable candidates={filtered} selected={selected} onToggleSelect={toggleSelect} />
            <div className="flex items-center justify-between p-4 text-body-sm text-grey-600">
              <span className="flex items-center gap-2">
                Rows per page
                <select className="rounded-md border border-grey-200 px-2 py-1 text-body-sm">
                  <option>20</option>
                </select>
              </span>
              <span>Page 1 of 1</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-white p-5 shadow-xs">
            <h2 className="text-heading-sm font-semibold text-grey-950">Import Candidates</h2>
            <p className="text-body-sm text-grey-500">Multiple ways to build your candidate database</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-grey-200 p-4">
                <span className="grid size-10 place-items-center rounded-md bg-success-50">
                  <FileSpreadsheet className="size-5 text-success-600" />
                </span>
                <p className="mt-2.5 text-body-md font-semibold text-grey-950">CSV Upload</p>
                <p className="text-body-sm text-grey-500">
                  Bulk import candidates from spreadsheets or other ATS systems. Download our template for the right
                  field mapping.
                </p>
                <button type="button" className="mt-3 rounded-md border border-grey-200 px-3.5 py-2 text-body-sm font-medium text-grey-700 hover:bg-grey-50">
                  Upload CSV
                </button>
              </div>
              <div className="rounded-md border border-grey-200 p-4">
                <span className="grid size-10 place-items-center rounded-md bg-brand-50">
                  <Linkedin className="size-5 text-brand-600" />
                </span>
                <p className="mt-2.5 text-body-md font-semibold text-grey-950">LinkedIn</p>
                <p className="text-body-sm text-grey-500">
                  Paste a LinkedIn profile URL and we&rsquo;ll import candidate details automatically.
                </p>
                <button
                  type="button"
                  onClick={() => setModal("linkedin")}
                  className="mt-3 flex items-center gap-1.5 rounded-md border border-grey-200 px-3.5 py-2 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
                >
                  Import Profile
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {selected.size > 0 && (
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-grey-200 bg-white px-5 py-3 shadow-lg sm:px-8 lg:px-14">
              <div className="mx-auto flex max-w-[1440px] items-center justify-between">
                <p className="text-body-sm text-grey-700">
                  {String(selected.size).padStart(2, "0")} Candidates selected{" "}
                  <button
                    type="button"
                    onClick={() => setSelected(new Set(filtered.map((c) => c.id)))}
                    className="ml-2 font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Select All
                  </button>
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" onClick={() => setSelected(new Set())}>
                    Back
                  </Button>
                  <Button size="md" className="bg-grey-950 hover:bg-grey-800" onClick={() => navigate(ROUTES.recruiterSubmitToVacancy)}>
                    Submit to Vacancy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setTab("all")}
              className="rounded-lg bg-white p-5 text-left shadow-xs transition-shadow hover:shadow-sm"
            >
              <span className={cn("grid size-10 place-items-center rounded-md", g.color.split(" ")[0])}>
                <Folder className={cn("size-5", g.color.split(" ")[1])} />
              </span>
              <p className="mt-3 text-body-md font-semibold text-grey-950">{g.name}</p>
              <p className="text-body-sm text-grey-500">{g.count} candidates</p>
            </button>
          ))}
        </div>
      )}

      {modal === "manual" && <AddCandidateModal onClose={() => setModal(null)} />}
      {modal === "linkedin" && <LinkedInImportModal onClose={() => setModal(null)} />}
    </RecruiterLayout>
  );
}
