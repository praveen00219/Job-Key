import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/lib/vacancyWizard";

interface VacancyStepperProps {
  currentStep: number;
}

/** 5-step progress header for the vacancy creation wizard. */
export function VacancyStepper({ currentStep }: VacancyStepperProps) {
  return (
    <div className="flex items-start gap-2 overflow-x-auto pb-1 pt-4">
      {WIZARD_STEPS.map((step, i) => {
        const state = i < currentStep ? "done" : i === currentStep ? "active" : "upcoming";
        return (
          <div key={step.id} className="flex min-w-[130px] flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === 0 ? "invisible" : state === "upcoming" ? "bg-white/50" : "bg-brand-600"
                )}
              />
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border-2 bg-white",
                  state === "done" && "border-brand-500 bg-brand-500",
                  state === "active" && "border-brand-500",
                  state === "upcoming" && "border-white/70"
                )}
              >
                {state === "done" ? (
                  <Check className="size-3.5 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      state === "active" ? "bg-brand-500" : "bg-transparent"
                    )}
                  />
                )}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === WIZARD_STEPS.length - 1
                    ? "invisible"
                    : state === "done"
                    ? "bg-brand-600"
                    : "bg-white/50"
                )}
              />
            </div>
            <span
              className={cn(
                "max-w-full truncate text-body-sm",
                state === "upcoming" ? "text-grey-600" : "font-medium text-grey-950"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
