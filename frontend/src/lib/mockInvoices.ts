export type InvoiceStatus = "Issued" | "Paid" | "Overdue" | "Draft";

export interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  candidateName: string;
  vacancy: string;
  placementDate: string;
  salary: number;
  commissionPct: number;
  grossCommission: number;
  vat: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export const invoiceRows: InvoiceRow[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-0142",
    candidateName: "Alex Chen",
    vacancy: "Engineering Manager",
    placementDate: "12 Jun 2026",
    salary: 95000,
    commissionPct: 15,
    grossCommission: 14250,
    vat: 2850,
    total: 17100,
    issueDate: "12 Jun 2026",
    dueDate: "12 Jul 2026",
    status: "Overdue",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-0156",
    candidateName: "Priya Anand",
    vacancy: "Senior Product Designer",
    placementDate: "18 Jun 2026",
    salary: 78000,
    commissionPct: 18,
    grossCommission: 14040,
    vat: 2808,
    total: 16848,
    issueDate: "18 Jun 2026",
    dueDate: "18 Jul 2026",
    status: "Issued",
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-0121",
    candidateName: "Owen Clarke",
    vacancy: "Customer Success Lead",
    placementDate: "22 May 2026",
    salary: 62000,
    commissionPct: 12,
    grossCommission: 7440,
    vat: 1488,
    total: 8928,
    issueDate: "22 May 2026",
    dueDate: "22 Jun 2026",
    status: "Paid",
  },
];

export const invoiceSummary = {
  totalSpendYtd: "£412,600",
  outstandingBalance: "£33,948",
  avgCostPerHire: "£13,625",
};
