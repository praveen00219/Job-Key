import type { LucideIcon } from "lucide-react";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
}

/** Generic placeholder for top-nav destinations not yet built (Vacancies, Bids, Offers, …). */
export function ComingSoonPage({ title, subtitle, icon, description }: ComingSoonPageProps) {
  return (
    <EmployerLayout hero={<EmployerHero><PageBannerTitle title={title} subtitle={subtitle} /></EmployerHero>}>
      <ComingSoonCard icon={icon} title={`${title} coming soon`} description={description} />
    </EmployerLayout>
  );
}
