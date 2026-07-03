import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthHeadingProps {
  title: string;
  subtitle?: ReactNode;
  className?: string;
}

/** Centred title + supporting text used at the top of each auth screen. */
export function AuthHeading({ title, subtitle, className }: AuthHeadingProps) {
  return (
    <div className={cn("text-center", className)}>
      <h1 className="text-heading-xl font-semibold text-grey-900">{title}</h1>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-[38ch] text-body-md text-grey-600">{subtitle}</p>
      )}
    </div>
  );
}
