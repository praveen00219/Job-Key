import { BadgeCheck, Briefcase, FileText, Users } from "lucide-react";

import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterHero, RecruiterPageTitle } from "@/components/recruiter/RecruiterHero";
import { TierJourney } from "@/components/recruiter/TierJourney";

const STATS = [
  { icon: Users, value: "12", label: "Team Members", sublabel: "3 active" },
  { icon: Briefcase, value: "43", label: "Total Placements", sublabel: "+04 this month" },
  { icon: FileText, value: "£8,500", label: "Total Revenue", sublabel: "+15% last month" },
  { icon: Users, value: "12", label: "Active Submissions", sublabel: "In employer pipeline" },
];

export default function RecruiterDashboardPage() {
  return (
    <RecruiterLayout
      hero={
        <RecruiterHero>
          <RecruiterPageTitle title="Good morning, Sarah" subtitle="Here's what's happening with your recruitment activity." />
        </RecruiterHero>
      }
    >
      <div className="space-y-6">
        <section className="rounded-lg bg-white p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-11 place-items-center rounded-full bg-orange-100 text-orange-600">
              <BadgeCheck className="size-5" />
            </span>
            <div>
              <p className="text-body-md font-semibold text-grey-950">TechRecruit Solutions</p>
              <span className="rounded-full bg-success-50 px-2 py-0.5 text-body-xs font-medium text-success-600">Verified</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 rounded-md bg-grey-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-heading-md font-semibold text-grey-950">{s.value}</p>
                  <s.icon className="size-4 text-grey-400" />
                </div>
                <p className="mt-1 text-body-sm text-grey-700">{s.label}</p>
                <p className="text-body-xs text-grey-500">{s.sublabel}</p>
              </div>
            ))}
          </div>
        </section>

        <TierJourney />
      </div>
    </RecruiterLayout>
  );
}
