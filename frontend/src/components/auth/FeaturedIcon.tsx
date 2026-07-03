import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "success" | "warning";

interface FeaturedIconProps {
  icon: LucideIcon;
  tone?: Tone;
  /** Softly animate the outer rings (used on loading/success states). */
  pulse?: boolean;
  className?: string;
}

const toneStyles: Record<Tone, { ring: string; core: string; icon: string }> = {
  success: {
    ring: "border-brand-200/60",
    core: "border-brand-200 bg-white",
    icon: "text-brand-500",
  },
  warning: {
    ring: "border-warning-200/70",
    core: "border-warning-200 bg-white",
    icon: "text-warning-500",
  },
};

/**
 * Circular status badge with faint concentric rings and a centred icon.
 * Recreated from the Figma "Featured icon outline" component used on the
 * success / expired / locked auth screens.
 */
export function FeaturedIcon({
  icon: Icon,
  tone = "success",
  pulse = false,
  className,
}: FeaturedIconProps) {
  const t = toneStyles[tone];
  return (
    <div className={cn("relative grid size-[120px] place-items-center", className)}>
      {/* concentric rings */}
      <span
        className={cn(
          "absolute size-[120px] rounded-full border",
          t.ring,
          pulse && "animate-ring-pulse"
        )}
      />
      <span
        className={cn(
          "absolute size-[88px] rounded-full border",
          t.ring,
          pulse && "animate-ring-pulse [animation-delay:200ms]"
        )}
      />
      {/* core */}
      <span
        className={cn(
          "relative grid size-[60px] place-items-center rounded-full border shadow-xs",
          t.core
        )}
      >
        <Icon className={cn("size-7", t.icon)} strokeWidth={2.2} />
      </span>
    </div>
  );
}
