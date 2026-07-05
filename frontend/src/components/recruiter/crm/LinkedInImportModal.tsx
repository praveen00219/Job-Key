import { useState } from "react";
import { CheckCircle2, Linkedin, Loader2, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Stage = "input" | "extracting" | "success" | "duplicate";

interface LinkedInImportModalProps {
  onClose: () => void;
}

/**
 * LinkedIn URL import: paste URL → extracting spinner → prefilled result.
 * A URL containing "duplicate" simulates the duplicate-detection path
 * (same-LinkedIn-URL rule from the PRD).
 */
export function LinkedInImportModal({ onClose }: LinkedInImportModalProps) {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("input");

  const startImport = () => {
    setStage("extracting");
    const isDuplicate = url.toLowerCase().includes("duplicate");
    setTimeout(() => setStage(isDuplicate ? "duplicate" : "success"), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-grey-950/40" />
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between bg-orange-100 p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Import from LinkedIn</h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="text-grey-500 hover:text-grey-800">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          {stage === "input" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="liUrl">LinkedIn Profile URL</Label>
                <div className="relative">
                  <Linkedin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
                  <Input
                    id="liUrl"
                    className="pl-10"
                    placeholder="linkedin.com/in/candidate-profile"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <p className="text-body-xs text-grey-500">
                  We&rsquo;ll fetch the public profile data — name, headline, company, and photo.
                </p>
              </div>
              <Button className="mt-5 w-full bg-grey-950 hover:bg-grey-800" disabled={!url.trim()} onClick={startImport}>
                Import Profile
              </Button>
            </>
          )}

          {stage === "extracting" && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Loader2 className="size-8 animate-spin text-orange-500" />
              <p className="text-body-md font-semibold text-grey-950">Extracting profile…</p>
              <p className="text-body-sm text-grey-500">Pulling public data from LinkedIn</p>
            </div>
          )}

          {stage === "success" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-9 text-success-600" />
              <p className="text-body-md font-semibold text-grey-950">Profile extracted</p>
              <p className="max-w-[38ch] text-body-sm text-grey-500">
                Name, headline, and company were pre-filled. Review and complete the remaining fields to save the
                candidate to your CRM.
              </p>
              <Button className="mt-2 bg-grey-950 hover:bg-grey-800" onClick={onClose}>
                Review &amp; Save
              </Button>
            </div>
          )}

          {stage === "duplicate" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <TriangleAlert className="size-9 text-warning-500" />
              <p className="text-body-md font-semibold text-grey-950">Already in your CRM</p>
              <p className="max-w-[38ch] text-body-sm text-grey-500">
                A candidate with this LinkedIn URL already exists in your database. Open the existing record to see
                previous submissions.
              </p>
              <div className="mt-2 flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="bg-grey-950 hover:bg-grey-800" onClick={onClose}>
                  View Existing Record
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
