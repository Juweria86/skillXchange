import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setHydrated, setToken, setUser } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";


import { SidebarProvider } from "./context/SidebarContext";
import { MessageProvider } from "./context/MessageContext";
import { ConnectionProvider } from "./context/ConnectionContext";
import AdminLayout from "./components/admin/AdminLayout"

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DateOfBirthPage from "./pages/DateOfBirthPage";
import PersonalDetails1Page from "./pages/PersonalDetails1Page";
import PersonalDetails2Page from "./pages/PersonalDetails2Page";
import UploadPicturesPage from "./pages/UploadPicturesPage";
import FindMatchPage from "./pages/FindMatchPage";
import CustomizeProfilePage from "./pages/CustomizeProfilePage";
import HomeDashboardPage from "./pages/HomeDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import MySkillsPage from "./pages/MySkillsPage";
import SkillMatchesPage from "./pages/SkillMatchesPage";
import MySessionsPage from "./pages/MySessionsPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import MessagesPage from "./pages/MessagesPage";
import CommunityPage from "./pages/CommunityPage";
import SettingsPage from "./pages/SettingsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";
import ResendVerificationPage from "./pages/ResendVerificationPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import RequireAuth from "./components/auth/RequireAuth.tsx";
import RequestSessionModal from "./components/connections/RequestSessionModal"
import OnboardingForm from "./pages/OnboardingForm.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.tsx";
import AdminReportsPage from "./pages/AdminReportsPage.tsx";
import AdminSettingsPage from "./pages/AdminSettingsPage.tsx";
import AdminResourcesPage from "./pages/AdminResourcesPage.tsx";
import AdminRoute from "./components/auth/AdminRoute.tsx";
import { UsersTable } from "./components/admin/UsersTable.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import DiscussionsPage from "./pages/DisscusionsPage.tsx";
import ChallengesPage from "./pages/ChallengesPage.tsx";
import AnnouncementsPage from "./pages/AnouncementPage.tsx";


function App() {
  const dispatch = useDispatch();

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (storedUser && storedToken) {
    const user = JSON.parse(storedUser);
    const token = storedToken;
    dispatch(setUser(user));
    dispatch(setToken(token));
  }
  console.log("Token after hydration:", storedToken);

  dispatch(setHydrated()); // ✅ Now part of Redux state
}, [dispatch]);
if (!setHydrated) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <ConnectionProvider>
        <MessageProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/date-of-birth" element={<DateOfBirthPage />} />
              <Route path="/personal-details-1" element={<PersonalDetails1Page />} />
              <Route path="/personal-details-2" element={<PersonalDetails2Page />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload-pictures" element={<UploadPicturesPage />} />
              <Route path="/find-match" element={<FindMatchPage />} />
              <Route path="/customize-profile" element={<CustomizeProfilePage />} />
              <Route path="/home-dashboard" element={<HomeDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/my-skills" element={<MySkillsPage />} />
              <Route path="/skill-matches" element={<SkillMatchesPage />} />
              <Route path="/my-sessions" element={<MySessionsPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
               <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/resend-verification" element={<ResendVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/onboarding" element={ <RequireAuth><OnboardingForm /></RequireAuth>} />
{/* <Route element={<AdminLayout />}> */}
  <Route element={<AdminRoute />}>
    <Route path="admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="admin/reports" element={<AdminReportsPage />} />
    <Route path="admin/resources" element={<AdminResourcesPage />} />
    <Route path="admin/settings" element={<AdminSettingsPage />} />
    <Route path="admin/users" element={<UsersPage />} />
    <Route path="admin/discussions" element={<DiscussionsPage />} />
    <Route path="admin/challenges" element={<ChallengesPage />} />
    <Route path="admin/announcements" element={<AnnouncementsPage />} />

    
  </Route>
{/* </Route> */}

      <Route path="/request" element={<RequestSessionModal connection={{
        id: "",
        name: "",
        avatar: "",
        skills: []
      }} isOpen={false} onClose={function (): void {
        throw new Error("Function not implemented.")
      } } onSubmit={function (sessionDetails: any): void {
        throw new Error("Function not implemented.")
      } } />} />
            </Routes>
        </MessageProvider>
      </ConnectionProvider>
    </SidebarProvider>
  );
}

export default App;
