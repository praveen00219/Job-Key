import { MessageSquare } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "@/lib/routes";
import { RequireAuth } from "@/components/auth/RequireAuth";
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
import VacanciesListPage from "@/pages/employer/vacancies/VacanciesListPage";
import VacancyCreatePage from "@/pages/employer/vacancies/VacancyCreatePage";
import VacancyDetailPage from "@/pages/employer/vacancies/VacancyDetailPage";
import BidsPage from "@/pages/employer/BidsPage";
import OffersPage from "@/pages/employer/OffersPage";
import OfferDetailPage from "@/pages/employer/OfferDetailPage";
import InvoicesPage from "@/pages/employer/InvoicesPage";
import GetStartedPage from "@/pages/recruiter/GetStartedPage";
import RecruiterSignupPage from "@/pages/recruiter/RecruiterSignupPage";
import AgencySignupPage from "@/pages/recruiter/AgencySignupPage";
import RecruiterOnboardingPage from "@/pages/recruiter/RecruiterOnboardingPage";
import AgencyOnboardingPage from "@/pages/recruiter/AgencyOnboardingPage";
import UnderReviewPage from "@/pages/recruiter/UnderReviewPage";
import ActionRequiredPage from "@/pages/recruiter/ActionRequiredPage";
import ApplicationUnsuccessfulPage from "@/pages/recruiter/ApplicationUnsuccessfulPage";
import RecruiterDashboardPage from "@/pages/recruiter/RecruiterDashboardPage";
import AgencyTeamPage from "@/pages/recruiter/AgencyTeamPage";
import MarketplacePage from "@/pages/recruiter/MarketplacePage";
import CandidatesPage from "@/pages/recruiter/CandidatesPage";
import CandidateDetailPage from "@/pages/recruiter/CandidateDetailPage";
import SubmissionsPage from "@/pages/recruiter/SubmissionsPage";
import SubmitToVacancyPage from "@/pages/recruiter/SubmitToVacancyPage";
import EarningsPage from "@/pages/recruiter/EarningsPage";
import PublicJobPage from "@/pages/candidate/PublicJobPage";
import ApplyPage from "@/pages/candidate/ApplyPage";
import CandidateLoginPage from "@/pages/candidate/CandidateLoginPage";
import CandidateApplicationsPage from "@/pages/candidate/CandidateApplicationsPage";
import OfferResponsePage from "@/pages/candidate/OfferResponsePage";

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

      {/* Employer portal — guarded (A1) */}
      <Route element={<RequireAuth roles={["employer", "admin"]} />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />

        <Route path={ROUTES.settings} element={<Navigate to={ROUTES.settingsProfile} replace />} />
        <Route path={ROUTES.settingsProfile} element={<ProfileSettingsPage />} />
        <Route path={ROUTES.settingsTeam} element={<TeamSettingsPage />} />
        <Route path={ROUTES.settingsBenefits} element={<BenefitsSettingsPage />} />
        <Route path={ROUTES.settingsBilling} element={<BillingSettingsPage />} />
        <Route path={ROUTES.settingsNotifications} element={<NotificationsSettingsPage />} />
        <Route path={ROUTES.settingsSecurity} element={<SecuritySettingsPage />} />
        <Route path={ROUTES.settingsActivityLog} element={<ActivityLogSettingsPage />} />
        <Route path={ROUTES.settingsDataPrivacy} element={<DataPrivacySettingsPage />} />

        <Route path={ROUTES.vacancies} element={<VacanciesListPage />} />
        <Route path={ROUTES.vacancyNew} element={<VacancyCreatePage />} />
        <Route path={ROUTES.vacancyDetail} element={<VacancyDetailPage />} />

        <Route path={ROUTES.bids} element={<BidsPage />} />
        <Route path={ROUTES.offers} element={<OffersPage />} />
        <Route path={ROUTES.offerDetail} element={<OfferDetailPage />} />
        <Route path={ROUTES.invoices} element={<InvoicesPage />} />
      </Route>

      {/* Recruiter / Agency portal (Phase 5) */}
      <Route path={ROUTES.recruiterGetStarted} element={<GetStartedPage />} />
      <Route path={ROUTES.recruiterSignup} element={<RecruiterSignupPage />} />
      <Route path={ROUTES.agencySignup} element={<AgencySignupPage />} />
      <Route path={ROUTES.recruiterOnboarding} element={<RecruiterOnboardingPage />} />
      <Route path={ROUTES.agencyOnboarding} element={<AgencyOnboardingPage />} />
      <Route path={ROUTES.recruiterUnderReview} element={<UnderReviewPage />} />
      <Route path={ROUTES.recruiterActionRequired} element={<ActionRequiredPage />} />
      <Route path={ROUTES.recruiterUnsuccessful} element={<ApplicationUnsuccessfulPage />} />
      {/* Recruiter portal (authenticated area) — guarded (A1).
          Signup/onboarding/vetting-status routes above stay public until A5
          wires them to real accounts. */}
      <Route element={<RequireAuth roles={["recruiter", "admin"]} />}>
        <Route path={ROUTES.recruiterDashboard} element={<RecruiterDashboardPage />} />
        <Route path={ROUTES.recruiterTeam} element={<AgencyTeamPage />} />
        <Route path={ROUTES.recruiterMarketplace} element={<MarketplacePage />} />
        <Route path={ROUTES.recruiterCandidates} element={<CandidatesPage />} />
        <Route path={ROUTES.recruiterCandidateDetail} element={<CandidateDetailPage />} />
        <Route path={ROUTES.recruiterSubmissions} element={<SubmissionsPage />} />
        <Route path={ROUTES.recruiterSubmitToVacancy} element={<SubmitToVacancyPage />} />
        <Route path={ROUTES.recruiterEarnings} element={<EarningsPage />} />
      </Route>

      {/* Candidate portal: public job pages stay public (SEO/SSG); the
          application-tracking area is guarded (A1) */}
      <Route path={ROUTES.publicJob} element={<PublicJobPage />} />
      <Route path={ROUTES.publicJobApply} element={<ApplyPage />} />
      <Route path={ROUTES.candidateLogin} element={<CandidateLoginPage />} />
      <Route element={<RequireAuth roles={["candidate", "admin"]} />}>
        <Route path={ROUTES.candidateApplications} element={<CandidateApplicationsPage />} />
        <Route path={ROUTES.candidateOffer} element={<OfferResponsePage />} />
      </Route>

      {/* Employer: nav destinations not yet built (A8 decides messaging) */}
      <Route element={<RequireAuth roles={["employer", "admin"]} />}>
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
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
