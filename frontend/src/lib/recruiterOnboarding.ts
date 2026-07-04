export interface ReferenceEntry {
  id: string;
  name: string;
  company: string;
  email: string;
  relationship: string;
}

export interface RecruiterOnboardingState {
  personalInfo: {
    fullName: string;
    phone: string;
    websiteUrl: string;
    linkedinUrl: string;
    profilePicture: boolean;
    bio: string;
    languages: string[];
  };
  experience: {
    experienceLevel: string;
    specializations: string[];
    roleTypes: string[];
    geographicFocus: string[];
    references: ReferenceEntry[];
  };
  documents: {
    proofOfIdentity: boolean;
  };
}

export const initialRecruiterOnboarding: RecruiterOnboardingState = {
  personalInfo: {
    fullName: "",
    phone: "",
    websiteUrl: "",
    linkedinUrl: "",
    profilePicture: false,
    bio: "",
    languages: [],
  },
  experience: {
    experienceLevel: "",
    specializations: [],
    roleTypes: [],
    geographicFocus: [],
    references: [],
  },
  documents: {
    proofOfIdentity: false,
  },
};

export const RECRUITER_STEPS = [
  { label: "Personal Info", sublabel: "Help us get to know you" },
  { label: "Experience", sublabel: "Showcase your recruitment expertise" },
  { label: "Documents", sublabel: "Verify your professional credentials" },
  { label: "Review", sublabel: "Check everything and submit" },
];

export interface TeamMemberInvite {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter";
  status: "Active" | "Pending";
}

export interface AgencyOnboardingState {
  agencyDetails: {
    agencyName: string;
    registrationNumber: string;
    headquarters: string;
    yearEstablished: string;
    yourRole: string;
    teamSize: string;
    logo: boolean;
    bio: string;
    teamMembers: TeamMemberInvite[];
  };
  documents: {
    proofOfIdentity: boolean;
    companyRegistrationDoc: string | null;
    insuranceCert: boolean;
  };
}

export const initialAgencyOnboarding: AgencyOnboardingState = {
  agencyDetails: {
    agencyName: "",
    registrationNumber: "",
    headquarters: "",
    yearEstablished: "",
    yourRole: "",
    teamSize: "",
    logo: false,
    bio: "",
    teamMembers: [
      { id: "1", name: "Sam Johnson", email: "sam@talenthive.io", role: "Admin", status: "Active" },
      { id: "2", name: "Emily Carter", email: "emily@talenthive.io", role: "Recruiter", status: "Active" },
      { id: "3", name: "Michael Lee", email: "michael@talenthive.io", role: "Recruiter", status: "Pending" },
    ],
  },
  documents: {
    proofOfIdentity: false,
    companyRegistrationDoc: null,
    insuranceCert: false,
  },
};

export const AGENCY_STEPS = [
  { label: "Agency Details", sublabel: "Showcase your recruitment expertise" },
  { label: "Documents", sublabel: "Verify your professional credentials" },
  { label: "Review", sublabel: "Check everything and submit" },
];
