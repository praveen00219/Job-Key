import { useState } from "react";
import { CheckCircle2, Info, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { payoutAccounts } from "@/lib/mockEarnings";

const AVAILABLE = 9600;
const MINIMUM = 500;

interface RequestPayoutModalProps {
  onClose: () => void;
}

export function RequestPayoutModal({ onClose }: RequestPayoutModalProps) {
  const [amount, setAmount] = useState(String(AVAILABLE));
  const [accountId, setAccountId] = useState(payoutAccounts[0].id);
  const [requested, setRequested] = useState(false);

  const numericAmount = Number(amount || 0);
  const valid = numericAmount >= MINIMUM && numericAmount <= AVAILABLE;
  const account = payoutAccounts.find((a) => a.id === accountId)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-grey-950/40" />
      <div className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between bg-orange-100 p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Request Payout</h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="text-grey-500 hover:text-grey-800">
            <X className="size-5" />
          </button>
        </div>

        {requested ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <CheckCircle2 className="size-10 text-success-600" />
            <h3 className="text-heading-sm font-semibold text-grey-950">Payout requested</h3>
            <p className="max-w-[38ch] text-body-sm text-grey-500">
              £{numericAmount.toLocaleString()} is on its way to {account.label}. Processed within 3-5 business days.
            </p>
            <Button className="mt-2 bg-grey-950 hover:bg-grey-800" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="flex items-center justify-between rounded-md bg-orange-50 p-4">
                <div>
                  <p className="text-body-md font-semibold text-grey-950">Available</p>
                  <p className="text-body-xs text-grey-500">Funds from completed placements</p>
                </div>
                <p className="text-heading-lg font-semibold text-grey-950">£{AVAILABLE.toLocaleString()}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payoutAmount">Payout amount</Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  min={MINIMUM}
                  max={AVAILABLE}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className={cn("text-body-xs", numericAmount < MINIMUM ? "text-danger-500" : "text-grey-500")}>
                  Minimum: £{MINIMUM}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Pay to</Label>
                {payoutAccounts.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccountId(a.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md border p-3.5 text-left transition-colors",
                      accountId === a.id ? "border-orange-400 bg-orange-50/50" : "border-grey-200 hover:border-grey-300"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-full border-2",
                          accountId === a.id ? "border-orange-500" : "border-grey-300"
                        )}
                      >
                        {accountId === a.id && <span className="size-2 rounded-full bg-orange-500" />}
                      </span>
                      <span className="text-body-sm font-medium text-grey-900">{a.label}</span>
                    </span>
                    <span className="flex gap-1.5">
                      {a.verified && (
                        <span className="rounded-full bg-success-50 px-2 py-0.5 text-body-xs font-medium text-success-600">Verified</span>
                      )}
                      {a.primary && (
                        <span className="rounded-full bg-grey-100 px-2 py-0.5 text-body-xs font-medium text-grey-600">Primary</span>
                      )}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-grey-200 py-2.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50"
                >
                  Add New Account
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="divide-y divide-grey-100 rounded-md bg-grey-50 px-4">
                {[
                  { label: "Amount", value: `£${numericAmount.toLocaleString()}` },
                  { label: "To", value: account.label },
                  { label: "Expected", value: "By 20 March" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 text-body-sm">
                    <span className="text-grey-500">{row.label}</span>
                    <span className="font-medium text-grey-900">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-md bg-brand-50 p-3 text-body-sm text-grey-700">
                <Info className="size-4 shrink-0 text-brand-600" />
                Processed within 3-5 business days
              </div>
            </div>

            <div className="flex justify-between border-t border-grey-100 p-5">
              <Button variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button size="md" className="bg-grey-950 hover:bg-grey-800" disabled={!valid} onClick={() => setRequested(true)}>
                Request Payout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
