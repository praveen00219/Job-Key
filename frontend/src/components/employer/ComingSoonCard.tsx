import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ComingSoonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** "blue" for Employer surfaces (default), "orange" for Recruiter/Agency. */
  tone?: "blue" | "orange";
}

const TONE_CLASSES = {
  blue: { bg: "bg-brand-50", icon: "text-brand-600" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600" },
};

/** Placeholder content for tabs not yet designed in the source Figma file. */
export function ComingSoonCard({ icon: Icon, title, description, tone = "blue" }: ComingSoonCardProps) {
  const t = TONE_CLASSES[tone];
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-12 text-center">
      <span className={cn("grid size-12 place-items-center rounded-full", t.bg)}>
        <Icon className={cn("size-6", t.icon)} />
      </span>
      <h2 className="text-heading-sm font-semibold text-grey-950">{title}</h2>
      <p className="max-w-[38ch] text-body-sm text-grey-500">{description}</p>
    </div>
  );
}
