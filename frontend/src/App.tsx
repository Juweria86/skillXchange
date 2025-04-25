import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DateOfBirthPage from "./pages/DateOfBirthPage"
import PersonalDetails1Page from "./pages/PersonalDetails1Page"
import PersonalDetails2Page from "./pages/PersonalDetails2Page"
import UploadPicturesPage from "./pages/UploadPicturesPage"
import DashboardPage from "./pages/DashboardPage"
import FindMatchPage from "./pages/FindMatchPage"
import CustomizeProfilePage from "./pages/CustomizeProfilePage"
import HomeDashboardPage from "./pages/HomeDashboardPage"
import ProfilePage from "./pages/ProfilePage"
import MySkillsPage from "./pages/MySkillsPage"
import SkillMatchesPage from "./pages/SkillMatchesPage"
import MySessionsPage from "./pages/MySessionsPage"
import MessagesPage from "./pages/MessagesPage"
import CommunityPage from "./pages/CommunityPage"
import SettingsPage from "./pages/SettingsPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/date-of-birth" element={<DateOfBirthPage />} />
      <Route path="/personal-details-1" element={<PersonalDetails1Page />} />
      <Route path="/personal-details-2" element={<PersonalDetails2Page />} />
      <Route path="/upload-pictures" element={<UploadPicturesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/find-match" element={<FindMatchPage />} />
      <Route path="/customize-profile" element={<CustomizeProfilePage />} />
      <Route path="/home-dashboard" element={<HomeDashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/my-skills" element={<MySkillsPage />} />
      <Route path="/skill-matches" element={<SkillMatchesPage />} />
      <Route path="/my-sessions" element={<MySessionsPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
