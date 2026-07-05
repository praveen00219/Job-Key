export interface CrmCandidate {
  id: string;
  name: string;
  avatarColor: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  skills: string[];
  extraSkills: number;
  source: "Referral" | "LinkedIn" | "Direct" | "CV Upload";
  lastContact: string;
  activeSubmissions: number;
  matchPct: number;
  status?: "Screened" | "Shortlisted" | "Interviewed" | "Offered" | "Hired";
  experienceYears: number;
  email: string;
  phone: string;
  salaryExpectation: string;
  noticePeriod: string;
  jobTypes: string;
  preferredLocation: string;
  summary: string;
}

const SUMMARY =
  "Brings strong creative problem-solving and technical expertise in modern tooling — skills that directly support identifying usability gaps and testing product flows. A structured, detail-oriented mindset with proven experience managing projects and collaborating across teams; well-positioned to ensure product quality and contribute to a seamless user experience.";

export const crmCandidates: CrmCandidate[] = [
  {
    id: "annette-black",
    name: "Annette Black",
    avatarColor: "bg-orange-100",
    currentRole: "Senior Engineer",
    currentCompany: "DataCorp",
    location: "London, UK",
    skills: ["Python", "AWS"],
    extraSkills: 2,
    source: "Referral",
    lastContact: "2 days ago",
    activeSubmissions: 2,
    matchPct: 86,
    status: "Screened",
    experienceYears: 8,
    email: "annette.black@samplecandidate.com",
    phone: "+44 7700 900101",
    salaryExpectation: "£75,000 - £85,000",
    noticePeriod: "1 month notice",
    jobTypes: "Full-time, Contract",
    preferredLocation: "London, Remote OK",
    summary: SUMMARY,
  },
  {
    id: "darlene-robertson",
    name: "Darlene Robertson",
    avatarColor: "bg-brand-100",
    currentRole: "Product Manager",
    currentCompany: "Stellaris Inc.",
    location: "Tokyo, Japan",
    skills: ["Java", "GCP"],
    extraSkills: 1,
    source: "LinkedIn",
    lastContact: "2 days ago",
    activeSubmissions: 2,
    matchPct: 90,
    status: "Shortlisted",
    experienceYears: 5,
    email: "darlene.r@samplecandidate.com",
    phone: "+44 7700 900102",
    salaryExpectation: "£65,000 - £75,000",
    noticePeriod: "2 weeks notice",
    jobTypes: "Full-time",
    preferredLocation: "Remote",
    summary: SUMMARY,
  },
  {
    id: "leslie-alexander",
    name: "Leslie Alexander",
    avatarColor: "bg-success-50",
    currentRole: "Data Analyst",
    currentCompany: "Insight Labs",
    location: "Sydney, Australia",
    skills: ["C#", "DigitalOcean"],
    extraSkills: 4,
    source: "Direct",
    lastContact: "4 days ago",
    activeSubmissions: 1,
    matchPct: 75,
    status: "Interviewed",
    experienceYears: 6,
    email: "leslie.a@samplecandidate.com",
    phone: "+44 7700 900103",
    salaryExpectation: "£55,000 - £65,000",
    noticePeriod: "1 month notice",
    jobTypes: "Full-time, Part-time",
    preferredLocation: "Sydney, Remote OK",
    summary: SUMMARY,
  },
  {
    id: "wade-warren",
    name: "Wade Warren",
    avatarColor: "bg-warning-50",
    currentRole: "UX Designer",
    currentCompany: "UserFirst",
    location: "Berlin, Germany",
    skills: ["Ruby", "IBM Cloud"],
    extraSkills: 2,
    source: "CV Upload",
    lastContact: "1 week ago",
    activeSubmissions: 1,
    matchPct: 82,
    status: "Offered",
    experienceYears: 7,
    email: "wade.w@samplecandidate.com",
    phone: "+44 7700 900104",
    salaryExpectation: "£70,000 - £80,000",
    noticePeriod: "6 weeks notice",
    jobTypes: "Full-time",
    preferredLocation: "Berlin, Hybrid",
    summary: SUMMARY,
  },
  {
    id: "guy-hawkins",
    name: "Guy Hawkins",
    avatarColor: "bg-pink-50",
    currentRole: "QA Tester",
    currentCompany: "QualityWorks",
    location: "Toronto, Canada",
    skills: ["Go", "Heroku"],
    extraSkills: 5,
    source: "Referral",
    lastContact: "2 weeks ago",
    activeSubmissions: 0,
    matchPct: 88,
    status: "Hired",
    experienceYears: 8,
    email: "guy.h@samplecandidate.com",
    phone: "+44 7700 900105",
    salaryExpectation: "£60,000 - £70,000",
    noticePeriod: "Immediate",
    jobTypes: "Contract",
    preferredLocation: "Remote only",
    summary: SUMMARY,
  },
  {
    id: "kathryn-murphy",
    name: "Kathryn Murphy",
    avatarColor: "bg-orange-100",
    currentRole: "DevOps Engineer",
    currentCompany: "CloudNine",
    location: "Paris, France",
    skills: ["PHP", "Oracle Cloud"],
    extraSkills: 1,
    source: "LinkedIn",
    lastContact: "3 weeks ago",
    activeSubmissions: 0,
    matchPct: 93,
    experienceYears: 9,
    email: "kathryn.m@samplecandidate.com",
    phone: "+44 7700 900106",
    salaryExpectation: "£80,000 - £90,000",
    noticePeriod: "2 months notice",
    jobTypes: "Full-time",
    preferredLocation: "Paris, Remote OK",
    summary: SUMMARY,
  },
  {
    id: "eleanor-pena",
    name: "Eleanor Pena",
    avatarColor: "bg-brand-100",
    currentRole: "Software Architect",
    currentCompany: "BuildRight",
    location: "Madrid, Spain",
    skills: ["Swift", "Alibaba Cloud"],
    extraSkills: 3,
    source: "Direct",
    lastContact: "1 month ago",
    activeSubmissions: 1,
    matchPct: 79,
    experienceYears: 10,
    email: "eleanor.p@samplecandidate.com",
    phone: "+44 7700 900107",
    salaryExpectation: "£90,000 - £100,000",
    noticePeriod: "1 month notice",
    jobTypes: "Full-time, Contract",
    preferredLocation: "Madrid, Hybrid",
    summary: SUMMARY,
  },
];

export interface CategoryGroup {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const categoryGroups: CategoryGroup[] = [
  { id: "frontend", name: "Frontend Engineers", color: "bg-brand-100 text-brand-700", count: 12 },
  { id: "design", name: "Product Designers", color: "bg-pink-50 text-pink-300", count: 8 },
  { id: "leadership", name: "Engineering Leaders", color: "bg-orange-100 text-orange-700", count: 5 },
  { id: "data", name: "Data & Analytics", color: "bg-success-50 text-success-600", count: 9 },
];

export type SubmissionTrackerStatus = "Interview" | "Pending" | "Rejected" | "Offer" | "Placed";

export interface SubmissionRow {
  id: string;
  candidateName: string;
  avatarColor: string;
  vacancyTitle: string;
  vacancyCompany: string;
  submittedDate: string;
  commissionPct: number;
  potential: string;
  status: SubmissionTrackerStatus;
  daysInStage: number;
}

export const submissionRows: SubmissionRow[] = [
  {
    id: "1",
    candidateName: "James Chen",
    avatarColor: "bg-orange-100",
    vacancyTitle: "Senior Developer",
    vacancyCompany: "TechCorp",
    submittedDate: "12 Mar 2024",
    commissionPct: 15,
    potential: "£9,600",
    status: "Interview",
    daysInStage: 11,
  },
  {
    id: "2",
    candidateName: "Jacob Jones",
    avatarColor: "bg-brand-100",
    vacancyTitle: "Product Manager",
    vacancyCompany: "Stellaris Inc.",
    submittedDate: "22 Feb 2024",
    commissionPct: 15,
    potential: "£8,700",
    status: "Interview",
    daysInStage: 14,
  },
  {
    id: "3",
    candidateName: "Arlene McCoy",
    avatarColor: "bg-pink-50",
    vacancyTitle: "Financial Analyst",
    vacancyCompany: "NovaTech Solutions",
    submittedDate: "01 Jan 2024",
    commissionPct: 12,
    potential: "£11,200",
    status: "Pending",
    daysInStage: 2,
  },
  {
    id: "4",
    candidateName: "Robert Fox",
    avatarColor: "bg-success-50",
    vacancyTitle: "Marketing Lead",
    vacancyCompany: "Apex Systems",
    submittedDate: "15 Dec 2023",
    commissionPct: 18,
    potential: "£14,900",
    status: "Pending",
    daysInStage: 28,
  },
  {
    id: "5",
    candidateName: "Courtney Henry",
    avatarColor: "bg-warning-50",
    vacancyTitle: "Sales Director",
    vacancyCompany: "Zenith Dynamics",
    submittedDate: "08 Nov 2023",
    commissionPct: 25,
    potential: "£7,300",
    status: "Interview",
    daysInStage: 17,
  },
  {
    id: "6",
    candidateName: "Ralph Edwards",
    avatarColor: "bg-orange-100",
    vacancyTitle: "Data Scientist",
    vacancyCompany: "Orion Industries",
    submittedDate: "19 Oct 2023",
    commissionPct: 10,
    potential: "£12,500",
    status: "Rejected",
    daysInStage: 3,
  },
  {
    id: "7",
    candidateName: "Theresa Webb",
    avatarColor: "bg-brand-100",
    vacancyTitle: "UX Designer",
    vacancyCompany: "Quantum Leap Corp",
    submittedDate: "29 Sep 2023",
    commissionPct: 22,
    potential: "£10,400",
    status: "Offer",
    daysInStage: 19,
  },
  {
    id: "8",
    candidateName: "Jerome Bell",
    avatarColor: "bg-pink-50",
    vacancyTitle: "Project Manager",
    vacancyCompany: "Binary Stream Tech",
    submittedDate: "03 Aug 2023",
    commissionPct: 17,
    potential: "£13,800",
    status: "Offer",
    daysInStage: 25,
  },
  {
    id: "9",
    candidateName: "Jenny Wilson",
    avatarColor: "bg-success-50",
    vacancyTitle: "Business Analyst",
    vacancyCompany: "Celestial Innovations",
    submittedDate: "14 Jul 2023",
    commissionPct: 28,
    potential: "£9,100",
    status: "Placed",
    daysInStage: 1,
  },
];
