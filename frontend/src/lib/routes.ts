/** Central route table for the auth flow (avoids stringly-typed navigation). */
export const ROUTES = {
  signup: "/signup",
  verifyEmail: "/verify-email",
  verifyEmailSuccess: "/verify-email/success",
  verifyEmailExpired: "/verify-email/expired",
  login: "/login",
  accountLocked: "/account-locked",
  forgotPassword: "/forgot-password",
  forgotPasswordSent: "/forgot-password/sent",
  resetPassword: "/reset-password",
  resetPasswordSuccess: "/reset-password/success",
  resetPasswordExpired: "/reset-password/expired",
  dashboard: "/dashboard",
} as const;
