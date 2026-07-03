import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { JobKeyLogo } from "./JobKeyLogo";
import { HexagonBackground } from "./HexagonBackground";

interface AuthLayoutProps {
  children: ReactNode;
  /** Widen the content column (used by the longer "check your email" screens). */
  wide?: boolean;
}

/**
 * Shared shell for every authentication screen: light-grey page, honeycomb
 * corner watermarks, centred JobKey logo at the top and a centred content
 * column below.
 */
export function AuthLayout({ children, wide = false }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-grey-100 px-5 py-10 sm:py-14">
      <HexagonBackground />

      <header className="relative z-10 mb-10 flex justify-center sm:mb-14">
        <JobKeyLogo />
      </header>

      <main
        className={cn(
          "relative z-10 mx-auto w-full",
          wide ? "max-w-[540px]" : "max-w-[460px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
