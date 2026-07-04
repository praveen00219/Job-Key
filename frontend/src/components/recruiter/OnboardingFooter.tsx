import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface OnboardingFooterProps {
  showBack?: boolean;
  onBack?: () => void;
  onCancel: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

/** Back / Cancel / Continue row shared by every onboarding step. */
export function OnboardingFooter({ showBack = true, onBack, onCancel, onContinue, continueLabel = "Continue" }: OnboardingFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-grey-100 pt-5">
      {showBack ? (
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-body-sm font-medium text-grey-700 hover:text-grey-900">
          <ArrowLeft className="size-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="md" className="bg-grey-950 hover:bg-grey-800" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
