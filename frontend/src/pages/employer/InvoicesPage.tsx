import { Download } from "lucide-react";

import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployerHero, PageBannerTitle } from "@/components/employer/EmployerHero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { invoiceRows, invoiceSummary, type InvoiceStatus } from "@/lib/mockInvoices";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Issued: "bg-brand-50 text-brand-600",
  Paid: "bg-success-50 text-success-600",
  Overdue: "bg-danger-50 text-danger-600",
  Draft: "bg-grey-100 text-grey-600",
};

export default function InvoicesPage() {
  return (
    <EmployerLayout
      hero={
        <EmployerHero>
          <PageBannerTitle
            title="Invoices"
            subtitle="View and pay recruiter placement invoices"
            actions={
              <Button size="md" className="bg-grey-950 hover:bg-grey-800">
                <Download className="size-4" />
                Export CSV
              </Button>
            }
          />
        </EmployerHero>
      }
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 rounded-lg bg-white p-4 shadow-xs">
          <p className="text-heading-md font-semibold text-grey-950">{invoiceSummary.totalSpendYtd}</p>
          <p className="mt-1 text-body-xs text-grey-500">Total recruitment spend (YTD)</p>
        </div>
        <div className="flex-1 rounded-lg bg-white p-4 shadow-xs">
          <p className="text-heading-md font-semibold text-danger-600">{invoiceSummary.outstandingBalance}</p>
          <p className="mt-1 text-body-xs text-grey-500">Outstanding balance</p>
        </div>
        <div className="flex-1 rounded-lg bg-white p-4 shadow-xs">
          <p className="text-heading-md font-semibold text-grey-950">{invoiceSummary.avgCostPerHire}</p>
          <p className="mt-1 text-body-xs text-grey-500">Average cost per hire</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-grey-200 bg-grey-50 text-left">
                {["Invoice", "Candidate", "Vacancy", "Commission", "Total (incl. VAT)", "Due Date", "Status", ""].map(
                  (col) => (
                    <th key={col} className="px-4 py-3 text-body-xs font-medium uppercase tracking-wide text-grey-500">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {invoiceRows.map((inv) => (
                <tr key={inv.id} className="border-b border-grey-100 last:border-0">
                  <td className="px-4 py-3.5 text-body-sm font-medium text-grey-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3.5 text-body-sm text-grey-700">{inv.candidateName}</td>
                  <td className="px-4 py-3.5 text-body-sm text-grey-700">{inv.vacancy}</td>
                  <td className="px-4 py-3.5 text-body-sm text-grey-700">
                    £{inv.grossCommission.toLocaleString()} ({inv.commissionPct}%)
                  </td>
                  <td className="px-4 py-3.5 text-body-sm font-medium text-grey-900">£{inv.total.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-body-sm text-grey-700">{inv.dueDate}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", STATUS_STYLES[inv.status])}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button type="button" className="text-body-sm font-semibold text-brand-600 hover:text-brand-700">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EmployerLayout>
  );
}
