export const earningsStats = [
  { value: "£9,600", label: "Available balance", sublabel: "Ready to withdraw", sublabelClass: "text-grey-500" },
  { value: "£14,400", label: "Pending", sublabel: "Awaiting employer payment", sublabelClass: "text-grey-500" },
  { value: "£24,000", label: "This month", sublabel: "20% vs last month", sublabelClass: "text-success-600" },
  { value: "£87,500", label: "Total earned", sublabel: "All time", sublabelClass: "text-grey-500" },
];

export interface MonthlyEarning {
  month: string;
  amountK: number;
}

export const monthlyEarnings: MonthlyEarning[] = [
  { month: "Jan", amountK: 10 },
  { month: "Feb", amountK: 27 },
  { month: "Mar", amountK: 6 },
  { month: "Apr", amountK: 18 },
  { month: "May", amountK: 22 },
  { month: "Jun", amountK: 6 },
  { month: "Jul", amountK: 16 },
  { month: "Aug", amountK: 3 },
  { month: "Sep", amountK: 28 },
  { month: "Oct", amountK: 5 },
  { month: "Nov", amountK: 11 },
  { month: "Dec", amountK: 16 },
];

export const industryBreakdown = [
  { industry: "Technology", amount: "£52,000", pct: 60 },
  { industry: "Finance", amount: "£26,000", pct: 30 },
  { industry: "Other", amount: "£9,500", pct: 10 },
];

export const placementStats = [
  { label: "Average per placement", value: "£7,292" },
  { label: "Total placements", value: "12" },
  { label: "Success rate", value: "85%" },
];

export type TransactionKind = "commission" | "pending" | "payout";

export interface EarningsTransaction {
  id: string;
  kind: TransactionKind;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  /** Present only on pending (employer-delay) transactions. */
  delay?: {
    reason: string;
    currentDue: string;
    requestedDue: string;
  };
}

export const earningsTransactions: EarningsTransaction[] = [
  {
    id: "1",
    kind: "commission",
    title: "Placement Commission - TechCorp",
    subtitle: "Senior Software Engineer · James Chen",
    amount: "+£9,600",
    date: "28 Dec 2025",
  },
  {
    id: "2",
    kind: "pending",
    title: "Placement Commission - FinanceHub",
    subtitle: "Financial Analyst · Sarah Mitchell",
    amount: "£7,200",
    date: "20 Dec 2025",
    delay: {
      reason: '"Cash flow timing due to Q1 budget cycle"',
      currentDue: "15 Jan 2026",
      requestedDue: "15 Feb 2026",
    },
  },
  {
    id: "3",
    kind: "commission",
    title: "Placement Commission - DataFlow",
    subtitle: "Data Engineer · Marcus Wong",
    amount: "+£8,400",
    date: "15 Dec 2025",
  },
  {
    id: "4",
    kind: "payout",
    title: "Payout to Bank Account",
    subtitle: "****4532",
    amount: "-£15,000",
    date: "10 Dec 2025",
  },
  {
    id: "5",
    kind: "commission",
    title: "Placement Commission - CloudSystems",
    subtitle: "DevOps Engineer · Alex Rivera",
    amount: "+£10,500",
    date: "5 Dec 2025",
  },
];

export interface PayoutMethod {
  id: string;
  type: "bank" | "paypal";
  title: string;
  subtitle: string;
  added: string;
  primary?: boolean;
  verified?: boolean;
}

export const payoutMethods: PayoutMethod[] = [
  { id: "1", type: "bank", title: "Bank Account", subtitle: "Barclays · ****4532", added: "Added 15 Jan 2024", primary: true, verified: true },
  { id: "2", type: "paypal", title: "PayPal", subtitle: "jane.doe@email.com", added: "Added 3 Mar 2024", verified: true },
];

export const payoutAccounts = [
  { id: "barclays", label: "Barclays ****4521", verified: true, primary: true },
  { id: "hsbc", label: "HSBC ****8832", verified: true, primary: false },
];

export interface ExtensionRequest {
  id: string;
  invoice: string;
  vacancy: string;
  candidate: string;
  amount: string;
  currentDue: string;
  requestedDue: string;
  reason: string;
}

export const extensionRequests: ExtensionRequest[] = [
  { id: "1", invoice: "INV-2025-0043", vacancy: "Junior UX Designer", candidate: "Emma Johnson", amount: "£45,000", currentDue: "20 Feb 2026", requestedDue: "20 Mar 2026", reason: "Cash flow timing due to Q1 budget cycle" },
  { id: "2", invoice: "INV-2025-0044", vacancy: "Lead UI Designer", candidate: "Noah Brown", amount: "£90,000", currentDue: "25 Mar 2026", requestedDue: "25 Apr 2026", reason: "Cash flow timing due to Q1 budget cycle" },
  { id: "3", invoice: "INV-2025-0045", vacancy: "Product Manager", candidate: "Olivia Davis", amount: "£85,000", currentDue: "30 Apr 2026", requestedDue: "30 May 2026", reason: "Awaiting board sign-off on Q2 spend" },
  { id: "4", invoice: "INV-2025-0046", vacancy: "Graphic Designer", candidate: "James Wilson", amount: "£50,000", currentDue: "5 May 2026", requestedDue: "5 Jun 2026", reason: "Cash flow timing due to Q2 budget cycle" },
  { id: "5", invoice: "INV-2025-0047", vacancy: "Data Analyst", candidate: "Sophia Martinez", amount: "£60,000", currentDue: "10 Jun 2026", requestedDue: "10 Jul 2026", reason: "Awaiting invoice consolidation" },
];

// Agency Financials tab (Agency page)
export const agencyFinancialStats = [
  { value: "£23,450", label: "Total Revenue" },
  { value: "£54,400", label: "Agency Share" },
  { value: "£15,600", label: "Paid to Recruiters" },
  { value: "20%", label: "Agency Commission rate" },
];

export interface TeamEarningsRow {
  id: string;
  member: string;
  avatarColor: string;
  role: string;
  placements: number;
  grossRevenue: string;
  commissionRate: string;
  earnings: string;
}

export const teamEarningsBreakdown: TeamEarningsRow[] = [
  { id: "1", member: "Priya Sharma", avatarColor: "bg-orange-100", role: "Admin", placements: 8, grossRevenue: "£24,000", commissionRate: "80%", earnings: "£19,200" },
  { id: "2", member: "Courtney Henry", avatarColor: "bg-brand-100", role: "Recruiter", placements: 8, grossRevenue: "£24,000", commissionRate: "80%", earnings: "£19,200" },
  { id: "3", member: "Theresa Webb", avatarColor: "bg-pink-50", role: "Recruiter", placements: 8, grossRevenue: "£24,000", commissionRate: "80%", earnings: "£19,200" },
  { id: "4", member: "Jerome Bell", avatarColor: "bg-success-50", role: "Recruiter", placements: 8, grossRevenue: "£24,000", commissionRate: "80%", earnings: "£19,200" },
];
