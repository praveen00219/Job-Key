import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { RecruiterAuthLayout } from "@/components/recruiter/RecruiterAuthLayout";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { signupSchema, type SignupValues } from "@/lib/validation";

interface RecruiterSignupFormProps {
  title: string;
  subtitle: string;
  onSuccessRoute: string;
}

export function RecruiterSignupForm({ title, subtitle, onSuccessRoute }: RecruiterSignupFormProps) {
  const navigate = useNavigate();

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

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    navigate(onSuccessRoute);
  };

  return (
    <RecruiterAuthLayout>
      <AuthHeading title={title} subtitle={subtitle} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && <p className="text-body-sm text-danger-500">{errors.email.message}</p>}
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
                <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                <span className="text-body-sm text-grey-700">
                  I agree to the{" "}
                  <Link
                    to="#"
                    className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700"
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

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          loading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-body-md text-grey-600">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-semibold text-orange-600 hover:text-orange-700">
          Login
        </Link>
      </p>
    </RecruiterAuthLayout>
  );
}
