import { useState } from "react";
import { CheckCircle2, ChevronDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/employer/vacancies/TagInput";
import { DualRangeSlider } from "@/components/employer/vacancies/DualRangeSlider";
import { FileUploadBox } from "@/components/recruiter/FileUploadBox";

const MAX_SUMMARY = 500;

interface AddCandidateModalProps {
  onClose: () => void;
}

export function AddCandidateModal({ onClose }: AddCandidateModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>(["Python", "AWS", "Docker"]);
  const [salaryMin, setSalaryMin] = useState(80000);
  const [salaryMax, setSalaryMax] = useState(100000);
  const [locations, setLocations] = useState<string[]>(["United Kingdom", "Europe (EU)"]);
  const [summary, setSummary] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-grey-950/40" />
      <div className="relative flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between bg-orange-100 p-5">
          <h2 className="text-heading-sm font-semibold text-grey-950">Add New Candidate</h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="text-grey-500 hover:text-grey-800">
            <X className="size-5" />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <CheckCircle2 className="size-10 text-success-600" />
            <h3 className="text-heading-sm font-semibold text-grey-950">Candidate added successfully</h3>
            <p className="max-w-[38ch] text-body-sm text-grey-500">
              {fullName || "The candidate"} is now in your CRM and ready to submit to vacancies.
            </p>
            <Button className="mt-2 bg-grey-950 hover:bg-grey-800" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <section className="space-y-4">
                <h3 className="text-body-md font-semibold text-grey-950">Personal Details</h3>
                <div className="space-y-1.5">
                  <Label>Upload Resume</Label>
                  <FileUploadBox hint="PDF, DOC, DOCX up to 5MB" compact />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="candName">
                    Full name <span className="text-danger-500">*</span>
                  </Label>
                  <Input id="candName" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="candPhone">
                      Phone number <span className="text-danger-500">*</span>
                    </Label>
                    <Input id="candPhone" placeholder="+44 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="candEmail">Email</Label>
                    <Input id="candEmail" type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="candLinkedin">LinkedIn Profile URL</Label>
                  <Input
                    id="candLinkedin"
                    placeholder="linkedin.com/in/yourprofile"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                  <p className="text-body-xs text-grey-400">Used as the unique ID for duplicate detection</p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-body-md font-semibold text-grey-950">Professional Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="candTitle">Current Title</Label>
                    <Input id="candTitle" placeholder="e.g. Senior Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="candCompany">Current Company</Label>
                    <Input id="candCompany" placeholder="e.g. TechCorp" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="candLocation">Location</Label>
                  <Input id="candLocation" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Skills</Label>
                  <TagInput tags={skills} onChange={setSkills} placeholder="Add skills" />
                </div>
                <div className="space-y-1.5">
                  <Label>Years of Experience</Label>
                  <div className="relative">
                    <select className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs">
                      <option>Select experience level</option>
                      <option>0-2 years</option>
                      <option>3-5 years</option>
                      <option>6-10 years</option>
                      <option>10+ years</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex items-center justify-center gap-1.5 rounded-md border border-grey-200 py-2.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50">
                    <Plus className="size-4" />
                    Work History
                  </button>
                  <button type="button" className="flex items-center justify-center gap-1.5 rounded-md border border-grey-200 py-2.5 text-body-sm font-medium text-grey-700 hover:bg-grey-50">
                    <Plus className="size-4" />
                    Education
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-body-md font-semibold text-grey-950">Preferences</h3>
                <div className="space-y-2">
                  <Label>Annual Salary Range</Label>
                  <DualRangeSlider min={0} max={300000} step={1000} from={salaryMin} to={salaryMax} onChange={(a, b) => { setSalaryMin(a); setSalaryMax(b); }} />
                  <div className="flex items-center justify-between text-body-sm text-grey-700">
                    <span>
                      Min <span className="ml-1 rounded bg-grey-100 px-2 py-1 font-medium">${salaryMin.toLocaleString()}</span>
                    </span>
                    <span>
                      Max <span className="ml-1 rounded bg-grey-100 px-2 py-1 font-medium">${salaryMax.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Notice Period</Label>
                  <div className="relative">
                    <select className="h-11 w-full appearance-none rounded-md border border-grey-200 bg-white px-3.5 text-body-md text-grey-900 shadow-xs">
                      <option>Select notice period</option>
                      <option>Immediate</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                      <option>2 months</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grey-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred Locations</Label>
                  <TagInput tags={locations} onChange={setLocations} placeholder="Search locations" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="candSummary">Summary</Label>
                  <textarea
                    id="candSummary"
                    rows={3}
                    maxLength={MAX_SUMMARY}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Add Summary"
                    className="w-full resize-none rounded-md border border-grey-200 bg-grey-100 px-3.5 py-3 text-body-md text-grey-900 shadow-xs placeholder:text-grey-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15"
                  />
                  <p className="text-right text-body-xs text-grey-400">
                    {summary.length}/{MAX_SUMMARY}
                  </p>
                </div>
              </section>
            </div>

            <div className="flex justify-between border-t border-grey-100 p-5">
              <Button variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button size="md" className="bg-grey-950 hover:bg-grey-800" disabled={!fullName.trim() || !phone.trim()} onClick={() => setSaved(true)}>
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
