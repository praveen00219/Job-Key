import { Briefcase, FileText, Hand, MessageSquare, Send } from "lucide-react";
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
import DashboardPage from "@/pages/employer/DashboardPage";
import { ComingSoonPage } from "@/pages/employer/ComingSoonPage";
import ProfileSettingsPage from "@/pages/employer/settings/ProfileSettingsPage";
import TeamSettingsPage from "@/pages/employer/settings/TeamSettingsPage";
import BenefitsSettingsPage from "@/pages/employer/settings/BenefitsSettingsPage";
import BillingSettingsPage from "@/pages/employer/settings/BillingSettingsPage";
import NotificationsSettingsPage from "@/pages/employer/settings/NotificationsSettingsPage";
import SecuritySettingsPage from "@/pages/employer/settings/SecuritySettingsPage";
import ActivityLogSettingsPage from "@/pages/employer/settings/ActivityLogSettingsPage";
import DataPrivacySettingsPage from "@/pages/employer/settings/DataPrivacySettingsPage";

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

      {/* Employer: Dashboard (Phase 2) */}
      <Route path={ROUTES.dashboard} element={<DashboardPage />} />

      {/* Employer: Settings (Phase 2) */}
      <Route path={ROUTES.settings} element={<Navigate to={ROUTES.settingsProfile} replace />} />
      <Route path={ROUTES.settingsProfile} element={<ProfileSettingsPage />} />
      <Route path={ROUTES.settingsTeam} element={<TeamSettingsPage />} />
      <Route path={ROUTES.settingsBenefits} element={<BenefitsSettingsPage />} />
      <Route path={ROUTES.settingsBilling} element={<BillingSettingsPage />} />
      <Route path={ROUTES.settingsNotifications} element={<NotificationsSettingsPage />} />
      <Route path={ROUTES.settingsSecurity} element={<SecuritySettingsPage />} />
      <Route path={ROUTES.settingsActivityLog} element={<ActivityLogSettingsPage />} />
      <Route path={ROUTES.settingsDataPrivacy} element={<DataPrivacySettingsPage />} />

      {/* Employer: nav destinations not yet built (Phase 3+) */}
      <Route
        path={ROUTES.vacancies}
        element={
          <ComingSoonPage
            title="Vacancies"
            subtitle="Create and manage your job vacancies"
            icon={Briefcase}
            description="The vacancy creation wizard and Kanban pipeline are coming in the next phase."
          />
        }
      />
      <Route
        path={ROUTES.bids}
        element={
          <ComingSoonPage
            title="Bids"
            subtitle="Review recruiter submissions and commission bids"
            icon={Hand}
            description="Recruiter bid review and acceptance workflow are coming in a later phase."
          />
        }
      />
      <Route
        path={ROUTES.offers}
        element={
          <ComingSoonPage
            title="Offers"
            subtitle="Track and manage candidate offers"
            icon={Send}
            description="Offer creation, negotiation, and status tracking are coming in a later phase."
          />
        }
      />
      <Route
        path={ROUTES.invoices}
        element={
          <ComingSoonPage
            title="Invoices"
            subtitle="View and pay recruiter placement invoices"
            icon={FileText}
            description="Invoice generation and Stripe payment are coming in a later phase."
          />
        }
      />
      <Route
        path={ROUTES.messages}
        element={
          <ComingSoonPage
            title="Messages"
            subtitle="Communicate with candidates and recruiters"
            icon={MessageSquare}
            description="In-platform messaging is coming in a later phase."
          />
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
