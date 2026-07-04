export interface MarketplaceVacancy {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  location: string;
  employmentType: string;
  experience: string;
  salaryRange: string;
  tags: string[];
  extraTags: number;
  candidatesMatch: number;
  postedAgo: string;
}

export const marketplaceVacancies: MarketplaceVacancy[] = [
  {
    id: "junior-ux-designer",
    title: "Junior UX Designer",
    company: "Google",
    logoColor: "bg-brand-100",
    location: "New York",
    employmentType: "Full-time",
    experience: "1-3 yrs",
    salaryRange: "$75K - $100K",
    tags: ["UI Designer", "User Experience", "Interaction Design"],
    extraTags: 1,
    candidatesMatch: 3,
    postedAgo: "5h ago",
  },
  {
    id: "mid-product-designer",
    title: "Mid-Level Product Designer",
    company: "Amazon",
    logoColor: "bg-warning-50",
    location: "Seattle",
    employmentType: "Full-time",
    experience: "3-5 yrs",
    salaryRange: "$95K - $120K",
    tags: ["Product Design", "User Interface", "Visual Design"],
    extraTags: 2,
    candidatesMatch: 5,
    postedAgo: "2h ago",
  },
  {
    id: "senior-ui-ux-designer",
    title: "Senior UI/UX Designer",
    company: "Facebook",
    logoColor: "bg-brand-100",
    location: "Menlo Park",
    employmentType: "Full-time",
    experience: "5-7 yrs",
    salaryRange: "$120K - $150K",
    tags: ["UX Researcher", "Service Design", "Prototyping"],
    extraTags: 3,
    candidatesMatch: 4,
    postedAgo: "1d ago",
  },
  {
    id: "lead-interaction-designer",
    title: "Lead Interaction Designer",
    company: "Microsoft",
    logoColor: "bg-danger-50",
    location: "Redmond",
    employmentType: "Full-time",
    experience: "7-10 yrs",
    salaryRange: "$150K - $180K",
    tags: ["Interaction Design", "Experience Strategy", "Usability Testing"],
    extraTags: 5,
    candidatesMatch: 2,
    postedAgo: "3d ago",
  },
];

export type WatchlistFilter = "all" | "not-submitted" | "submitted";

export interface WatchlistRow {
  id: string;
  vacancyId: string;
  title: string;
  workplace: string;
  company: string;
  logoColor: string;
  location: string;
  salary: string;
  postedAgo: string;
  mySubmissions: number;
}

export const watchlistRows: WatchlistRow[] = [
  {
    id: "1",
    vacancyId: "senior-software-engineer",
    title: "Senior Software Engineer",
    workplace: "Hybrid",
    company: "Spotify",
    logoColor: "bg-success-50",
    location: "London, UK",
    salary: "£70-90k",
    postedAgo: "5 days ago",
    mySubmissions: 1,
  },
  {
    id: "2",
    vacancyId: "engineering-manager",
    title: "Engineering Manager",
    workplace: "Hybrid",
    company: "Electronic Arts",
    logoColor: "bg-brand-100",
    location: "London, UK",
    salary: "£70-90k",
    postedAgo: "5 days ago",
    mySubmissions: 1,
  },
  {
    id: "3",
    vacancyId: "customer-success-lead",
    title: "Customer Success Lead",
    workplace: "Hybrid",
    company: "Snap Inc",
    logoColor: "bg-warning-50",
    location: "London, UK",
    salary: "£70-90k",
    postedAgo: "5 days ago",
    mySubmissions: 1,
  },
  {
    id: "4",
    vacancyId: "lead-software-engineer",
    title: "Lead Software Engineer",
    workplace: "Hybrid",
    company: "Fitbit",
    logoColor: "bg-brand-100",
    location: "London, UK",
    salary: "£70-90k",
    postedAgo: "5 days ago",
    mySubmissions: 1,
  },
];

export interface VacancyAlert {
  id: string;
  name: string;
  tags: string[];
  delivery: "Immediate" | "Daily Digest";
  matchesThisWeek: number;
  active: boolean;
}

export const vacancyAlerts: VacancyAlert[] = [
  {
    id: "1",
    name: "Senior Tech Roles - London",
    tags: ["Technology", "Senior", "London", "£60k+"],
    delivery: "Immediate",
    matchesThisWeek: 12,
    active: false,
  },
  {
    id: "2",
    name: "Senior Tech Roles - Manchester",
    tags: ["Technology", "Senior", "Manchester", "£55k+"],
    delivery: "Immediate",
    matchesThisWeek: 4,
    active: false,
  },
  {
    id: "3",
    name: "Senior Tech Roles - Remote",
    tags: ["Technology", "Senior", "Remote", "£65k+"],
    delivery: "Immediate",
    matchesThisWeek: 8,
    active: true,
  },
];

export interface AlertMatch {
  id: string;
  alertName: string;
  postedAgo: string;
  title: string;
  company: string;
  workplace: string;
  employmentType: string;
  salary: string;
  commission: string;
}

export const alertMatches: AlertMatch[] = [
  {
    id: "1",
    alertName: "Senior Tech Roles - London",
    postedAgo: "2 hours ago",
    title: "Lead Software Engineer",
    company: "TechCorp",
    workplace: "Hybrid",
    employmentType: "Permanent",
    salary: "£120k-£150k",
    commission: "£15,000",
  },
  {
    id: "2",
    alertName: "Senior Tech Roles - London",
    postedAgo: "2 hours ago",
    title: "Lead Software Engineer",
    company: "TechCorp",
    workplace: "Hybrid",
    employmentType: "Permanent",
    salary: "£120k-£150k",
    commission: "£15,000",
  },
  {
    id: "3",
    alertName: "Senior Tech Roles - London",
    postedAgo: "2 hours ago",
    title: "Lead Software Engineer",
    company: "TechCorp",
    workplace: "Hybrid",
    employmentType: "Permanent",
    salary: "£120k-£150k",
    commission: "£15,000",
  },
];
