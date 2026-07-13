import { useState } from "react";
import { Linkedin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

/**
 * Candidate sign-in (PRD: LinkedIn OAuth is the primary path; email/password
 * is the deliberately less prominent fallback). Email login is real (A1);
 * the LinkedIn button is a dev stub until module A10's OAuth lands — it signs
 * in as the seeded demo candidate so the guarded portal stays reachable.
 */
export default function CandidateLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signInWithLinkedIn = async () => {
    setLinkedinLoading(true);
    setError(null);
    // Dev stub until A10 LinkedIn OAuth: authenticate as the seeded candidate.
    const { status } = await login("candidate@jobkey.dev", "password123");
    setLinkedinLoading(false);
    if (status === "success") navigate(ROUTES.candidateApplications);
    else setError("Demo candidate sign-in failed — is the backend running and seeded?");
  };

  const signInWithEmail = async () => {
    setError(null);
    const { status } = await login(email, password);
    if (status === "success") navigate(ROUTES.candidateApplications);
    else if (status === "locked") setError("Account temporarily locked. Try again in 30 minutes.");
    else if (status === "unverified") setError("Please verify your email before signing in.");
    else setError("Invalid email or password");
  };

  return (
    <AuthLayout>
      <AuthHeading title="Welcome to JobKey" subtitle="Sign in to track your applications and respond to offers" />

      <div className="mt-9">
        <Button
          type="button"
          className="w-full bg-[#0A66C2] hover:bg-[#004182]"
          onClick={signInWithLinkedIn}
          disabled={linkedinLoading}
        >
          {linkedinLoading ? <Loader2 className="size-5 animate-spin" /> : <Linkedin className="size-5" />}
          {linkedinLoading ? "Connecting to LinkedIn…" : "Sign in with LinkedIn"}
        </Button>
        <p className="mt-2 text-center text-body-xs text-grey-500">
          We&rsquo;ll pull your name, photo, and work history so you don&rsquo;t have to type them.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-danger-50 px-4 py-3 text-body-sm text-danger-600">{error}</p>
        )}

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-grey-200" />
          <span className="text-body-sm text-grey-500">or</span>
          <span className="h-px flex-1 bg-grey-200" />
        </div>

        {showEmail ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void signInWithEmail();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="candEmail">Email</Label>
              <Input
                id="candEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="candPassword">Password</Label>
              <PasswordInput
                id="candPassword"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full" disabled={!email || !password}>
              Sign in with Email
            </Button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowEmail(true)}
            className="w-full text-center text-body-sm font-medium text-grey-600 hover:text-grey-900"
          >
            Continue with email instead
          </button>
        )}
      </div>
    </AuthLayout>
  );
}
