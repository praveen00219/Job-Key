import type { ReactNode } from "react";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { SettingsTabRail } from "@/components/employer/SettingsTabRail";

interface SettingsPageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Shared shell for every Settings tab page: hero title + left tab rail + content column. */
export function SettingsPageShell({ title, subtitle, children }: SettingsPageShellProps) {
  return (
    <EmployerLayout hero={<EmployerHero><PageBannerTitle title={title} subtitle={subtitle} /></EmployerHero>}>
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <SettingsTabRail />
        <div className="w-full min-w-0 flex-1 space-y-6">{children}</div>
      </div>
    </EmployerLayout>
  );
}
