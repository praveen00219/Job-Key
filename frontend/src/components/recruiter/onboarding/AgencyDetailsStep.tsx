import { useState } from "react";
import { ChevronDown, MapPin, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadBox } from "@/components/recruiter/FileUploadBox";
import { OnboardingFooter } from "@/components/recruiter/OnboardingFooter";
import { cn } from "@/lib/utils";
import type { AgencyOnboardingState, TeamMemberInvite } from "@/lib/recruiterOnboarding";

const MAX_BIO = 500;

const STATUS_STYLES: Record<TeamMemberInvite["status"], string> = {
  Active: "bg-success-50 text-success-600",
  Pending: "bg-warning-50 text-warning-700",
};

function SelectField({
  label,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
      </div>
    </div>
  );
}

interface AgencyDetailsStepProps {
  data: AgencyOnboardingState["agencyDetails"];
  onChange: (patch: Partial<AgencyOnboardingState["agencyDetails"]>) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function AgencyDetailsStep({ data, onChange, onCancel, onContinue }: AgencyDetailsStepProps) {
  const [inviteEmail, setInviteEmail] = useState("");

  const addMember = () => {
    if (!inviteEmail.trim()) return;
    const member: TeamMemberInvite = {
      id: crypto.randomUUID(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "Recruiter",
      status: "Pending",
    };
    onChange({ teamMembers: [...data.teamMembers, member] });
    setInviteEmail("");
  };

  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Join the JobKey Recruiter Network</h1>
      <p className="mt-1 text-body-sm text-grey-600">Tell us about your agency</p>

      <div className="mt-6 space-y-5 rounded-lg bg-white p-5">
        <div className="space-y-1.5">
          <Label htmlFor="agencyName">Agency name</Label>
          <Input
            id="agencyName"
            placeholder="Enter Agency Name"
            value={data.agencyName}
            onChange={(e) => onChange({ agencyName: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="regNumber">Company registration number</Label>
          <Input
            id="regNumber"
            placeholder="12345678"
            value={data.registrationNumber}
            onChange={(e) => onChange({ registrationNumber: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="hq">Headquarters</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
              <Input
                id="hq"
                className="pl-10"
                placeholder="Start typing location..."
                value={data.headquarters}
                onChange={(e) => onChange({ headquarters: e.target.value })}
              />
            </div>
          </div>
          <SelectField
            label="Year Established"
            placeholder="Select year..."
            value={data.yearEstablished}
            onChange={(yearEstablished) => onChange({ yearEstablished })}
            options={Array.from({ length: 30 }, (_, i) => String(2025 - i))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Your role"
            placeholder="Select Your Role"
            value={data.yourRole}
            onChange={(yourRole) => onChange({ yourRole })}
            options={["Owner", "Director", "Team Lead", "Recruiter"]}
          />
          <SelectField
            label="Team Size"
            placeholder="Select team size..."
            value={data.teamSize}
            onChange={(teamSize) => onChange({ teamSize })}
            options={["1-5", "6-20", "21-50", "50+"]}
          />
        </div>

        <div className="rounded-md border border-grey-200 p-4">
          <h3 className="text-body-md font-semibold text-grey-900">Team Member</h3>
          <ul className="mt-3 space-y-2">
            {data.teamMembers.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-100 text-body-xs font-semibold text-orange-600">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-body-sm font-medium text-grey-900">{m.name}</p>
                    <p className="text-body-xs text-grey-500">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-body-xs font-medium", STATUS_STYLES[m.status])}>
                    {m.status}
                  </span>
                  {m.status === "Pending" ? (
                    <button type="button" className="text-body-xs font-medium text-orange-600 hover:text-orange-700">
                      Resend
                    </button>
                  ) : (
                    <span className="rounded-full bg-grey-100 px-2 py-0.5 text-body-xs font-medium text-grey-600">{m.role}</span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => onChange({ teamMembers: data.teamMembers.filter((x) => x.id !== m.id) })}
                    className="text-grey-400 hover:text-danger-500"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="teammate@agency.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-10"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addMember}>
              <Plus className="size-4" />
              Add Team Member
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Agency Logo</Label>
          <FileUploadBox hint="PNG, JPG, SVG up to 2MB" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            maxLength={MAX_BIO}
            value={data.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="Tell employers about your recruitment experience, approach, and what makes you unique..."
            className="w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
          />
          <p className="text-right text-body-xs text-grey-400">
            {data.bio.length}/{MAX_BIO}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <OnboardingFooter showBack={false} onCancel={onCancel} onContinue={onContinue} />
      </div>
    </div>
  );
}
