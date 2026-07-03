import { Users } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { ComingSoonCard } from "@/components/employer/ComingSoonCard";

export default function TeamSettingsPage() {
  return (
    <SettingsPageShell title="Team Members" subtitle="Manage who has access to your account">
      <ComingSoonCard
        icon={Users}
        title="Team management coming soon"
        description="Invite teammates by email, assign Admin/Hiring Manager/Viewer roles, and manage pending invitations here."
      />
    </SettingsPageShell>
  );
}
