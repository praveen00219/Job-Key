import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WizardFooterProps {
  showBack?: boolean;
  onBack?: () => void;
  onSaveDraft?: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

/** Back / Save as Draft / Continue row shared by every wizard step. */
export function WizardFooter({
  showBack = true,
  onBack,
  onSaveDraft,
  onContinue,
  continueLabel = "Continue",
}: WizardFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-grey-100 pt-5">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-body-sm font-medium text-grey-700 hover:text-grey-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" size="md" onClick={onSaveDraft}>
          Save as Draft
        </Button>
        <Button type="button" size="md" className="bg-grey-950 hover:bg-grey-800" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
