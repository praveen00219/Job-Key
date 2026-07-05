import { Eye, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CrmCandidate } from "@/lib/mockCrm";

const SOURCE_STYLES: Record<CrmCandidate["source"], string> = {
  Referral: "bg-orange-50 text-orange-600",
  LinkedIn: "bg-brand-50 text-brand-600",
  Direct: "bg-grey-100 text-grey-600",
  "CV Upload": "bg-success-50 text-success-600",
};

interface CandidatesTableProps {
  candidates: CrmCandidate[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  /** Show the AI match % column (used in the Submit-to-Vacancy wizard). */
  showMatch?: boolean;
}

export function CandidatesTable({ candidates, selected, onToggleSelect, showMatch = false }: CandidatesTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse">
        <thead>
          <tr className="border-b border-grey-200 bg-grey-50 text-left">
            <th className="w-10 px-3 py-2.5" />
            {[
              "Name",
              "Current Role",
              "Location",
              "Skills",
              "Source",
              "Last Contact",
              "Submissions",
              ...(showMatch ? ["Match"] : []),
              "Actions",
            ].map((col) => (
              <th key={col} className="px-3 py-2.5 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-b border-grey-100 last:border-0 hover:bg-grey-50">
              <td className="px-3 py-3">
                <Checkbox checked={selected.has(c.id)} onCheckedChange={() => onToggleSelect(c.id)} />
              </td>
              <td className="px-3 py-3">
                <button
                  type="button"
                  onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700",
                      c.avatarColor
                    )}
                  >
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span className="text-body-sm font-semibold text-grey-950 hover:text-orange-600">{c.name}</span>
                </button>
              </td>
              <td className="px-3 py-3 text-body-sm text-grey-700">
                {c.currentRole} at {c.currentCompany}
              </td>
              <td className="px-3 py-3 text-body-sm text-grey-700">{c.location}</td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span key={s} className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-700">
                      {s}
                    </span>
                  ))}
                  {c.extraSkills > 0 && (
                    <span className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-500">+{c.extraSkills}</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-3">
                <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", SOURCE_STYLES[c.source])}>
                  {c.source}
                </span>
              </td>
              <td className="px-3 py-3 text-body-sm text-grey-500">{c.lastContact}</td>
              <td className="px-3 py-3">
                {c.activeSubmissions > 0 ? (
                  <span className="rounded-full bg-success-50 px-2 py-0.5 text-body-xs font-medium text-success-600">
                    {c.activeSubmissions} active
                  </span>
                ) : (
                  <span className="text-body-xs text-grey-400">—</span>
                )}
              </td>
              {showMatch && (
                <td className="px-3 py-3 text-body-sm font-semibold text-grey-900">{c.matchPct}%</td>
              )}
              <td className="px-3 py-3">
                <div className="flex gap-1 text-grey-400">
                  <button
                    type="button"
                    aria-label={`View ${c.name}`}
                    onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
                    className="grid size-7 place-items-center rounded hover:bg-grey-100 hover:text-grey-700"
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Submit ${c.name}`}
                    onClick={() => navigate("/recruiter/submit-to-vacancy")}
                    className="grid size-7 place-items-center rounded hover:bg-grey-100 hover:text-grey-700"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
