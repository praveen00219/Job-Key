import { useState } from "react";
import { ChevronDown, GripVertical, Pencil, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleSwitch } from "@/components/employer/ToggleSwitch";
import { cn } from "@/lib/utils";
import type { QuestionType, ScreeningQuestion } from "@/lib/vacancyWizard";
import { WizardFooter } from "./WizardFooter";

const MAX_QUESTIONS = 5;
const QUESTION_TYPES: QuestionType[] = ["Text", "Yes/No", "Number", "Multiple Choice"];

const SUGGESTIONS: Omit<ScreeningQuestion, "id">[] = [
  { text: "Are you willing to relocate for this position?", type: "Yes/No", required: false, knockout: true },
  { text: "Are you willing to relocate for this position?", type: "Text", required: false, knockout: false },
  { text: "Are you willing to relocate for this position?", type: "Number", required: false, knockout: true },
];

function QuestionBadges({ q }: { q: Pick<ScreeningQuestion, "type" | "required" | "knockout"> }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-body-xs font-medium text-brand-700">{q.type}</span>
      {q.knockout && (
        <span className="rounded-full bg-warning-50 px-2 py-0.5 text-body-xs font-medium text-warning-700">
          Knockout
        </span>
      )}
      {q.required && !q.knockout && (
        <span className="rounded-full bg-grey-100 px-2 py-0.5 text-body-xs font-medium text-grey-600">Required</span>
      )}
    </div>
  );
}

interface ScreeningQuestionsStepProps {
  questions: ScreeningQuestion[];
  onChange: (questions: ScreeningQuestion[]) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onContinue: () => void;
}

export function ScreeningQuestionsStep({
  questions,
  onChange,
  onBack,
  onSaveDraft,
  onContinue,
}: ScreeningQuestionsStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [draftType, setDraftType] = useState<QuestionType>("Text");
  const [draftRequired, setDraftRequired] = useState(false);
  const [draftKnockout, setDraftKnockout] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const startNew = () => {
    setEditingId(null);
    setDraftText("");
    setDraftType("Text");
    setDraftRequired(false);
    setDraftKnockout(false);
    setShowForm(true);
  };

  const save = () => {
    if (!draftText.trim()) return;
    if (editingId) {
      onChange(
        questions.map((q) =>
          q.id === editingId ? { ...q, text: draftText, type: draftType, required: draftRequired, knockout: draftKnockout } : q
        )
      );
    } else if (questions.length < MAX_QUESTIONS) {
      onChange([
        ...questions,
        { id: crypto.randomUUID(), text: draftText, type: draftType, required: draftRequired, knockout: draftKnockout },
      ]);
    }
    setShowForm(false);
  };

  const addSuggestion = (s: Omit<ScreeningQuestion, "id">) => {
    if (questions.length >= MAX_QUESTIONS) return;
    onChange([...questions, { ...s, id: crypto.randomUUID() }]);
  };

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Screening Questions</h1>
      <p className="mt-1 text-body-sm text-grey-600">
        Up to {MAX_QUESTIONS} questions. Knockout questions auto-reject unqualified candidates.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-lg bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-sm font-semibold text-grey-950">Your Questions</h2>
              <span className="text-body-sm text-grey-500">
                {questions.length}/{MAX_QUESTIONS} questions
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="flex items-start gap-2 rounded-md bg-grey-50 p-3">
                  <GripVertical className="mt-0.5 size-4 shrink-0 text-grey-400" />
                  <div className="flex-1">
                    <p className="text-body-sm text-grey-900">{q.text}</p>
                    <QuestionBadges q={q} />
                  </div>
                  <button
                    type="button"
                    aria-label="Edit question"
                    onClick={() => {
                      setEditingId(q.id);
                      setDraftText(q.text);
                      setDraftType(q.type);
                      setDraftRequired(q.required);
                      setDraftKnockout(q.knockout);
                      setShowForm(true);
                    }}
                    className="text-grey-400 hover:text-grey-700"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete question"
                    onClick={() => onChange(questions.filter((x) => x.id !== q.id))}
                    className="text-danger-400 hover:text-danger-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            {showForm ? (
              <div className="mt-4 space-y-4 rounded-md border border-grey-200 p-4">
                <div className="space-y-1.5">
                  <Label htmlFor="questionText">Question Text</Label>
                  <Input
                    id="questionText"
                    placeholder="Enter your screening question"
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Question Type</Label>
                  <div className="relative">
                    <select
                      value={draftType}
                      onChange={(e) => setDraftType(e.target.value as QuestionType)}
                      className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
                  </div>
                </div>
                {draftType === "Text" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="charLimit">Character Limit</Label>
                    <Input id="charLimit" defaultValue="250" />
                    <p className="text-body-xs text-grey-500">Maximum characters allowed</p>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-6 border-t border-grey-100 pt-4">
                  <label className="flex items-center gap-2.5">
                    <ToggleSwitch checked={draftRequired} onCheckedChange={setDraftRequired} />
                    <span className="text-body-sm text-grey-700">Required question</span>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <ToggleSwitch checked={draftKnockout} onCheckedChange={setDraftKnockout} />
                    <span className="text-body-sm text-grey-700">Enable Knockout</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="button" size="sm" className="bg-grey-950 hover:bg-grey-800" onClick={save}>
                    Save Question
                  </Button>
                </div>
              </div>
            ) : (
              questions.length < MAX_QUESTIONS && (
                <button
                  type="button"
                  onClick={startNew}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-grey-300 py-3 text-body-sm font-medium text-grey-600 hover:bg-grey-50"
                >
                  <Plus className="size-4" />
                  Add Question
                </button>
              )
            )}
          </div>

          <div className="mt-4 rounded-lg bg-white p-4">
            <button
              type="button"
              onClick={() => setShowAccordion((v) => !v)}
              className="flex w-full items-center justify-between text-body-sm font-medium text-grey-800"
            >
              Understanding Knockout Questions
              <ChevronDown className={cn("size-4 transition-transform", showAccordion && "rotate-180")} />
            </button>
            {showAccordion && (
              <p className="mt-2 text-body-sm text-grey-500">
                Candidates who fail a knockout question are automatically rejected and won&rsquo;t appear in your
                pipeline. Use them for hard requirements like work authorization.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4">
          <h2 className="text-body-sm font-medium text-grey-800">Import from Previous Vacancy</h2>
          <select className="mt-2 h-10 w-full rounded-md border border-grey-200 bg-white px-3 text-body-sm text-grey-500 shadow-xs">
            <option>Select a vacancy…</option>
          </select>

          <p className="mb-2 mt-5 text-body-sm font-medium text-grey-800">Suggestions</p>
          <div className="space-y-3">
            {SUGGESTIONS.map((s, i) => (
              <div key={i} className="rounded-md border border-grey-200 p-3">
                <p className="text-body-sm text-grey-900">{s.text}</p>
                <QuestionBadges q={s} />
                <button
                  type="button"
                  disabled={questions.length >= MAX_QUESTIONS}
                  onClick={() => addSuggestion(s)}
                  className="mt-2 w-full rounded-md border border-grey-200 py-1.5 text-body-xs font-medium text-grey-700 hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <WizardFooter onBack={onBack} onSaveDraft={onSaveDraft} onContinue={onContinue} />
      </div>
    </div>
  );
}
