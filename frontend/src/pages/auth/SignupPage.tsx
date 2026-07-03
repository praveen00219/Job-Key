import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { signupSchema, type SignupValues } from "@/lib/validation";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", acceptTerms: false as unknown as true },
    mode: "onTouched",
  });

  const password = watch("password") ?? "";

  const onSubmit = async (values: SignupValues) => {
    await signup(values.email, values.password);
    navigate(ROUTES.verifyEmail);
  };

  return (
    <AuthLayout>
      <AuthHeading
        title="Create Your Employer Account"
        subtitle="Get started by setting up your credentials."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-body-sm text-danger-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
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

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2.5">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
                <span className="text-body-sm text-grey-700">
                  I agree to the{" "}
                  <Link
                    to="#"
                    className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
                  >
                    Terms &amp; Conditions
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-body-sm text-danger-500">{errors.acceptTerms.message}</p>
              )}
            </div>
          )}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-body-md text-grey-600">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-semibold text-brand-600 hover:text-brand-700">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
