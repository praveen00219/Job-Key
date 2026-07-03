import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FieldRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function SelectField({ id, value, options }: { id: string; value: string; options: string[] }) {
  return (
    <div className="relative">
      <select
        id={id}
        defaultValue={value}
        className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
    </div>
  );
}

export default function BillingSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 900);
  };

  return (
    <SettingsPageShell title="Billing Information" subtitle="Manage details for invoices">
      <div className="rounded-md border-l-4 border-warning-500 bg-white p-4">
        <p className="text-body-sm font-medium text-grey-900">Changes apply to future invoices only</p>
        <p className="mt-0.5 text-body-sm text-grey-600">
          Any modifications made here will be reflected on invoices generated after this date.
        </p>
      </div>

      <div className="rounded-lg bg-white">
        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[280px_1fr]">
          <div>
            <h2 className="text-heading-sm font-semibold text-grey-950">Company Details</h2>
            <p className="mt-1 text-body-sm text-grey-500">This information will appear on your invoices.</p>
          </div>
          <div className="space-y-5">
            <FieldRow label="Company legal name" htmlFor="legalName">
              <Input id="legalName" defaultValue="Innovate Inc." />
            </FieldRow>
            <FieldRow label="Company registration number" htmlFor="regNumber">
              <Input id="regNumber" defaultValue="12345678" />
            </FieldRow>
            <FieldRow label="VAT number" htmlFor="vatNumber">
              <Input id="vatNumber" defaultValue="GB123456789" />
            </FieldRow>
          </div>
        </div>

        <div className="border-t border-grey-100" />

        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[280px_1fr]">
          <div>
            <h2 className="text-heading-sm font-semibold text-grey-950">Billing Address</h2>
            <p className="mt-1 text-body-sm text-grey-500">The address where invoices should be sent.</p>
          </div>
          <div className="space-y-5">
            <FieldRow label="Address line 1" htmlFor="addr1">
              <Input id="addr1" defaultValue="123 Tech Street" />
            </FieldRow>
            <FieldRow label="Address line 2" htmlFor="addr2">
              <Input id="addr2" defaultValue="Suite 404" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="City" htmlFor="city">
                <SelectField id="city" value="London" options={["London", "Manchester", "Birmingham"]} />
              </FieldRow>
              <FieldRow label="Postcode" htmlFor="postcode">
                <Input id="postcode" defaultValue="SW1A 0AA" />
              </FieldRow>
            </div>
            <FieldRow label="Country" htmlFor="country">
              <SelectField
                id="country"
                value="United Kingdom"
                options={["United Kingdom", "Ireland", "United States"]}
              />
            </FieldRow>
          </div>
        </div>

        <div className="border-t border-grey-100" />

        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[280px_1fr]">
          <div>
            <h2 className="text-heading-sm font-semibold text-grey-950">Finance Contact</h2>
            <p className="mt-1 text-body-sm text-grey-500">
              Who should we contact for billing-related questions?
            </p>
          </div>
          <div className="space-y-5">
            <FieldRow label="Finance email" htmlFor="financeEmail">
              <Input id="financeEmail" type="email" defaultValue="billing@innovate.com" />
            </FieldRow>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="md" className="bg-grey-950 hover:bg-grey-800" loading={saving} onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </SettingsPageShell>
  );
}
