import { Gift } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

export default function BenefitsSettingsPage() {
  return (
    <SettingsPageShell title="Benefits" subtitle="Showcase the perks candidates get at your company">
      <ComingSoonCard
        icon={Gift}
        title="Benefits editor coming soon"
        description="Health cover, remote policy, equity, and other perks will be editable here and shown on your job postings."
      />
    </SettingsPageShell>
  );
}
