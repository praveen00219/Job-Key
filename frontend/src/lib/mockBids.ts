export type BidStatus = "Pending" | "Accepted" | "Rejected";

export interface BidRow {
  id: string;
  candidateName: string;
  avatarColor: string;
  candidateTitle: string;
  recruiterName: string;
  agencyName: string;
  recruiterTier: "Worker Bee" | "Honey Maker" | "Queen's Guard" | "Hive Legend";
  vacancy: string;
  commissionPct: number;
  estimatedSalary: number;
  notes: string;
  submittedDate: string;
  status: BidStatus;
}

export const bidRows: BidRow[] = [
  {
    id: "1",
    candidateName: "Alex Chen",
    avatarColor: "bg-brand-200",
    candidateTitle: "Senior Backend Engineer",
    recruiterName: "Eleanor Vance",
    agencyName: "TechRecruit Partners",
    recruiterTier: "Queen's Guard",
    vacancy: "Engineering Manager",
    commissionPct: 15,
    estimatedSalary: 95000,
    notes: "Strong distributed-systems background, currently at a Series B fintech. Available to start within a month.",
    submittedDate: "2 days ago",
    status: "Pending",
  },
  {
    id: "2",
    candidateName: "Priya Anand",
    avatarColor: "bg-pink-50",
    candidateTitle: "Product Designer",
    recruiterName: "Marcus Reid",
    agencyName: "Talent Bridge",
    recruiterTier: "Honey Maker",
    vacancy: "Senior Product Designer",
    commissionPct: 18,
    estimatedSalary: 78000,
    notes: "Led design for a Series A marketplace product end-to-end. Portfolio attached.",
    submittedDate: "4 days ago",
    status: "Pending",
  },
  {
    id: "3",
    candidateName: "Owen Clarke",
    avatarColor: "bg-orange-50",
    candidateTitle: "Customer Success Manager",
    recruiterName: "Sofia Marsh",
    agencyName: "Independent",
    recruiterTier: "Worker Bee",
    vacancy: "Customer Success Lead",
    commissionPct: 12,
    estimatedSalary: 62000,
    notes: "5 years in CS leadership roles at SaaS companies, strong retention track record.",
    submittedDate: "1 week ago",
    status: "Accepted",
  },
  {
    id: "4",
    candidateName: "Grace Kim",
    avatarColor: "bg-success-50",
    candidateTitle: "Engineering Manager",
    recruiterName: "Daniel Osei",
    agencyName: "Hive Legend Search",
    recruiterTier: "Hive Legend",
    vacancy: "Engineering Manager",
    commissionPct: 20,
    estimatedSalary: 105000,
    notes: "Currently leading a 12-person platform team, open to relocating to London.",
    submittedDate: "2 weeks ago",
    status: "Rejected",
  },
];

export const TIER_STYLES: Record<BidRow["recruiterTier"], string> = {
  "Worker Bee": "bg-grey-100 text-grey-600",
  "Honey Maker": "bg-orange-50 text-orange-400",
  "Queen's Guard": "bg-brand-50 text-brand-600",
  "Hive Legend": "bg-warning-50 text-warning-700",
};
