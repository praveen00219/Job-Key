import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Hand,
  Search,
  Send,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";

export interface StatCardData {
  id: string;
  icon: typeof Search;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  sublabel: string;
  sublabelClass?: string;
}

export const statCards: StatCardData[] = [
  {
    id: "active-vacancies",
    icon: Search,
    iconBg: "bg-brand-50",
    iconColor: "text-brand-600",
    value: "12",
    label: "Active Vacancies",
    sublabel: "+2 this month",
    sublabelClass: "text-success-600",
  },
  {
    id: "candidates-pipeline",
    icon: Users,
    iconBg: "bg-grey-50",
    iconColor: "text-grey-600",
    value: "156",
    label: "Candidates in Pipeline",
    sublabel: "Across all vacancies",
  },
  {
    id: "pending-bids",
    icon: Hand,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-300",
    value: "03",
    label: "Pending Bids",
    sublabel: "Awaiting review",
  },
  {
    id: "offers-awaiting",
    icon: Clock,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
    value: "04",
    label: "Offers Awaiting Response",
    sublabel: "Sent to candidates",
  },
  {
    id: "outstanding-invoices",
    icon: FileText,
    iconBg: "bg-grey-50",
    iconColor: "text-grey-600",
    value: "£24,500",
    label: "Outstanding Invoices",
    sublabel: "2 invoices",
  },
];

export interface AttentionItem {
  id: string;
  icon: typeof Users;
  borderClass: string;
  iconClass: string;
  text: string;
  linkText: string;
  linkClass: string;
}

export const attentionItems: AttentionItem[] = [
  {
    id: "stalled",
    icon: Users,
    borderClass: "border-warning-500",
    iconClass: "text-warning-500",
    text: "5 candidates stalled",
    linkText: "View Candidates",
    linkClass: "text-orange-400",
  },
  {
    id: "bids-expiring",
    icon: Clock,
    borderClass: "border-pink-300",
    iconClass: "text-pink-300",
    text: "2 bids expiring in 24 hours",
    linkText: "Review Now",
    linkClass: "text-pink-300",
  },
  {
    id: "invoice-overdue",
    icon: TriangleAlert,
    borderClass: "border-orange-400",
    iconClass: "text-orange-400",
    text: "1 invoice overdue",
    linkText: "View Invoice",
    linkClass: "text-orange-400",
  },
  {
    id: "offers-pending",
    icon: ArrowRight,
    borderClass: "border-brand-500",
    iconClass: "text-brand-500",
    text: "2 offers pending > 3 days",
    linkText: "Follow Up",
    linkClass: "text-brand-600",
  },
];

export interface PipelineStage {
  label: string;
  count: number;
  barClass: string;
}

export const pipelineStages: PipelineStage[] = [
  { label: "Application", count: 23, barClass: "bg-brand-100" },
  { label: "Screening", count: 12, barClass: "bg-brand-300" },
  { label: "Interview", count: 4, barClass: "bg-brand-400" },
  { label: "Offer", count: 2, barClass: "bg-brand-500" },
  { label: "Hired", count: 1, barClass: "bg-brand-700" },
];

export interface ActivityItem {
  id: string;
  icon: typeof UserPlus;
  iconClass: string;
  iconBg: string;
  name: string;
  action: string;
  timestamp: string;
}

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    icon: UserPlus,
    iconBg: "bg-brand-50",
    iconClass: "text-brand-600",
    name: "John Smith",
    action: "applied to Senior Designer",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    icon: Briefcase,
    iconBg: "bg-pink-50",
    iconClass: "text-pink-300",
    name: "TechRecruit",
    action: "submitted Alex Chen for PM",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    icon: ArrowRight,
    iconBg: "bg-orange-50",
    iconClass: "text-orange-400",
    name: "Jane Doe",
    action: "moved to Interview stage",
    timestamp: "5 hours ago",
  },
  {
    id: "4",
    icon: Send,
    iconBg: "bg-brand-50",
    iconClass: "text-brand-600",
    name: "",
    action: "Offer sent to Mike Brown",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    icon: CheckCircle2,
    iconBg: "bg-success-50",
    iconClass: "text-success-600",
    name: "Lisa Park",
    action: "accepted DevOps offer",
    timestamp: "Yesterday",
  },
];

export type SourceTag = "Direct" | "Marketplace";
export type VacancyStatus = "Active" | "Paused";

export interface VacancyPerformanceRow {
  id: string;
  name: string;
  status: VacancyStatus;
  applications: number;
  inPipeline: number;
  conversionPct: number;
  avgTime: string;
  topSource: SourceTag;
}

export const vacancyPerformance: VacancyPerformanceRow[] = [
  {
    id: "1",
    name: "Senior Product Designer",
    status: "Active",
    applications: 57,
    inPipeline: 12,
    conversionPct: 14,
    avgTime: "4.2 days",
    topSource: "Direct",
  },
  {
    id: "2",
    name: "Engineering Manager",
    status: "Active",
    applications: 32,
    inPipeline: 8,
    conversionPct: 6,
    avgTime: "6.8 days",
    topSource: "Marketplace",
  },
  {
    id: "3",
    name: "Customer Success Lead",
    status: "Paused",
    applications: 18,
    inPipeline: 2,
    conversionPct: 0,
    avgTime: "12.5 days",
    topSource: "Direct",
  },
];
