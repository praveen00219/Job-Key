import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/** Chip-style multi-value input (used for locations, skills, …). Enter or comma adds a tag. */
export function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft("");
  };

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-md border border-grey-200 bg-grey-100 px-3 py-2 shadow-xs focus-within:ring-4 focus-within:ring-brand-500/15">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-body-sm text-grey-800 shadow-xs"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
            className="text-grey-400 hover:text-grey-700"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : undefined}
        className="min-w-[80px] flex-1 bg-transparent text-body-md text-grey-900 placeholder:text-grey-400 focus:outline-none"
      />
    </div>
  );
}
