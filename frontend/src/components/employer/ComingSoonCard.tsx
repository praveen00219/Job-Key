import type { LucideIcon } from "lucide-react";

interface ComingSoonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Placeholder content for settings tabs not yet designed in the source Figma file. */
export function ComingSoonCard({ icon: Icon, title, description }: ComingSoonCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-50">
        <Icon className="size-6 text-brand-600" />
      </span>
      <h2 className="text-heading-sm font-semibold text-grey-950">{title}</h2>
      <p className="max-w-[38ch] text-body-sm text-grey-500">{description}</p>
    </div>
  );
}
