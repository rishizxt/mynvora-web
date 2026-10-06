// =========================================================
// MYNVORA — APP ROOT
// =========================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './navigation/routes.js';
import RequireVerified from './components/RequireVerified.jsx';

import Welcome from './pages/auth/Welcome.jsx';
import SignupOptions from './pages/auth/SignupOptions.jsx';
import SignupEmail from './pages/auth/SignupEmail.jsx';
import SignupPhone from './pages/auth/SignupPhone.jsx';
import OTPVerify from './pages/auth/OTPVerify.jsx';
import Login from './pages/auth/Login.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetOTP from './pages/auth/ResetOTP.jsx';
import ResetNewPassword from './pages/auth/ResetNewPassword.jsx';

import HouseRules from './pages/onboarding/HouseRules.jsx';
import FirstName from './pages/onboarding/FirstName.jsx';
import Birthday from './pages/onboarding/Birthday.jsx';
import Gender from './pages/onboarding/Gender.jsx';
import Orientation from './pages/onboarding/Orientation.jsx';
import InterestedIn from './pages/onboarding/InterestedIn.jsx';
import Distance from './pages/onboarding/Distance.jsx';
import LookingFor from './pages/onboarding/LookingFor.jsx';
import College from './pages/onboarding/College.jsx';
import Interests from './pages/onboarding/Interests.jsx';
import Photos from './pages/onboarding/Photos.jsx';
import AboutMe from './pages/onboarding/AboutMe.jsx';
import Location from './pages/onboarding/Location.jsx';
import Selfie from './pages/onboarding/Selfie.jsx';

import Swipe from './pages/main/Swipe.jsx';
import Explore from './pages/main/Explore.jsx';
import CategoryGroup from './pages/main/CategoryGroup.jsx';
import Likes from './pages/main/Likes.jsx';
import Chat from './pages/main/Chat.jsx';
import ChatRoom from './pages/main/ChatRoom.jsx';
import TeamMynvoraChat from './pages/main/TeamMynvoraChat.jsx';
import Profile from './pages/main/Profile.jsx';
import ProfileDetail from './pages/main/ProfileDetail.jsx';

import Plans from './pages/subscription/Plans.jsx';

import Settings from './pages/settings/Settings.jsx';
import EditProfile from './pages/settings/EditProfile.jsx';
import EditInterests from './pages/settings/EditInterests.jsx';
import EditPrompts from './pages/settings/EditPrompts.jsx';
import EditIntentions from './pages/settings/EditIntentions.jsx';
import EditBasics from './pages/settings/EditBasics.jsx';
import EditLifestyle from './pages/settings/EditLifestyle.jsx';
import Privacy from './pages/settings/Privacy.jsx';
import Discovery from './pages/settings/Discovery.jsx';
import Notifications from './pages/settings/Notifications.jsx';
import ChangeEmail from './pages/settings/ChangeEmail.jsx';
import ChangePhone from './pages/settings/ChangePhone.jsx';
import Payments from './pages/settings/Payments.jsx';
import BlockedContacts from './pages/settings/BlockedContacts.jsx';
import WebProfile from './pages/settings/WebProfile.jsx';
import HelpCenter from './pages/settings/HelpCenter.jsx';
import Legal from './pages/settings/Legal.jsx';
import DeleteAccount from './pages/settings/DeleteAccount.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import UserDetail from './pages/admin/UserDetail.jsx';
import VerificationQueue from './pages/admin/VerificationQueue.jsx';
import VerificationDetail from './pages/admin/VerificationDetail.jsx';
import Reports from './pages/admin/Reports.jsx';
import ReportDetail from './pages/admin/ReportDetail.jsx';
import AISafety from './pages/admin/AISafety.jsx';
import PhotoModeration from './pages/admin/PhotoModeration.jsx';
import FlaggedContent from './pages/admin/FlaggedContent.jsx';
import CommunicationSafety from './pages/admin/CommunicationSafety.jsx';
import AgeSafety from './pages/admin/AgeSafety.jsx';
import Subscriptions from './pages/admin/Subscriptions.jsx';
import Finance from './pages/admin/Finance.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import NotificationsAdmin from './pages/admin/Notifications.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';
import AdminsRoles from './pages/admin/AdminsRoles.jsx';
import SettingsAdmin from './pages/admin/Settings.jsx';
import Security from './pages/admin/Security.jsx';

export default function App() {
  return (
    <div className="app">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Routes>
        <Route path={ROUTES.WELCOME} element={<Welcome />} />
        <Route path={ROUTES.SIGNUP_OPTIONS} element={<SignupOptions />} />
        <Route path={ROUTES.SIGNUP_EMAIL} element={<SignupEmail />} />
        <Route path={ROUTES.SIGNUP_PHONE} element={<SignupPhone />} />
        <Route path={ROUTES.OTP_VERIFY} element={<OTPVerify />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.FORGOT} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_OTP} element={<ResetOTP />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetNewPassword />} />

        <Route path={ROUTES.ONBOARDING_HOUSE_RULES} element={<HouseRules />} />
        <Route path={ROUTES.ONBOARDING_FIRST_NAME} element={<FirstName />} />
        <Route path={ROUTES.ONBOARDING_BIRTHDAY} element={<Birthday />} />
        <Route path={ROUTES.ONBOARDING_GENDER} element={<Gender />} />
        <Route path={ROUTES.ONBOARDING_ORIENTATION} element={<Orientation />} />
        <Route path={ROUTES.ONBOARDING_INTERESTED_IN} element={<InterestedIn />} />
        <Route path={ROUTES.ONBOARDING_DISTANCE} element={<Distance />} />
        <Route path={ROUTES.ONBOARDING_LOOKING_FOR} element={<LookingFor />} />
        <Route path={ROUTES.ONBOARDING_COLLEGE} element={<College />} />
        <Route path={ROUTES.ONBOARDING_INTERESTS} element={<Interests />} />
        <Route path={ROUTES.ONBOARDING_PHOTOS} element={<Photos />} />
        <Route path={ROUTES.ONBOARDING_ABOUT_ME} element={<AboutMe />} />
        <Route path={ROUTES.ONBOARDING_LOCATION} element={<Location />} />
        <Route path={ROUTES.ONBOARDING_SELFIE} element={<Selfie />} />

        <Route path={ROUTES.DISCOVER} element={<RequireVerified><Swipe /></RequireVerified>} />
        <Route path={ROUTES.EXPLORE} element={<RequireVerified><Explore /></RequireVerified>} />
        <Route path="/explore/:categoryId" element={<RequireVerified><CategoryGroup /></RequireVerified>} />
        <Route path={ROUTES.LIKES} element={<RequireVerified><Likes /></RequireVerified>} />
        <Route path={ROUTES.CHAT} element={<RequireVerified><Chat /></RequireVerified>} />
        <Route path="/chat/team-mynvora" element={<RequireVerified><TeamMynvoraChat /></RequireVerified>} />
        <Route path="/chat/:id" element={<RequireVerified><ChatRoom /></RequireVerified>} />
        <Route path={ROUTES.PROFILE} element={<RequireVerified><Profile /></RequireVerified>} />
        <Route path="/profile/:id" element={<RequireVerified><ProfileDetail /></RequireVerified>} />

        <Route path={ROUTES.SUBSCRIPTION} element={<Plans />} />

        <Route path="/settings" element={<RequireVerified><Settings /></RequireVerified>} />
        <Route path="/settings/edit-profile" element={<RequireVerified><EditProfile /></RequireVerified>} />
        <Route path="/settings/interests" element={<RequireVerified><EditInterests /></RequireVerified>} />
        <Route path="/settings/prompts" element={<RequireVerified><EditPrompts /></RequireVerified>} />
        <Route path="/settings/intentions" element={<RequireVerified><EditIntentions /></RequireVerified>} />
        <Route path="/settings/basics" element={<RequireVerified><EditBasics /></RequireVerified>} />
        <Route path="/settings/lifestyle" element={<RequireVerified><EditLifestyle /></RequireVerified>} />
        <Route path="/settings/privacy" element={<RequireVerified><Privacy /></RequireVerified>} />
        <Route path="/settings/discovery" element={<RequireVerified><Discovery /></RequireVerified>} />
        <Route path="/settings/notifications" element={<RequireVerified><Notifications /></RequireVerified>} />
        <Route path="/settings/account" element={<RequireVerified><Settings /></RequireVerified>} />
        <Route path="/settings/change-email" element={<RequireVerified><ChangeEmail /></RequireVerified>} />
        <Route path="/settings/change-phone" element={<RequireVerified><ChangePhone /></RequireVerified>} />
        <Route path="/settings/payments" element={<RequireVerified><Payments /></RequireVerified>} />
        <Route path="/settings/blocked" element={<RequireVerified><BlockedContacts /></RequireVerified>} />
        <Route path="/settings/web-profile" element={<RequireVerified><WebProfile /></RequireVerified>} />
        <Route path="/settings/help" element={<RequireVerified><HelpCenter /></RequireVerified>} />
        <Route path="/settings/legal" element={<RequireVerified><Legal /></RequireVerified>} />
        <Route path="/settings/delete-account" element={<RequireVerified><DeleteAccount /></RequireVerified>} />

        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<ProtectedAdminRoute section="dashboard"><Dashboard /></ProtectedAdminRoute>} />
          <Route path="users" element={<ProtectedAdminRoute section="users"><Users /></ProtectedAdminRoute>} />
          <Route path="users/:id" element={<ProtectedAdminRoute section="users"><UserDetail /></ProtectedAdminRoute>} />
          <Route path="verification" element={<ProtectedAdminRoute section="verification"><VerificationQueue /></ProtectedAdminRoute>} />
          <Route path="verification/:id" element={<ProtectedAdminRoute section="verification"><VerificationDetail /></ProtectedAdminRoute>} />
          <Route path="reports" element={<ProtectedAdminRoute section="reports"><Reports /></ProtectedAdminRoute>} />
          <Route path="reports/:id" element={<ProtectedAdminRoute section="reports"><ReportDetail /></ProtectedAdminRoute>} />
          <Route path="ai-safety" element={<ProtectedAdminRoute section="aiSafety"><AISafety /></ProtectedAdminRoute>} />
          <Route path="photos" element={<ProtectedAdminRoute section="photos"><PhotoModeration /></ProtectedAdminRoute>} />
          <Route path="flagged" element={<ProtectedAdminRoute section="flagged"><FlaggedContent /></ProtectedAdminRoute>} />
          <Route path="comms" element={<ProtectedAdminRoute section="comms"><CommunicationSafety /></ProtectedAdminRoute>} />
          <Route path="age-safety" element={<ProtectedAdminRoute section="ageSafety"><AgeSafety /></ProtectedAdminRoute>} />
          <Route path="subscriptions" element={<ProtectedAdminRoute section="subscriptions"><Subscriptions /></ProtectedAdminRoute>} />
          <Route path="finance" element={<ProtectedAdminRoute section="finance"><Finance /></ProtectedAdminRoute>} />
          <Route path="analytics" element={<ProtectedAdminRoute section="analytics"><Analytics /></ProtectedAdminRoute>} />
          <Route path="notifications" element={<ProtectedAdminRoute section="notifications"><NotificationsAdmin /></ProtectedAdminRoute>} />
          <Route path="audit-logs" element={<ProtectedAdminRoute section="auditLogs"><AuditLogs /></ProtectedAdminRoute>} />
          <Route path="admins-roles" element={<ProtectedAdminRoute section="adminsRoles"><AdminsRoles /></ProtectedAdminRoute>} />
          <Route path="settings" element={<ProtectedAdminRoute section="settings"><SettingsAdmin /></ProtectedAdminRoute>} />
          <Route path="security" element={<ProtectedAdminRoute section="security"><Security /></ProtectedAdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.WELCOME} replace />} />
      </Routes>
    </div>
  );
}
