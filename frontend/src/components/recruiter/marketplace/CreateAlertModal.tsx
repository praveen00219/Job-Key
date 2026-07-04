import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const JOB_TYPES = ["Permanent", "Contract", "Fixed-term", "Temporary"];

interface CreateAlertModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateAlertModal({ onClose, onCreate }: CreateAlertModalProps) {
  const [name, setName] = useState("");
  const [jobType, setJobType] = useState("Permanent");
  const [delivery, setDelivery] = useState<"Immediate" | "Daily Digest">("Immediate");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-grey-950/40" />
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between bg-orange-100 p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Create Alert</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-grey-500 hover:text-grey-800">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label htmlFor="alertName">
              Alert Name <span className="text-danger-500">*</span>
            </Label>
            <Input id="alertName" placeholder="e.g., Senior Tech Roles - London" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Job Type</Label>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJobType(type)}
                  className={cn(
                    "rounded-md px-3.5 py-2 text-body-sm font-medium transition-colors",
                    jobType === type ? "bg-orange-500 text-white" : "bg-grey-100 text-grey-700 hover:bg-grey-200"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <div className="relative">
                <select className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs">
                  <option>Select industry</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alertLocation">Location</Label>
              <Input id="alertLocation" placeholder="Search locations..." />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Minimum Salary</Label>
            <div className="relative">
              <select className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs">
                <option>Any</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery</Label>
            <div className="flex gap-2">
              {(["Immediate", "Daily Digest"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDelivery(mode)}
                  className={cn(
                    "flex-1 rounded-md px-3.5 py-2 text-body-sm font-medium transition-colors",
                    delivery === mode ? "bg-grey-950 text-white" : "bg-grey-100 text-grey-700 hover:bg-grey-200"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t border-grey-100 p-5">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            size="md"
            className="bg-grey-950 hover:bg-grey-800"
            disabled={!name.trim()}
            onClick={() => onCreate(name)}
          >
            Create Alert
          </Button>
        </div>
      </div>
    </div>
  );
}
