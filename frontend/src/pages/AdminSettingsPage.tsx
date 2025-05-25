"use client"

import { useState, useEffect } from "react"
import { Save, Globe, Bell, Shield, FileText } from "lucide-react"
import {Card} from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import AdminSidebar from "../components/AdminSidebar"
import { getSettings, updateSettings } from "../services/adminService"

// Setting section component
function SettingSection({ title, description, icon, children }) {
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#FBEAA0] flex items-center justify-center text-[#4a3630]">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-gray-500">{description}</p>
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </Card>
  )
}

// Toggle switch component
function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:ring-offset-2 ${
          checked ? "bg-[#4a3630]" : "bg-gray-200"
        }`}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

export default function AdminSettingsPage() {
  // General settings
  const [siteName, setSiteName] = useState("SkillSwap")
  const [siteDescription, setSiteDescription] = useState("A platform for skill sharing and learning")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [adminAlerts, setAdminAlerts] = useState(true)
  const [reportNotifications, setReportNotifications] = useState(true)

  // Content settings
  const [requireApproval, setRequireApproval] = useState(true)
  const [allowUserUploads, setAllowUserUploads] = useState(true)
  const [maxUploadSize, setMaxUploadSize] = useState(10)

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [passwordExpiry, setPasswordExpiry] = useState(90)
  const [loginAttempts, setLoginAttempts] = useState(5)

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      const settingsData = {
        general: {
          siteName,
          siteDescription,
          maintenanceMode,
        },
        notifications: {
          emailNotifications,
          adminAlerts,
          reportNotifications,
        },
        content: {
          requireApproval,
          allowUserUploads,
          maxUploadSize,
        },
        security: {
          twoFactorAuth,
          passwordExpiry,
          loginAttempts,
        },
      }

      await updateSettings(settingsData)
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    }
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings()

        // Update state with fetched settings
        if (settings.general) {
          if (settings.general.siteName) setSiteName(settings.general.siteName)
          if (settings.general.siteDescription) setSiteDescription(settings.general.siteDescription)
          if (settings.general.maintenanceMode !== undefined) setMaintenanceMode(settings.general.maintenanceMode)
        }

        if (settings.notifications) {
          if (settings.notifications.emailNotifications !== undefined)
            setEmailNotifications(settings.notifications.emailNotifications)
          if (settings.notifications.adminAlerts !== undefined) setAdminAlerts(settings.notifications.adminAlerts)
          if (settings.notifications.reportNotifications !== undefined)
            setReportNotifications(settings.notifications.reportNotifications)
        }

        if (settings.content) {
          if (settings.content.requireApproval !== undefined) setRequireApproval(settings.content.requireApproval)
          if (settings.content.allowUserUploads !== undefined) setAllowUserUploads(settings.content.allowUserUploads)
          if (settings.content.maxUploadSize !== undefined) setMaxUploadSize(settings.content.maxUploadSize)
        }

        if (settings.security) {
          if (settings.security.twoFactorAuth !== undefined) setTwoFactorAuth(settings.security.twoFactorAuth)
          if (settings.security.passwordExpiry !== undefined) setPasswordExpiry(settings.security.passwordExpiry)
          if (settings.security.loginAttempts !== undefined) setLoginAttempts(settings.security.loginAttempts)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <Button variant="primary" leftIcon={<Save size={16} />} onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* General Settings */}
            <SettingSection
              title="General Settings"
              description="Configure basic settings for your platform"
              icon={<Globe size={20} />}
            >
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <Input
                  id="siteName"
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  variant="yellow"
                />
              </div>

              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                  rows={3}
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                ></textarea>
              </div>

              <ToggleSwitch
                label="Maintenance Mode"
                description="When enabled, only admins can access the site"
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />
            </SettingSection>

            {/* Notification Settings */}
            <SettingSection
              title="Notification Settings"
              description="Configure how notifications are sent"
              icon={<Bell size={20} />}
            >
              <ToggleSwitch
                label="Email Notifications"
                description="Send email notifications to users"
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />

              <ToggleSwitch
                label="Admin Alerts"
                description="Receive alerts for important admin events"
                checked={adminAlerts}
                onChange={setAdminAlerts}
              />

              <ToggleSwitch
                label="Report Notifications"
                description="Receive notifications when content is reported"
                checked={reportNotifications}
                onChange={setReportNotifications}
              />
            </SettingSection>

            {/* Content Settings */}
            <SettingSection
              title="Content Settings"
              description="Configure how content is managed"
              icon={<FileText size={20} />}
            >
              <ToggleSwitch
                label="Require Content Approval"
                description="New content requires admin approval before publishing"
                checked={requireApproval}
                onChange={setRequireApproval}
              />

              <ToggleSwitch
                label="Allow User Uploads"
                description="Users can upload files and resources"
                checked={allowUserUploads}
                onChange={setAllowUserUploads}
              />

              <div>
                <label htmlFor="maxUploadSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Upload Size (MB)
                </label>
                <Input
                  id="maxUploadSize"
                  type="number"
                  min="1"
                  max="50"
                  value={maxUploadSize}
                  onChange={(e) => setMaxUploadSize(Number(e.target.value))}
                  variant="yellow"
                />
              </div>
            </SettingSection>

            {/* Security Settings */}
            <SettingSection
              title="Security Settings"
              description="Configure security options"
              icon={<Shield size={20} />}
            >
              <ToggleSwitch
                label="Two-Factor Authentication"
                description="Require 2FA for admin accounts"
                checked={twoFactorAuth}
                onChange={setTwoFactorAuth}
              />

              <div>
                <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Password Expiry (days)
                </label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  min="0"
                  max="365"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(Number(e.target.value))}
                  variant="yellow"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 to disable password expiry</p>
              </div>

              <div>
                <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Login Attempts
                </label>
                <Input
                  id="loginAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={loginAttempts}
                  onChange={(e) => setLoginAttempts(Number(e.target.value))}
                  variant="yellow"
                />
              </div>
            </SettingSection>
          </div>
        </main>
      </div>
    </div>
  )
}
