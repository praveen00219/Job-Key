import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EmployerTopNav } from "./EmployerTopNav";
import { BannerHexDecor } from "./BannerHexDecor";

/**
 * Blue hero region behind the top nav, shared by every Employer page
 * (Dashboard, Settings, …). Height follows its content — Settings pages pass
 * just a title/subtitle, the Dashboard passes a taller greeting + stat cards.
 */
export function EmployerHero({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-brand-200">
      <BannerHexDecor className="pointer-events-none absolute right-0 top-0" />
      <EmployerTopNav />
      <div className="relative px-5 pb-9 sm:px-8 lg:px-14">{children}</div>
    </div>
  );
}

interface PageBannerTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

/** Title + subtitle row used inside `EmployerHero` on simple (non-Dashboard) pages. */
export function PageBannerTitle({ title, subtitle, actions, className }: PageBannerTitleProps) {
  return (
    <div className={cn("flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="font-heading text-[26px] font-semibold leading-[1.27] text-grey-950 sm:text-[30px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-body-md text-grey-950">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
