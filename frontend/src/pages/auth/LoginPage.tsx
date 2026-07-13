import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ROLE_LANDING } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { loginSchema, type LoginValues } from "@/lib/validation";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setPendingEmail, sessionExpired } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginValues) => {
    setAuthError(null);
    const { status, role } = await login(values.email, values.password);
    if (status === "success" && role) navigate(ROLE_LANDING[role]);
    else if (status === "locked") navigate(ROUTES.accountLocked);
    else if (status === "unverified") {
      setPendingEmail(values.email);
      navigate(ROUTES.verifyEmail);
    } else setAuthError("Invalid email or password");
  };

  const emailInvalid = !!errors.email || !!authError;

  return (
    <AuthLayout>
      <AuthHeading title="Welcome Back to JobKey" subtitle="Log in to manage your recruitment needs" />

      {sessionExpired && (
        <p className="mt-6 rounded-md bg-warning-50 px-4 py-3 text-body-sm text-warning-700">
          Your session expired — please sign in again.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter registered email"
              autoComplete="email"
              error={emailInvalid}
              className={authError ? "pr-11" : undefined}
              {...register("email")}
            />
            {authError && (
              <CircleAlert className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-danger-500" />
            )}
          </div>
          {(errors.email || authError) && (
            <p className="text-body-sm text-danger-500">
              {errors.email?.message ?? authError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your Password"
            autoComplete="current-password"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-body-sm text-danger-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <label className="flex items-center gap-2.5">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
                <span className="text-body-sm text-grey-700">Remember Me</span>
              </label>
            )}
          />
          <Link
            to={ROUTES.forgotPassword}
            className="text-body-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Forgot password
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-body-md text-grey-600">
        Don&rsquo;t have an account?{" "}
        <Link to={ROUTES.signup} className="font-semibold text-brand-600 hover:text-brand-700">
          Register for free
        </Link>
      </p>
    </AuthLayout>
  );
}
