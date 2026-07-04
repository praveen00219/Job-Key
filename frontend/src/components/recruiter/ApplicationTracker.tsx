import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface TrackerStep {
  title: string;
  description: string;
  timestamp?: string;
  state: "done" | "current" | "upcoming";
}

export function ApplicationTracker({ steps }: { steps: TrackerStep[] }) {
  return (
    <div className="rounded-lg bg-white p-5">
      <h3 className="text-body-md font-semibold text-grey-900">What happens next</h3>
      <ol className="mt-4 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full",
                step.state === "done" && "bg-success-600 text-white",
                step.state === "current" && "bg-orange-500 text-white",
                step.state === "upcoming" && "border border-grey-300 bg-white text-grey-400"
              )}
            >
              {step.state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
            </span>
            <div>
              <p className={cn("text-body-sm font-medium", step.state === "upcoming" ? "text-grey-400" : "text-grey-900")}>{step.title}</p>
              <p className="text-body-sm text-grey-500">{step.description}</p>
              {step.timestamp && <p className="mt-0.5 text-body-xs text-grey-400">{step.timestamp}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
