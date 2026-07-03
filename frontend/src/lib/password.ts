/** Individual password requirement shown in the checklist under the field. */
export interface PasswordRule {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { id: "lowercase", label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { id: "number", label: "One number", test: (pw) => /[0-9]/.test(pw) },
  {
    id: "special",
    label: "One special character",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

export type Strength = "empty" | "weak" | "medium" | "strong";

export interface PasswordEvaluation {
  metIds: string[];
  score: number; // number of satisfied rules (0–5)
  strength: Strength;
  percent: number; // fill width for the meter (0–100)
  label: string;
  /** Tailwind text-color class for the strength label. */
  labelClass: string;
  /** Tailwind bg-color class for the meter fill. */
  barClass: string;
  /** All rules satisfied. */
  valid: boolean;
}

export function evaluatePassword(pw: string): PasswordEvaluation {
  const metIds = passwordRules.filter((r) => r.test(pw)).map((r) => r.id);
  const score = metIds.length;

  let strength: Strength = "empty";
  if (pw.length > 0) {
    if (score <= 2) strength = "weak";
    else if (score <= 4) strength = "medium";
    else strength = "strong";
  }

  const map: Record<Strength, { label: string; labelClass: string; barClass: string }> = {
    empty: { label: "", labelClass: "text-grey-400", barClass: "bg-grey-200" },
    weak: { label: "Weak", labelClass: "text-warning-600", barClass: "bg-brand-500" },
    medium: { label: "Medium", labelClass: "text-warning-500", barClass: "bg-warning-500" },
    strong: { label: "Strong", labelClass: "text-success-600", barClass: "bg-success-600" },
  };

  return {
    metIds,
    score,
    strength,
    percent: pw.length === 0 ? 0 : Math.max(12, (score / passwordRules.length) * 100),
    valid: score === passwordRules.length,
    ...map[strength],
  };
}
