import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

const TABS = [
  { label: "Profile", to: ROUTES.settingsProfile },
  { label: "Team", to: ROUTES.settingsTeam },
  { label: "Benefits", to: ROUTES.settingsBenefits },
  { label: "Billing", to: ROUTES.settingsBilling },
  { label: "Notifications", to: ROUTES.settingsNotifications },
  { label: "Security", to: ROUTES.settingsSecurity },
  { label: "Activity Log", to: ROUTES.settingsActivityLog },
  { label: "Data & Privacy", to: ROUTES.settingsDataPrivacy },
] as const;

/** Left tab rail for the Settings section (Profile/Team/Benefits/Billing/…). */
export function SettingsTabRail() {
  return (
    <nav className="w-full shrink-0 rounded-lg bg-white p-4 lg:w-[314px]">
      <ul className="space-y-0.5">
        {TABS.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "block rounded-md px-3 py-2.5 text-body-md transition-colors",
                  isActive
                    ? "bg-brand-50 font-semibold text-grey-950"
                    : "font-medium text-grey-800 hover:bg-grey-50"
                )
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
