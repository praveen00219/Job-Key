import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Link2, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { KanbanCandidate } from "@/lib/mockVacancyData";

interface CandidateCardProps {
  candidate: KanbanCandidate;
  overlay?: boolean;
  onOpen?: (candidate: KanbanCandidate) => void;
}

export function CandidateCard({ candidate, overlay = false, onOpen }: CandidateCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.id,
    disabled: overlay,
  });

  const style = overlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      };

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      onClick={() => onOpen?.(candidate)}
      className={cn(
        "rounded-lg border border-grey-100 bg-white p-3 shadow-xs",
        onOpen && "cursor-pointer hover:border-brand-200 hover:shadow-sm",
        overlay && "rotate-2 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-body-xs font-semibold text-grey-700",
              candidate.avatarColor
            )}
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-body-sm font-semibold text-grey-950">{candidate.name}</p>
            <p className="truncate text-body-xs text-grey-500">{candidate.title}</p>
          </div>
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to move"
          className="shrink-0 cursor-grab touch-none text-grey-300 hover:text-grey-500 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {candidate.skills.map((skill) => (
          <span key={skill} className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-600">
            {skill}
          </span>
        ))}
        {candidate.extraSkills > 0 && (
          <span className="rounded bg-grey-100 px-1.5 py-0.5 text-body-xs text-grey-600">
            +{candidate.extraSkills}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="flex items-center gap-1 text-body-xs text-grey-500">
          {candidate.source === "Direct" ? (
            <Link2 className="size-3.5" />
          ) : (
            <ShoppingBag className="size-3.5" />
          )}
          {candidate.source} · {candidate.daysAgo} days ago
        </span>
        {candidate.topPercent && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs font-medium text-brand-700">
            Top {candidate.topPercent}%
          </span>
        )}
      </div>
    </div>
  );
}
