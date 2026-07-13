import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { SettingsPageShell } from "@/components/employer/SettingsPageShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiFetch, ApiError, setTokens } from "@/lib/api";

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

/** Security settings (wired in module A1): authenticated password change.
 * Sessions/2FA arrive with later hardening modules. */
export default function SecuritySettingsPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSubmit = current.length > 0 && next.length >= 8 && next === confirm && !saving;

  const submit = async () => {
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      // The backend invalidates every other session and returns a fresh
      // token pair — swap it in so this session continues seamlessly.
      const pair = await apiFetch<TokenPair>("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      setTokens(pair.access_token, pair.refresh_token);
      setSaved(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsPageShell title="Security" subtitle="Manage password, sessions, and two-factor authentication">
      <div className="max-w-[480px] rounded-lg bg-white p-5">
        <h2 className="text-heading-sm font-semibold text-grey-950">Change password</h2>
        <p className="mt-1 text-body-sm text-grey-500">
          Changing your password signs you out of every other device.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>

          <div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </div>
            <PasswordStrengthMeter password={next} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={confirm.length > 0 && confirm !== next}
            />
            {confirm.length > 0 && confirm !== next && (
              <p className="text-body-sm text-danger-500">Passwords don&rsquo;t match</p>
            )}
          </div>

          {error && <p className="rounded-md bg-danger-50 px-4 py-3 text-body-sm text-danger-600">{error}</p>}
          {saved && (
            <p className="flex items-center gap-2 rounded-md bg-success-50 px-4 py-3 text-body-sm text-success-600">
              <CheckCircle2 className="size-4" />
              Password updated. Other sessions have been signed out.
            </p>
          )}

          <Button type="submit" size="md" disabled={!canSubmit} loading={saving}>
            Update Password
          </Button>
        </form>
      </div>
    </SettingsPageShell>
  );
}
