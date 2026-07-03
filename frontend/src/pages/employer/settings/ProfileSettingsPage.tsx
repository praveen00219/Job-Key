import { Building2 } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

export default function ProfileSettingsPage() {
  return (
    <SettingsPageShell title="Company Profile" subtitle="Manage your company's public information">
      <ComingSoonCard
        icon={Building2}
        title="Company profile editor coming soon"
        description="Name, industry, logo, description, culture, and photo gallery will be editable here in a future update."
      />
    </SettingsPageShell>
  );
}
