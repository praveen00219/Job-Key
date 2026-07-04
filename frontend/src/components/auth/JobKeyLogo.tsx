import { useId } from "react";

import { cn } from "@/lib/utils";

interface JobKeyLogoProps {
  /** Overall height in px (mark scales with it). Wordmark hidden when false. */
  showWordmark?: boolean;
  /** "default" for auth screens (36px mark), "sm" for compact nav bars (24px mark). */
  size?: "default" | "sm";
  /** "blue" for Employer surfaces (default), "orange" for the Recruiter/Agency portal. */
  tone?: "blue" | "orange";
  className?: string;
}

const TONE_HEX = { blue: "#2E90FA", orange: "#EF6C20" } as const;
const TONE_TEXT_CLASS = { blue: "text-brand-600", orange: "text-orange-500" } as const;

/**
 * JobKey brand lockup — a keyhole set inside a hexagon badge (the hexagon
 * echoes the honeycomb corner watermarks) + a two-tone "JobKey" wordmark
 * ("Job" dark, "Key" accent-colored). The accent color follows the active
 * portal: blue for Employer, orange for Recruiter/Agency.
 */
export function JobKeyLogo({ showWordmark = true, size = "default", tone = "blue", className }: JobKeyLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <KeyholeMark tone={tone} className={size === "sm" ? "h-6 w-auto" : "h-9 w-auto"} />
      {showWordmark && (
        <span
          className={cn(
            "font-heading font-bold leading-none tracking-tight",
            size === "sm" ? "text-xl" : "text-[30px]"
          )}
        >
          <span className="text-grey-900">Job</span>
          <span className={TONE_TEXT_CLASS[tone]}>Key</span>
        </span>
      )}
    </div>
  );
}

function KeyholeMark({ tone, className }: { tone: "blue" | "orange"; className?: string }) {
  // Unique id so multiple logo instances on a page don't share a mask.
  const maskId = useId();
  const hexagon = "M20 1L38.19 11.5V32.5L20 43L1.81 32.5V11.5L20 1Z";
  return (
    <svg
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="JobKey"
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="44">
        {/* white = badge shows, black = keyhole is cut through */}
        <path d={hexagon} fill="white" />
        <circle cx="20" cy="17.5" r="5.5" fill="black" />
        <path d="M17 20H23L25 31H15L17 20Z" fill="black" />
      </mask>
      <path d={hexagon} fill={TONE_HEX[tone]} mask={`url(#${maskId})`} />
    </svg>
  );
}
