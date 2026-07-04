import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import type { KanbanCandidate, KanbanColumnData } from "@/lib/mockVacancyData";
import { CandidateDetailDrawer } from "@/components/employer/candidates/CandidateDetailDrawer";
import { CandidateCard } from "./CandidateCard";
import { KanbanColumn } from "./KanbanColumn";

function findColumnIndex(columns: KanbanColumnData[], id: string) {
  const byColumnId = columns.findIndex((col) => col.id === id);
  if (byColumnId !== -1) return byColumnId;
  return columns.findIndex((col) => col.candidates.some((c) => c.id === id));
}

export function KanbanBoard({ initialColumns }: { initialColumns: KanbanColumnData[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeCandidate, setActiveCandidate] = useState<KanbanCandidate | null>(null);
  const [openCandidate, setOpenCandidate] = useState<KanbanCandidate | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const col = columns[findColumnIndex(columns, id)];
    setActiveCandidate(col?.candidates.find((c) => c.id === id) ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    setColumns((prev) => {
      const activeColIndex = findColumnIndex(prev, activeId);
      const overColIndex = findColumnIndex(prev, overId);
      if (activeColIndex === -1 || overColIndex === -1 || activeColIndex === overColIndex) return prev;

      const activeCol = prev[activeColIndex];
      const overCol = prev[overColIndex];
      const movingCandidate = activeCol.candidates.find((c) => c.id === activeId);
      if (!movingCandidate) return prev;

      const overIndex = overCol.candidates.findIndex((c) => c.id === overId);
      const insertAt = overIndex >= 0 ? overIndex : overCol.candidates.length;

      const next = [...prev];
      next[activeColIndex] = {
        ...activeCol,
        candidates: activeCol.candidates.filter((c) => c.id !== activeId),
      };
      next[overColIndex] = {
        ...overCol,
        candidates: [
          ...overCol.candidates.slice(0, insertAt),
          movingCandidate,
          ...overCol.candidates.slice(insertAt),
        ],
      };
      return next;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCandidate(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    setColumns((prev) => {
      const colIndex = findColumnIndex(prev, activeId);
      if (colIndex === -1) return prev;
      const col = prev[colIndex];
      const oldIndex = col.candidates.findIndex((c) => c.id === activeId);
      const newIndex = col.candidates.findIndex((c) => c.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      const next = [...prev];
      next[colIndex] = { ...col, candidates: arrayMove(col.candidates, oldIndex, newIndex) };
      return next;
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:overflow-x-auto sm:pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} onOpenCandidate={setOpenCandidate} />
        ))}
      </div>
      <DragOverlay>{activeCandidate && <CandidateCard candidate={activeCandidate} overlay />}</DragOverlay>

      {openCandidate && (
        <CandidateDetailDrawer candidate={openCandidate} onClose={() => setOpenCandidate(null)} />
      )}
    </DndContext>
  );
}
