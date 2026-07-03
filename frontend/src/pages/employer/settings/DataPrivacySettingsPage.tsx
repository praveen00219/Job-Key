import { Lock } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

export default function DataPrivacySettingsPage() {
  return (
    <SettingsPageShell title="Data & Privacy" subtitle="Control your data retention and GDPR rights">
      <ComingSoonCard
        icon={Lock}
        title="Data & privacy controls coming soon"
        description="Requesting an export of your data or deleting your account will be available from here."
      />
    </SettingsPageShell>
  );
}
