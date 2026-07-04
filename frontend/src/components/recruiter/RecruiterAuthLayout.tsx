import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { HexagonBackground } from "@/components/auth/HexagonBackground";

interface RecruiterAuthLayoutProps {
  children: ReactNode;
  /** Widen the content column (used by wizard/review screens). */
  wide?: boolean;
}

/**
 * Shared shell for Recruiter/Agency auth & onboarding screens — a warm
 * cream/peach background with orange honeycomb watermarks, distinguishing
 * this portal from the Employer side's blue theme.
 */
export function RecruiterAuthLayout({ children, wide = false }: RecruiterAuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-gradient-to-b from-orange-50 to-white px-5 py-10 sm:py-14">
      <HexagonBackground colorClassName="text-orange-200/70" />

      <header className="relative z-10 mb-10 flex justify-center sm:mb-14">
        <JobKeyLogo tone="orange" />
      </header>

      <main className={cn("relative z-10 mx-auto w-full", wide ? "max-w-[600px]" : "max-w-[460px]")}>
        {children}
      </main>
    </div>
  );
}
