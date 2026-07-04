import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BannerHexDecor } from "@/components/employer/BannerHexDecor";
import { RecruiterTopNav } from "./RecruiterTopNav";

/** Orange hero region behind the top nav, shared by every Recruiter/Agency page. */
export function RecruiterHero({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-orange-200">
      <BannerHexDecor className="pointer-events-none absolute right-0 top-0" />
      <RecruiterTopNav />
      <div className="relative px-5 pb-9 sm:px-8 lg:px-14">{children}</div>
    </div>
  );
}

interface RecruiterPageTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function RecruiterPageTitle({ title, subtitle, actions, className }: RecruiterPageTitleProps) {
  return (
    <div className={cn("flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="font-heading text-[26px] font-semibold leading-[1.27] text-grey-950 sm:text-[30px]">{title}</h1>
        {subtitle && <p className="mt-1 text-body-md text-grey-950">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
