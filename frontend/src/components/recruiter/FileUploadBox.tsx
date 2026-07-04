import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";

interface FileUploadBoxProps {
  label?: string;
  hint: string;
  compact?: boolean;
}

/** Drag-and-drop style upload box (mock — tracks a fake filename, no real upload). */
export function FileUploadBox({ label, hint, compact = false }: FileUploadBoxProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (fileName) {
    return (
      <div className="flex items-center justify-between rounded-md border border-grey-200 p-3">
        <div className="flex items-center gap-2.5">
          <FileText className="size-5 shrink-0 text-danger-500" />
          <span className="text-body-sm text-grey-800">{fileName}</span>
        </div>
        <button type="button" onClick={() => setFileName(null)} aria-label="Remove file" className="text-grey-400 hover:text-danger-500">
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setFileName("document.pdf")}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-grey-300 hover:bg-grey-50 ${
        compact ? "p-4" : "p-8"
      }`}
    >
      <input ref={inputRef} type="file" className="hidden" />
      <span className="grid size-9 place-items-center rounded-full bg-grey-100 text-grey-500">
        <Upload className="size-4" />
      </span>
      {label && <span className="text-body-sm text-grey-600">{label}</span>}
      <span className="text-body-sm text-grey-600">
        <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
      </span>
      <span className="text-body-xs text-grey-400">{hint}</span>
    </button>
  );
}
