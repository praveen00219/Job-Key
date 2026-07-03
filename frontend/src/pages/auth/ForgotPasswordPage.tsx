import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { BackLink } from "@/components/auth/BackLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    await requestPasswordReset(values.email);
    navigate(ROUTES.forgotPasswordSent);
  };

  return (
    <AuthLayout>
      <AuthHeading
        title="Reset Your Password"
        subtitle="Enter your email address and we'll send you a link to reset your password"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-6" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter registered email"
            autoComplete="email"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-body-sm text-danger-500">{errors.email.message}</p>
          )}
        </div>

        {/* Copy matches the Figma export verbatim (design reads "Resend Email"). */}
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Resend Email
        </Button>
      </form>

      <div className="mt-6 flex justify-center">
        <BackLink to={ROUTES.login}>Back to Sign In</BackLink>
      </div>

      <p className="mt-6 text-center text-body-md text-grey-600">
        Don&rsquo;t have an account?{" "}
        <Link to={ROUTES.signup} className="font-semibold text-brand-600 hover:text-brand-700">
          Register for free
        </Link>
      </p>
    </AuthLayout>
  );
}
