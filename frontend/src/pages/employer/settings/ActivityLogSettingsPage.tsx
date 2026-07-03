import { History } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

export default function ActivityLogSettingsPage() {
  return (
    <SettingsPageShell title="Activity Log" subtitle="Audit trail of account and team actions">
      <ComingSoonCard
        icon={History}
        title="Activity log coming soon"
        description="A chronological audit trail of logins, vacancy changes, and team member actions will appear here."
      />
    </SettingsPageShell>
  );
}
