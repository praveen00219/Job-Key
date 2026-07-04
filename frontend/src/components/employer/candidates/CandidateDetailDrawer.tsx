import { useState } from "react";
import { ChevronDown, Ellipsis, Link2, Mail, Reply, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { KanbanCandidate } from "@/lib/mockVacancyData";
import { candidateDetail } from "@/lib/mockCandidateDetail";
import { ProfileTab } from "./ProfileTab";
import { TimelineTab } from "./TimelineTab";
import { CommunicationTab } from "./CommunicationTab";
import { ReviewTab } from "./ReviewTab";
import { CommentsTab } from "./CommentsTab";

const TABS = ["Profile", "Timeline", "Communication", "Review", "Comments"] as const;
type Tab = (typeof TABS)[number];

interface CandidateDetailDrawerProps {
  candidate: KanbanCandidate;
  onClose: () => void;
}

export function CandidateDetailDrawer({ candidate, onClose }: CandidateDetailDrawerProps) {
  const [tab, setTab] = useState<Tab>("Profile");

  const detail = {
    ...candidateDetail,
    name: candidate.name,
    title: candidate.title,
    sourceTag: candidate.source === "Market" ? ("Marketplace" as const) : ("Direct" as const),
    skills: [...candidate.skills, ...(candidate.extraSkills > 0 ? [`+${candidate.extraSkills}`] : [])],
  };

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close candidate detail"
        onClick={onClose}
        className="absolute inset-0 bg-grey-950/40"
      />
      <div className="relative flex h-full w-full max-w-[720px] flex-col overflow-y-auto bg-grey-100 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-white text-grey-500 shadow-xs hover:text-grey-800"
        >
          <X className="size-4" />
        </button>

        <div className="border-b border-grey-200 bg-white px-6 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4 pr-10">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "grid size-14 shrink-0 place-items-center rounded-full text-body-md font-semibold text-grey-700",
                  candidate.avatarColor
                )}
              >
                {initials}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-heading-sm font-semibold text-grey-950">{detail.name}</h2>
                  <span className="rounded-full bg-grey-100 px-2 py-0.5 text-body-xs font-medium text-grey-600">
                    {detail.sourceTag}
                  </span>
                </div>
                <p className="text-body-sm text-grey-600">{detail.title}</p>
              </div>
            </div>
            {detail.recruiterName && (
              <p className="shrink-0 text-body-xs text-grey-500">
                Via{" "}
                <button type="button" className="font-medium text-brand-600 hover:text-brand-700">
                  {detail.recruiterName}
                </button>
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 pl-[68px]">
            {detail.skills.map((skill, i) => (
              <span key={`${skill}-${i}`} className="rounded-md bg-brand-50 px-2 py-0.5 text-body-xs text-brand-700">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 pl-[68px] text-body-xs text-grey-500">
            <span>{detail.location}</span>
            <span>{detail.phone}</span>
            <span>{detail.email}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button type="button" className="grid size-8 place-items-center rounded-md text-grey-500 hover:bg-grey-50" aria-label="More">
                <Ellipsis className="size-4" />
              </button>
              <button type="button" className="grid size-8 place-items-center rounded-md text-grey-500 hover:bg-grey-50" aria-label="Email">
                <Mail className="size-4" />
              </button>
              <button type="button" className="grid size-8 place-items-center rounded-md text-grey-500 hover:bg-grey-50" aria-label="Reply">
                <Reply className="size-4" />
              </button>
              <button type="button" className="grid size-8 place-items-center rounded-md text-grey-500 hover:bg-grey-50" aria-label="Copy link">
                <Link2 className="size-4" />
              </button>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full bg-success-50 px-3 py-1.5 text-body-sm font-medium text-success-600"
            >
              Applied
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto border-b border-grey-100">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-3 py-2.5 text-body-sm font-semibold transition-colors",
                  tab === t ? "border-grey-950 text-grey-950" : "border-transparent text-grey-500 hover:text-grey-800"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6">
          {tab === "Profile" && <ProfileTab />}
          {tab === "Timeline" && <TimelineTab />}
          {tab === "Communication" && <CommunicationTab />}
          {tab === "Review" && <ReviewTab />}
          {tab === "Comments" && <CommentsTab />}
        </div>
      </div>
    </div>
  );
}
