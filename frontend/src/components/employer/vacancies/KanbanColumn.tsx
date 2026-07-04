import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { KanbanCandidate, KanbanColumnData } from "@/lib/mockVacancyData";
import { CandidateCard } from "./CandidateCard";

interface KanbanColumnProps {
  column: KanbanColumnData;
  onOpenCandidate: (candidate: KanbanCandidate) => void;
}

export function KanbanColumn({ column, onOpenCandidate }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex w-full shrink-0 flex-col rounded-lg bg-grey-50 p-3 sm:w-[280px]">
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="flex items-center gap-2 text-body-sm font-semibold text-grey-900">
          {column.label}
          <span className="rounded-full bg-white px-2 py-0.5 text-body-xs text-grey-600">
            {column.totalCount}
          </span>
        </span>
        <button type="button" className="text-body-xs font-medium text-brand-600 hover:text-brand-700">
          View All
        </button>
      </div>

      <div ref={setNodeRef} className="min-h-[80px] flex-1 space-y-2">
        <SortableContext items={column.candidates.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {column.candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} onOpen={onOpenCandidate} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
