import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "@/lib/routes";
import SignupPage from "@/pages/auth/SignupPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import EmailVerifiedPage from "@/pages/auth/EmailVerifiedPage";
import VerificationExpiredPage from "@/pages/auth/VerificationExpiredPage";
import LoginPage from "@/pages/auth/LoginPage";
import AccountLockedPage from "@/pages/auth/AccountLockedPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ForgotPasswordSentPage from "@/pages/auth/ForgotPasswordSentPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import PasswordUpdatedPage from "@/pages/auth/PasswordUpdatedPage";
import ResetLinkExpiredPage from "@/pages/auth/ResetLinkExpiredPage";
import DashboardPlaceholder from "@/pages/DashboardPlaceholder";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.login} replace />} />

      {/* Sign up + email verification */}
      <Route path={ROUTES.signup} element={<SignupPage />} />
      <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
      <Route path={ROUTES.verifyEmailSuccess} element={<EmailVerifiedPage />} />
      <Route path={ROUTES.verifyEmailExpired} element={<VerificationExpiredPage />} />

      {/* Sign in */}
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.accountLocked} element={<AccountLockedPage />} />

      {/* Password reset */}
      <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.forgotPasswordSent} element={<ForgotPasswordSentPage />} />
      <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
      <Route path={ROUTES.resetPasswordSuccess} element={<PasswordUpdatedPage />} />
      <Route path={ROUTES.resetPasswordExpired} element={<ResetLinkExpiredPage />} />

      {/* Authenticated placeholder (Phase 2) */}
      <Route path={ROUTES.dashboard} element={<DashboardPlaceholder />} />

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
