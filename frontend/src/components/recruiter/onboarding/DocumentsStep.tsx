import { FileUploadBox } from "@/components/recruiter/FileUploadBox";
import { OnboardingFooter } from "@/components/recruiter/OnboardingFooter";

interface DocumentRequirement {
  title: string;
  description: string;
  required?: boolean;
}

interface DocumentsStepProps {
  requirements: DocumentRequirement[];
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function DocumentsStep({ requirements, onBack, onCancel, onContinue }: DocumentsStepProps) {
  return (
    <div>
      <h1 className="text-heading-lg font-semibold text-grey-950">Verify Your Documents</h1>
      <p className="mt-1 text-body-sm text-grey-600">
        Upload documents to complete your verification. This helps us maintain a trusted marketplace.
      </p>

      <div className="mt-6 space-y-6 rounded-lg bg-white p-5">
        {requirements.map((req) => (
          <div key={req.title} className="space-y-2">
            <div>
              <p className="text-body-md font-medium text-grey-900">
                {req.title}
                {req.required && <span className="text-danger-500"> *</span>}
              </p>
              <p className="text-body-sm text-grey-500">{req.description}</p>
            </div>
            <FileUploadBox hint="Accepted formats: PDF, JPG, PNG · Max size: 10MB" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <OnboardingFooter onBack={onBack} onCancel={onCancel} onContinue={onContinue} />
      </div>
    </div>
  );
}
