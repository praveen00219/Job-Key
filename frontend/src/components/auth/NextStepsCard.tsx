import { cn } from "@/lib/utils";

interface Step {
  label: string;
  /** Dimmed / not-yet-active step (used on the verify screen). */
  muted?: boolean;
}

interface NextStepsCardProps {
  title: string;
  steps: Step[];
  /** Card style (bordered white) vs. inline (borderless, for the verify screen). */
  variant?: "card" | "inline";
  className?: string;
}

/** Numbered "what happens next" list used on the check-your-email screens. */
export function NextStepsCard({
  title,
  steps,
  variant = "card",
  className,
}: NextStepsCardProps) {
  return (
    <div
      className={cn(
        variant === "card" && "rounded-lg border border-grey-200 bg-white p-5 shadow-xs",
        className
      )}
    >
      <h3 className="text-body-md font-semibold text-grey-900">{title}</h3>
      <ol className="mt-4 space-y-3.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border text-body-xs font-semibold",
                step.muted
                  ? "border-grey-200 text-grey-400"
                  : "border-grey-300 text-grey-700"
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-body-sm",
                step.muted ? "text-grey-400" : "text-grey-700"
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
