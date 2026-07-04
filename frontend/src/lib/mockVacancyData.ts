export type VacancyStatus = "Active" | "Paused" | "Draft" | "Closed";

export interface VacancyListItem {
  id: string;
  title: string;
  department: string;
  status: VacancyStatus;
  applications: number;
  location: string;
  postedDate: string;
}

export const vacancyList: VacancyListItem[] = [
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    department: "Design",
    status: "Active",
    applications: 57,
    location: "New York, NY / Remote (US)",
    postedDate: "12 Jun 2026",
  },
  {
    id: "engineering-manager",
    title: "Engineering Manager",
    department: "Engineering",
    status: "Active",
    applications: 32,
    location: "London, UK / Hybrid",
    postedDate: "18 Jun 2026",
  },
  {
    id: "customer-success-lead",
    title: "Customer Success Lead",
    department: "Customer Success",
    status: "Paused",
    applications: 18,
    location: "Remote",
    postedDate: "2 Jun 2026",
  },
];

export type CandidateSource = "Direct" | "Market";

export interface KanbanCandidate {
  id: string;
  name: string;
  avatarColor: string;
  title: string;
  company: string;
  skills: string[];
  extraSkills: number;
  source: CandidateSource;
  daysAgo: number;
  topPercent?: number;
}

export interface KanbanColumnData {
  id: string;
  label: string;
  totalCount: number;
  candidates: KanbanCandidate[];
}

const AVATAR_COLORS = ["bg-brand-200", "bg-pink-50", "bg-orange-50", "bg-success-50", "bg-warning-50"];

function makeCandidate(
  i: number,
  name: string,
  title: string,
  company: string,
  skills: string[],
  extraSkills: number,
  source: CandidateSource,
  daysAgo: number,
  topPercent?: number
): KanbanCandidate {
  return {
    id: `${name.toLowerCase().replace(/\s+/g, "-")}-${i}`,
    name,
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    title,
    company,
    skills,
    extraSkills,
    source,
    daysAgo,
    topPercent,
  };
}

export const kanbanColumns: KanbanColumnData[] = [
  {
    id: "applied",
    label: "Applied",
    totalCount: 23,
    candidates: [
      makeCandidate(1, "Emma Long", "UI/UX Designer, Snap Inc.", "Snap Inc.", ["Sketch", "Illustrator", "Figma"], 5, "Direct", 20, 10),
      makeCandidate(2, "James T. Smith", "Product Designer, Spotify", "Spotify", ["Adobe XD", "InVision", "Figma"], 4, "Market", 20, 10),
      makeCandidate(3, "Sophia Chen", "Lead Designer, Airbnb", "Airbnb", ["Sketch", "Framer", "Figma"], 6, "Direct", 20, 10),
      makeCandidate(4, "David Kim", "Interaction Designer, Google", "Google", ["Sketch", "Framer", "Figma"], 8, "Direct", 20, 10),
      makeCandidate(5, "Olivia Martinez", "Visual Designer, Facebook", "Facebook", ["Adobe XD", "InVision", "Figma"], 7, "Market", 20, 10),
    ],
  },
  {
    id: "screened",
    label: "Screened",
    totalCount: 16,
    candidates: [
      makeCandidate(1, "Kurt Bates", "Visual Designer, Facebook", "Facebook", ["Adobe XD", "InVision", "Figma"], 7, "Direct", 20, 10),
      makeCandidate(2, "James Hall", "UI/UX Designer, Snap Inc.", "Snap Inc.", ["Sketch", "Illustrator", "Figma"], 5, "Direct", 20),
      makeCandidate(3, "Judith Rodriguez", "Design Lead, Uber", "Uber", ["Sketch", "Figma"], 10, "Market", 20, 10),
      makeCandidate(4, "Eddie Lake", "UX Designer, Airbnb", "Airbnb", ["Sketch", "Illustrator", "Figma"], 6, "Direct", 20),
    ],
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    totalCount: 9,
    candidates: [
      makeCandidate(1, "Stephanie Nicol", "Visual Designer, Facebook", "Facebook", ["Adobe XD", "InVision", "Figma"], 7, "Market", 20, 10),
      makeCandidate(2, "Kimberly Mastrang", "Creative Director, Twitter", "Twitter", ["Illustrator", "InVision", "Figma"], 9, "Direct", 20, 10),
      makeCandidate(3, "Kathy Pacheco", "Junior Designer, LinkedIn", "LinkedIn", ["Sketch", "Figma", "Photoshop"], 0, "Market", 20, 10),
    ],
  },
  {
    id: "interviewed",
    label: "Interviewed",
    totalCount: 4,
    candidates: [
      makeCandidate(1, "Paula Mora", "UI/UX Designer, Snap Inc.", "Snap Inc.", ["Sketch", "Illustrator", "Figma"], 5, "Market", 20, 10),
      makeCandidate(2, "Mary Freund", "Product Designer, Spotify", "Spotify", ["Adobe XD", "InVision", "Figma"], 4, "Direct", 20, 10),
    ],
  },
];
