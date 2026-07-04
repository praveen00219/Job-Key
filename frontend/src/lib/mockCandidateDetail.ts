export interface WorkHistoryItem {
  role: string;
  company: string;
  dateRange: string;
  description: string;
  dotColor: string;
}

export interface EducationItem {
  years: string;
  degree: string;
}

export interface DocumentItem {
  name: string;
  date: string;
}

export interface CandidateDetail {
  id: string;
  name: string;
  sourceTag: "Marketplace" | "Direct";
  title: string;
  recruiterName?: string;
  skills: string[];
  location: string;
  phone: string;
  email: string;
  currentCompany: string;
  salaryExpectation: string;
  noticePeriod: string;
  preferredLocation: string;
  workHistory: WorkHistoryItem[];
  education: EducationItem[];
  documents: DocumentItem[];
  whyThisCandidate: string;
  consented: boolean;
}

export const candidateDetail: CandidateDetail = {
  id: "benjamin-lee",
  name: "Benjamin Lee",
  sourceTag: "Marketplace",
  title: "Senior Creative Director · 8yrs",
  recruiterName: "Eleanor Vance",
  skills: ["Sketch", "Illustrator", "Figma", "InVision", "Figma"],
  location: "Amsterdam, The Netherlands",
  phone: "+18579909675",
  email: "Benjamin_lee@samplecandidate.com",
  currentCompany: "London, Newyork",
  salaryExpectation: "£75,000 - £85,000",
  noticePeriod: "1 month",
  preferredLocation: "London, Newyork",
  workHistory: [
    {
      role: "Senior Product Designer",
      company: "Spotify",
      dateRange: "Jan 2022 - Present",
      description:
        "Leading design for the core navigation and control systems, focussing on intuitive interfaces for high-stress environments.",
      dotColor: "bg-success-600",
    },
    {
      role: "Product Designer",
      company: "Canterbury transport",
      dateRange: "Jan 2019 - Jan 2022",
      description: "Designed user interfaces for cargo management software, improving efficiency for haulers across the system.",
      dotColor: "bg-grey-500",
    },
    {
      role: "UX/UI Designer",
      company: "Snap chat",
      dateRange: "Aug 2017 - May 2019",
      description: "Worked on a variety of internal tools and public facing communication platforms.",
      dotColor: "bg-warning-500",
    },
  ],
  education: [
    { years: "2010 - 2012", degree: "M.S. Marketing at Stanford University" },
    { years: "2005 - 2009", degree: "B.A. Business Management at University of Arizona" },
  ],
  documents: [
    { name: "Cover Letter", date: "23 July 2025" },
    { name: "Portfolio", date: "23 July 2025" },
    { name: "Reference List", date: "23 July 2025" },
  ],
  whyThisCandidate:
    "James is an exceptional designer with a proven track record of delivering user-centric products in complex domains. His experience at Rocinante Corp directly aligns with the challenges of your Senior Product Designer role. He's a strong communicator and a natural leader, passionate about building intuitive systems. I've spoken with him at length, and he is very enthusiastic about your company's mission. He's ready for a new challenge and would be a fantastic addition to your team.",
  consented: true,
};

export interface TimelineEntry {
  id: string;
  authorName: string;
  avatarColor: string;
  action: string;
  visibility?: string;
  body?: string;
  timestamp: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    id: "1",
    authorName: "Benjamin Lee",
    avatarColor: "bg-pink-50",
    action: "replied from Benjamin_lee@samplecandidate.com",
    body: "Hi Natalie,\nThank you for your email. It would be great to speak to you and I am available any time this week for a call at your convenience.\nMany thanks,\nBenjamin Lee",
    timestamp: "4 months ago",
  },
  {
    id: "2",
    authorName: "Natalie Sung",
    avatarColor: "bg-orange-50",
    action: "sent an email",
    visibility: "All hiring team",
    body: "Dear Benjamin Lee,\nThank you for applying for the Account Executive position at Artamrit. I would like to set up a time to speak with you on the phone. Can you please send me your availability over the next few days and the best time to reach you at?\nI look forward to speaking with you.\nSincerely,\nNatalie Sung",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    authorName: "Natalie Sung",
    avatarColor: "bg-orange-50",
    action: "Moved to Screening",
    visibility: "All hiring team",
    timestamp: "5 min ago",
  },
  {
    id: "4",
    authorName: "Eduardo Vallente",
    avatarColor: "bg-brand-200",
    action: "Added an evaluation for Screening stage",
    visibility: "All hiring team",
    timestamp: "5 min ago",
  },
  {
    id: "5",
    authorName: "Natalie Sung",
    avatarColor: "bg-orange-50",
    action: "Added a comment",
    visibility: "All hiring team",
    body: "OK @eduardo_vallente I'll get in touch and arrange the call",
    timestamp: "5 min ago",
  },
  {
    id: "6",
    authorName: "Eduardo Vallente",
    avatarColor: "bg-brand-200",
    action: "Added a comment",
    visibility: "All hiring team",
    body: "Sure, looks very promising. Let's schedule a phone interview.",
    timestamp: "5 min ago",
  },
  {
    id: "7",
    authorName: "Natalie Sung",
    avatarColor: "bg-orange-50",
    action: "Added a comment",
    visibility: "All hiring team",
    body: "Very strong resume, I think we should schedule a call @eduardo_vallente.",
    timestamp: "4 months ago",
  },
  {
    id: "8",
    authorName: "Benjamin Lee",
    avatarColor: "bg-pink-50",
    action: "Applied Job",
    body: "Hey Olivia, Katherine sent me over the latest doc. I just have a quick question about the...",
    timestamp: "4 months ago",
  },
];

export interface ReviewEntry {
  id: string;
  reviewerName: string;
  stageTag: string;
  body: string;
  timestamp: string;
}

export const reviewEntries: ReviewEntry[] = [
  {
    id: "1",
    reviewerName: "Natalie Sung",
    stageTag: "Screened",
    body: "Pleased we spoke to Mark. Skills were a good match for the role and could be a star. Really liked his communication style on the phone which will be important for this role. I think we should progress to the next stage.",
    timestamp: "4 months ago",
  },
  {
    id: "2",
    reviewerName: "Emily Chen",
    stageTag: "Screened",
    body: "Mark showed strong potential. His background aligns well with our needs, and he asked insightful questions. Worth moving forward.",
    timestamp: "4 months ago",
  },
];

export interface CommentEntry {
  id: string;
  authorName: string;
  avatarColor: string;
  visibility: string;
  body: string;
  timestamp: string;
}

export const commentEntries: CommentEntry[] = [
  {
    id: "1",
    authorName: "Natalie Sung",
    avatarColor: "bg-orange-50",
    visibility: "All hiring team",
    body: "Ok @eduardo_vallente I'll get in touch and arrange the call",
    timestamp: "4 months ago",
  },
  {
    id: "2",
    authorName: "Eduardo Vallente",
    avatarColor: "bg-brand-200",
    visibility: "All hiring team",
    body: "Sure, looks very promising. Let's schedule a phone interview.",
    timestamp: "4 months ago",
  },
  {
    id: "3",
    authorName: "Natalie Sung",
    avatarColor: "bg-orange-50",
    visibility: "All hiring team",
    body: "Very strong resume, I think we should schedule a call @eduardo_vallente.",
    timestamp: "4 months ago",
  },
];

export interface CommMessage {
  id: string;
  from: "you" | "team" | "scheduled";
  authorName?: string;
  body?: string;
  timestamp: string;
}

export const scheduledInterview = {
  title: "Interview Scheduled",
  event: "Technical Interview — Caleb Rivers",
  date: "Tuesday, 4 March 2025",
  time: "2:30 PM – 3:30 PM GMT",
  format: "Video Call",
  link: "Google Meet",
};

export const communicationMessages: CommMessage[] = [
  {
    id: "1",
    from: "you",
    body: "He's available Tuesday and Thursday afternoon next week, anytime between 2–5 PM GMT. Would either of those work?",
    timestamp: "3 days ago",
  },
  { id: "2", from: "scheduled", timestamp: "3 days ago" },
  {
    id: "3",
    from: "team",
    authorName: "Hitesh Gaur",
    body: "I've scheduled the interview for Tuesday. The Google Meet link is in the invite. Looking forward to it.",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    from: "you",
    body: "Perfect, Caleb has confirmed. He'll be prepared with case studies as discussed. Let me know if you need anything else before the interview.",
    timestamp: "1 day ago",
  },
];
