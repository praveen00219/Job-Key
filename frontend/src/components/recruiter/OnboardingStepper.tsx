import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { Button } from "@/components/ui/button";

interface Step {
  label: string;
  sublabel: string;
}

interface OnboardingStepperProps {
  eyebrow: string;
  steps: Step[];
  currentStep: number;
  onSaveExit: () => void;
}

/** Orange hero header with step progress for the Recruiter/Agency onboarding wizards. */
export function OnboardingStepper({ eyebrow, steps, currentStep, onSaveExit }: OnboardingStepperProps) {
  return (
    <div className="bg-gradient-to-b from-orange-100 to-orange-50 px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-[900px] items-center justify-between">
        <JobKeyLogo tone="orange" size="sm" />
        <p className="hidden text-body-sm text-grey-600 sm:block">{eyebrow}</p>
        <Button variant="secondary" size="sm" onClick={onSaveExit}>
          Save &amp; Exit
        </Button>
      </div>

      <div className="mx-auto mt-6 flex max-w-[900px] items-start gap-2 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "upcoming";
          return (
            <div key={step.label} className="flex min-w-[130px] flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <span
                  className={cn("h-0.5 flex-1", i === 0 ? "invisible" : state === "upcoming" ? "bg-orange-200" : "bg-orange-500")}
                />
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border-2 bg-white",
                    state === "done" && "border-orange-500 bg-orange-500",
                    state === "active" && "border-orange-500",
                    state === "upcoming" && "border-orange-200"
                  )}
                >
                  {state === "done" ? (
                    <Check className="size-3.5 text-white" strokeWidth={3} />
                  ) : (
                    <span className={cn("size-2 rounded-full", state === "active" ? "bg-orange-500" : "bg-transparent")} />
                  )}
                </span>
                <span
                  className={cn(
                    "h-0.5 flex-1",
                    i === steps.length - 1 ? "invisible" : state === "done" ? "bg-orange-500" : "bg-orange-200"
                  )}
                />
              </div>
              <div className="text-center">
                <p className={cn("max-w-full truncate text-body-sm", state === "upcoming" ? "text-grey-500" : "font-medium text-grey-950")}>
                  {step.label}
                </p>
                <p className="hidden max-w-full truncate text-body-xs text-grey-500 sm:block">{step.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
