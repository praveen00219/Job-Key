export type OfferStatus = "Pending" | "Accepted" | "Rejected" | "Expired" | "Withdrawn";
export type OfferSource = "Direct" | "Marketplace";

export interface OfferRow {
  id: string;
  candidateName: string;
  avatarColor: string;
  source: OfferSource;
  vacancy: string;
  salary: string;
  status: OfferStatus;
  createdDate: string;
  resolvedDate: string;
  daysOpen: number;
  baseSalary: string;
  bonus?: string;
  benefits: string;
  startDate: string;
  contractType: string;
}

export const offerRows: OfferRow[] = [
  {
    id: "1",
    candidateName: "Lana Steiner",
    avatarColor: "bg-pink-50",
    source: "Direct",
    vacancy: "Senior Product Designer",
    salary: "£75,000",
    status: "Accepted",
    createdDate: "1 Jan 2025",
    resolvedDate: "10 Jan 2025",
    daysOpen: 7,
    baseSalary: "£75,000",
    bonus: "£5,000 signing bonus",
    benefits: "Health Insurance, Pension Scheme, Learning Budget",
    startDate: "1 Feb 2025",
    contractType: "Permanent",
  },
  {
    id: "2",
    candidateName: "Phoenix Baker",
    avatarColor: "bg-orange-50",
    source: "Marketplace",
    vacancy: "Lead Product Manager",
    salary: "£82,000",
    status: "Rejected",
    createdDate: "2 Jan 2025",
    resolvedDate: "20 Jan 2025",
    daysOpen: 10,
    baseSalary: "£82,000",
    benefits: "Health Insurance, Stock Options",
    startDate: "10 Feb 2025",
    contractType: "Permanent",
  },
  {
    id: "3",
    candidateName: "Lana Steiner",
    avatarColor: "bg-pink-50",
    source: "Direct",
    vacancy: "Data Scientist",
    salary: "£68,000",
    status: "Pending",
    createdDate: "1 Jan 2025",
    resolvedDate: "—",
    daysOpen: 15,
    baseSalary: "£68,000",
    benefits: "Health Insurance, Pension Scheme",
    startDate: "15 Feb 2025",
    contractType: "Permanent",
  },
  {
    id: "4",
    candidateName: "Phoenix Baker",
    avatarColor: "bg-orange-50",
    source: "Marketplace",
    vacancy: "Lead Frontend Engineer",
    salary: "£72,000",
    status: "Expired",
    createdDate: "1 Feb 2025",
    resolvedDate: "10 Feb 2025",
    daysOpen: 7,
    baseSalary: "£72,000",
    benefits: "Health Insurance",
    startDate: "20 Feb 2025",
    contractType: "Contract",
  },
  {
    id: "5",
    candidateName: "Lana Steiner",
    avatarColor: "bg-pink-50",
    source: "Direct",
    vacancy: "Data Scientist",
    salary: "£68,000",
    status: "Withdrawn",
    createdDate: "1 Jan 2025",
    resolvedDate: "23 Jan 2025",
    daysOpen: 5,
    baseSalary: "£68,000",
    benefits: "Health Insurance, Pension Scheme",
    startDate: "1 Mar 2025",
    contractType: "Permanent",
  },
];

export const offersStats = {
  overview: [
    { value: "24", label: "Total Offers" },
    { value: "52%", label: "Acceptance Rate" },
    { value: "4.5", suffix: "Days", label: "Avg. Time to Decision" },
    { value: "£984k", label: "Total Accepted Value" },
    { value: "£48.5k", label: "Total Commission Paid" },
  ],
  pending: [
    { value: "7", label: "Total Pending" },
    { value: "3", label: "Awaiting Response" },
    { value: "15", suffix: "Days", label: "Oldest Pending Offer" },
    { value: "£542k", label: "Total Potential Value" },
  ],
  accepted: [
    { value: "12", label: "Total Accepted" },
    { value: "3", label: "This Month" },
    { value: "3.8", suffix: "Days", label: "Avg. Time to Accept" },
    { value: "£984k", label: "Total Accepted Value" },
  ],
  rejected: [
    { value: "12", label: "Total Rejected" },
    { value: "4", label: "This Month" },
    { value: "5.2", suffix: "Days", label: "Avg. Days Before Rejection" },
    { value: "£80k", label: "Avg. offer value" },
  ],
  expired: [
    { value: "12", label: "Total Expired" },
    { value: "4", label: "This Month" },
    { value: "7", suffix: "Days", label: "Avg. Days Before Expiry" },
  ],
};
