import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { BackLink } from "@/components/auth/BackLink";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const password = watch("password") ?? "";

  const onSubmit = async (values: ResetPasswordValues) => {
    await resetPassword(values.password);
    navigate(ROUTES.resetPasswordSuccess);
  };

  return (
    <AuthLayout>
      {/* Title copy matches the Figma export verbatim (design reuses the sign-up heading). */}
      <AuthHeading
        title="Create Your Employer Account"
        subtitle="Choose a strong password that meets all security requirements."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5" noValidate>
        <div>
          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <PasswordInput
              id="password"
              placeholder="Create Password"
              autoComplete="new-password"
              error={!!errors.password}
              {...register("password")}
            />
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-body-sm text-grey-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Reset password
        </Button>
      </form>

      <div className="mt-6 flex justify-center">
        <BackLink to={ROUTES.login}>Back to Sign In</BackLink>
      </div>
    </AuthLayout>
  );
}
