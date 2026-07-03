import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { evaluatePassword, passwordRules } from "@/lib/password";

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * Strength bar + label and the two-column requirement checklist shown under
 * the password field on the sign-up / reset screens.
 */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const evaluation = evaluatePassword(password);

  return (
    <div className="mt-3.5">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-grey-800">Password strength</span>
        {evaluation.label && (
          <span className={cn("text-body-sm font-semibold", evaluation.labelClass)}>
            {evaluation.label}
          </span>
        )}
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-grey-200">
        <div
          className={cn("h-full rounded-full transition-all duration-300", evaluation.barClass)}
          style={{ width: `${evaluation.percent}%` }}
        />
      </div>

      <ul className="mt-3.5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const met = evaluation.metIds.includes(rule.id);
          return (
            <li key={rule.id} className="flex items-center gap-2 text-body-sm">
              <span
                className={cn(
                  "grid size-[18px] shrink-0 place-items-center rounded-full transition-colors",
                  met ? "bg-success-600 text-white" : "border border-grey-300 bg-white"
                )}
              >
                {met && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className={met ? "text-grey-700" : "text-grey-500"}>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
