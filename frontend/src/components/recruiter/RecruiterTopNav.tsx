import { useState } from "react";
import { Bell, Menu, Settings, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { JobKeyLogo } from "@/components/auth/JobKeyLogo";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

const NAV_ITEMS = [
  { label: "Dashboard", to: ROUTES.recruiterDashboard },
  { label: "Marketplace", to: "/recruiter/marketplace" },
  { label: "Candidates", to: "/recruiter/candidates" },
  { label: "Submissions", to: "/recruiter/submissions" },
  { label: "Follow-ups", to: "/recruiter/follow-ups" },
  { label: "Earnings", to: "/recruiter/earnings" },
];

/** Shared horizontal top navigation for every authenticated Recruiter/Agency screen. */
export function RecruiterTopNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) => location.pathname.startsWith(to);

  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
      <div className="flex items-center gap-[17px]">
        <JobKeyLogo tone="orange" size="sm" />
        <nav className="hidden items-center gap-1.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2.5 text-body-md font-semibold tracking-[0.16px] transition-colors",
                isActive(item.to) ? "text-grey-900" : "text-grey-600 hover:text-grey-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Settings"
          className="hidden size-10 place-items-center rounded-lg text-grey-600 shadow-xs transition-colors hover:bg-grey-50 hover:text-grey-900 sm:grid"
        >
          <Settings className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="grid size-10 place-items-center rounded-lg text-grey-600 shadow-xs transition-colors hover:bg-grey-50 hover:text-grey-900"
        >
          <Bell className="size-5" />
        </button>
        <div className="ml-1 size-10 shrink-0 overflow-hidden rounded-full bg-orange-100">
          <div className="grid size-full place-items-center text-body-sm font-semibold text-orange-700">SJ</div>
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg text-grey-700 shadow-xs hover:bg-grey-50 lg:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="absolute inset-x-0 top-full z-20 flex flex-col gap-0.5 bg-white p-3 shadow-lg lg:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "rounded-md px-3 py-2.5 text-body-md font-semibold transition-colors",
                isActive(item.to) ? "bg-orange-50 text-grey-900" : "text-grey-600 hover:bg-grey-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
