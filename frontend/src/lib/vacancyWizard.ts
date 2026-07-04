export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Temporary" | "Internship";
export type Workplace = "On-site" | "Hybrid" | "Remote";
export type AccessMode = "Open Marketplace" | "Invite Only" | "Tier Restricted";
export type QuestionType = "Yes/No" | "Number" | "Text" | "Multiple Choice";

export interface RoleBasicsData {
  jobTitle: string;
  department: string;
  employmentType: EmploymentType;
  locations: string[];
  workplace: Workplace;
  employeeLocation: string;
}

export interface JobDetailsData {
  description: string;
  requirements: string;
  experienceFrom: number;
  experienceTo: number;
  skills: string[];
}

export interface PipelineSettingsData {
  pipelineName: string;
  payType: string;
  currency: string;
  salaryFrom: number;
  salaryTo: number;
  hideSalary: boolean;
  marketplaceEnabled: boolean;
  accessMode: AccessMode;
}

export interface ScreeningQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  knockout: boolean;
}

export interface VacancyWizardState {
  roleBasics: RoleBasicsData;
  jobDetails: JobDetailsData;
  pipelineSettings: PipelineSettingsData;
  screeningQuestions: ScreeningQuestion[];
}

export const PIPELINE_STAGE_LABELS = ["Sourced", "Applied", "Phone screen", "Shortlist", "Interview", "Offer"];

export const initialWizardState: VacancyWizardState = {
  roleBasics: {
    jobTitle: "",
    department: "",
    employmentType: "Full-time",
    locations: [],
    workplace: "Hybrid",
    employeeLocation: "",
  },
  jobDetails: {
    description: "",
    requirements: "",
    experienceFrom: 3,
    experienceTo: 5,
    skills: [],
  },
  pipelineSettings: {
    pipelineName: "Default",
    payType: "Annually",
    currency: "USD ($)",
    salaryFrom: 80000,
    salaryTo: 100000,
    hideSalary: false,
    marketplaceEnabled: true,
    accessMode: "Open Marketplace",
  },
  screeningQuestions: [],
};

export const WIZARD_STEPS = [
  { id: "role-basics", label: "Role Basics" },
  { id: "job-details", label: "Job Details" },
  { id: "pipeline-settings", label: "Pipeline & Settings" },
  { id: "screening-questions", label: "Screening Questions" },
  { id: "review", label: "Review" },
] as const;
