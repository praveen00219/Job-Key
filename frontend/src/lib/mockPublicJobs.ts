export interface PublicScreeningQuestion {
  id: string;
  text: string;
  type: "Yes/No" | "Text" | "Number";
  required: boolean;
}

export interface PublicJob {
  slug: string;
  title: string;
  company: string;
  companyMeta: string;
  postedAgo: string;
  employmentType: string;
  workplace: string;
  department: string;
  employeeLocation: string;
  salary: string;
  experience: string;
  location: string;
  description: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  about: string;
  aboutIndustry: string;
  aboutSize: string;
  aboutHq: string;
  aboutWebsite: string;
  screeningQuestions: PublicScreeningQuestion[];
}

export const publicJobs: PublicJob[] = [
  {
    slug: "senior-product-designer-amazon",
    title: "Senior Product Designer",
    company: "Amazon.com, Inc.",
    companyMeta: "51-200 employees · Ecommerce",
    postedAgo: "Posted 2 days ago",
    employmentType: "Full-time",
    workplace: "Remote",
    department: "Design",
    employeeLocation: "United States",
    salary: "$85k - $95k per yr",
    experience: "3-5 years",
    location: "Austin, Texas",
    description: [
      "We are seeking an experienced Senior Product Designer to join our growing design team. You will play a crucial role in designing, developing, and maintaining scalable product experiences that power our platform used by millions of users worldwide.",
      "As a Senior Product Designer, you will work closely with cross-functional teams including product managers, engineers, and other designers to deliver high-quality features. You'll have the opportunity to mentor junior designers, contribute to design-system decisions, and help shape the visual direction of our products.",
    ],
    requirements: [
      "Designing complete brand systems (logo, typography, color palette, etc.)",
      "Creating brand guidelines that ensure design consistency across all platforms",
      "Collaborating with strategists, marketers, and developers to bring brands to life",
      "Presenting concepts to clients and refining based on feedback",
      "Delivering final files in multiple formats optimized for both print and digital use",
      "Maintaining alignment with the brand's tone, vision, and market position",
    ],
    skills: ["Photoshop", "Graphic Design", "Visual Design", "User Experience", "Figma", "Branding", "Prototypes", "User Interface", "Motion Graphics", "Logo Design"],
    benefits: ["Health Insurance", "Life Insurance", "Pension Scheme", "Career Coaching"],
    about:
      "General Dynamics Information Technology solves our customers' challenges through future-focused technology and services, ingenuity and deep mission-knowledge. Partnering with government, defense, the intelligence community, industry leaders and cutting-edge technology companies, we deliver solutions that make a difference — helping our customers to advance mission performance, transform operations and discover opportunities to build a better future.",
    aboutIndustry: "Technology",
    aboutSize: "51–200 employees",
    aboutHq: "London, UK",
    aboutWebsite: "www.amazon.com",
    screeningQuestions: [
      { id: "q1", text: "Do you have the legal right to work in the United States?", type: "Yes/No", required: true },
      { id: "q2", text: "How many years of product design experience do you have?", type: "Number", required: true },
      { id: "q3", text: "Briefly describe a design system you have built or maintained.", type: "Text", required: false },
    ],
  },
  {
    slug: "engineering-manager-spotify",
    title: "Engineering Manager",
    company: "Spotify",
    companyMeta: "1,000+ employees · Music Streaming",
    postedAgo: "Posted 5 days ago",
    employmentType: "Full-time",
    workplace: "Hybrid",
    department: "Engineering",
    employeeLocation: "United Kingdom",
    salary: "£90k - £110k per yr",
    experience: "7-10 years",
    location: "London, UK",
    description: [
      "We're looking for an Engineering Manager to lead one of our platform teams, balancing hands-on technical guidance with people leadership across a team of 8-12 engineers.",
    ],
    requirements: [
      "Proven experience leading software engineering teams",
      "Strong technical background in distributed systems",
      "Excellent communication and mentorship skills",
    ],
    skills: ["Leadership", "Distributed Systems", "Agile", "TypeScript", "Cloud"],
    benefits: ["Health Insurance", "Stock Options", "Flexible Hours"],
    about: "Spotify is the world's most popular audio streaming subscription service.",
    aboutIndustry: "Technology",
    aboutSize: "1,000+ employees",
    aboutHq: "Stockholm, Sweden",
    aboutWebsite: "www.spotify.com",
    screeningQuestions: [
      { id: "q1", text: "Do you have the legal right to work in the UK?", type: "Yes/No", required: true },
      { id: "q2", text: "How many engineers have you managed at once?", type: "Number", required: true },
    ],
  },
];

export type CandidateAppStatus = "Under Review" | "Interview" | "Offer" | "Not Selected" | "Withdrawn";

export interface CandidateApplication {
  id: string;
  jobSlug: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: CandidateAppStatus;
  hasOffer?: boolean;
}

export const candidateApplications: CandidateApplication[] = [
  { id: "1", jobSlug: "senior-product-designer-amazon", jobTitle: "Senior Product Designer", company: "Amazon.com, Inc.", appliedDate: "28 Jun 2026", status: "Offer", hasOffer: true },
  { id: "2", jobSlug: "engineering-manager-spotify", jobTitle: "Engineering Manager", company: "Spotify", appliedDate: "20 Jun 2026", status: "Interview" },
  { id: "3", jobSlug: "senior-product-designer-amazon", jobTitle: "Product Designer", company: "Snap Inc.", appliedDate: "12 Jun 2026", status: "Under Review" },
  { id: "4", jobSlug: "engineering-manager-spotify", jobTitle: "Design Lead", company: "Fitbit", appliedDate: "2 Jun 2026", status: "Not Selected" },
];

export const candidateOffer = {
  id: "1",
  jobTitle: "Senior Product Designer",
  company: "Amazon.com, Inc.",
  baseSalary: "$92,000",
  bonus: "10% performance-based",
  benefits: "Private Health Insurance, Pension Plan, 25 Days Holiday, Life Insurance",
  startDate: "1 August 2026",
  contractType: "Permanent",
  perks:
    "Includes a flexible work-from-home policy, monthly wellness stipend, and access to online learning platforms. We are also adding a one-time signing bonus of $2,000.",
  expiresOn: "18 July 2026",
};
