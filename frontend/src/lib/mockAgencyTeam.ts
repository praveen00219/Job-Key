export interface TopPerformer {
  rank: number;
  name: string;
  role: string;
  placements: number;
  revenue: string;
  growthPct: number;
}

export const topPerformers: TopPerformer[] = [
  { rank: 1, name: "Annette Black", role: "Manager", placements: 8, revenue: "£2,400", growthPct: 25 },
  { rank: 2, name: "Priya Sharma", role: "Manager", placements: 6, revenue: "£1,800", growthPct: 15 },
  { rank: 3, name: "Rahul Verma", role: "Manager", placements: 2, revenue: "£1,500", growthPct: 12 },
];

export interface AgencyTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  placements: number;
  earned: string;
}

export const agencyTeamMembers: AgencyTeamMember[] = [
  { id: "1", name: "Annette Black", role: "Recruiter", email: "annette@techrecruit.com", placements: 24, earned: "£6,100" },
  { id: "2", name: "Priya Sharma", role: "Recruiter", email: "priya@techrecruit.com", placements: 18, earned: "£4,300" },
  { id: "3", name: "Rahul Verma", role: "Recruiter", email: "rahul@techrecruit.com", placements: 12, earned: "£2,900" },
  { id: "4", name: "Aisha Khan", role: "Recruiter", email: "aisha@techrecruit.com", placements: 9, earned: "£2,100" },
];

export interface PendingInvitation {
  id: string;
  name: string;
  role: string;
  email: string;
  sentAgo: string;
}

export const pendingInvitations: PendingInvitation[] = [
  { id: "1", name: "James Carter", role: "Recruiter", email: "james@techrecruit.com", sentAgo: "2 days ago" },
  { id: "2", name: "Nadia Ali", role: "Recruiter", email: "nadia@techrecruit.com", sentAgo: "4 days ago" },
];

export const teamPerformanceStats = [
  { value: "247", label: "Total Placements" },
  { value: "£54,400", label: "Total Revenue" },
  { value: "18", suffix: "Days", label: "Avg Time to Place" },
  { value: "14.7%", label: "Success Rate" },
];
