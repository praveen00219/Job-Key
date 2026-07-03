import { ShieldCheck } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

export default function SecuritySettingsPage() {
  return (
    <SettingsPageShell title="Security" subtitle="Manage password, sessions, and two-factor authentication">
      <ComingSoonCard
        icon={ShieldCheck}
        title="Security settings coming soon"
        description="Password changes, active sessions, and two-factor authentication controls will live here."
      />
    </SettingsPageShell>
  );
}
