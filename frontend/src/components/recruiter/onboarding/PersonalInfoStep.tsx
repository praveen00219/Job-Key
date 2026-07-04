import { Globe, Linkedin } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/employer/vacancies/TagInput";
import { FileUploadBox } from "@/components/recruiter/FileUploadBox";
import { OnboardingFooter } from "@/components/recruiter/OnboardingFooter";
import type { RecruiterOnboardingState } from "@/lib/recruiterOnboarding";

const MAX_BIO = 500;

interface PersonalInfoStepProps {
  data: RecruiterOnboardingState["personalInfo"];
  onChange: (patch: Partial<RecruiterOnboardingState["personalInfo"]>) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function PersonalInfoStep({ data, onChange, onCancel, onContinue }: PersonalInfoStepProps) {
  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Set Up Your Profile</h1>
      <p className="mt-1 text-body-sm text-grey-600">
        Help employers learn about you and build trust with a complete profile.
      </p>

      <div className="mt-6 space-y-5 rounded-lg bg-white p-5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">
            Full name <span className="text-danger-500">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone number <span className="text-danger-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="+44 (555) 000-0000"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">Your Website URL</Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
              <Input
                id="website"
                className="pl-10"
                placeholder="https://yourwebsite.com"
                value={data.websiteUrl}
                onChange={(e) => onChange({ websiteUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="linkedin">
            LinkedIn Profile URL <span className="text-danger-500">*</span>
          </Label>
          <div className="relative">
            <Linkedin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
            <Input
              id="linkedin"
              className="pl-10"
              placeholder="linkedin.com/in/yourprofile"
              value={data.linkedinUrl}
              onChange={(e) => onChange({ linkedinUrl: e.target.value })}
            />
          </div>
          <p className="text-body-sm text-grey-500">We use this to verify your professional background</p>
        </div>

        <div className="space-y-1.5">
          <Label>Profile picture</Label>
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

        <div className="space-y-1.5">
          <Label>Languages</Label>
          <TagInput
            tags={data.languages}
            onChange={(languages) => onChange({ languages })}
            placeholder="Search Languages"
          />
        </div>
      </div>

      <div className="mt-6">
        <OnboardingFooter showBack={false} onCancel={onCancel} onContinue={onContinue} />
      </div>
    </div>
  );
}
