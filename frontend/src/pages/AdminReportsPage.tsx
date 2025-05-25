"use client"

import { useState, useEffect } from "react"
import { Eye, CheckCircle, XCircle, MessageSquare, FileText, User, Search } from "lucide-react"
import { Card } from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import AdminSidebar from "../components/AdminSidebar"
// Add import for adminService
import { getReports, updateReportStatus } from "../services/adminService"

// Report row component
function ReportRow({ report, onView, onResolve, onDismiss }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${
              report.type === "discussion"
                ? "bg-blue-100 text-blue-600"
                : report.type === "resource"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-green-100 text-green-600"
            } flex items-center justify-center`}
          >
            {report.type === "discussion" ? (
              <MessageSquare size={16} />
            ) : report.type === "resource" ? (
              <FileText size={16} />
            ) : (
              <User size={16} />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{report.title}</p>
            <p className="text-xs text-gray-500">
              Reported by {report.reporter.name} • {report.time}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant={
            report.reason === "spam"
              ? "yellow"
              : report.reason === "inappropriate"
                ? "red"
                : report.reason === "harassment"
                  ? "purple"
                  : "blue"
          }
        >
          {report.reason}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">{report.description}</td>
      <td className="py-3 px-4">
        <Badge variant={report.status === "pending" ? "yellow" : report.status === "resolved" ? "green" : "red"}>
          {report.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onView(report.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="View Report"
          >
            <Eye size={16} />
          </button>
          {report.status === "pending" && (
            <>
              <button
                onClick={() => onResolve(report.id)}
                className="p-1 text-gray-500 hover:text-green-600 rounded-md hover:bg-gray-100"
                title="Resolve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => onDismiss(report.id)}
                className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                title="Dismiss"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch reports
  // In the useEffect where you fetch reports, replace the mock data with actual API calls:
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = {
          status: filter !== "all" ? filter : undefined,
          search: searchTerm || undefined,
        }

        const response = await getReports(params)
        setReports(response.reports)
      } catch (err) {
        console.error("Error fetching reports:", err)
        setError("Failed to load reports. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [filter, searchTerm])

  // Filter reports
  const filteredReports = reports.filter((report) => {
    // Filter by status
    if (filter !== "all" && report.status !== filter) {
      return false
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        report.title.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term) ||
        report.reporter.name.toLowerCase().includes(term) ||
        report.reason.toLowerCase().includes(term)
      )
    }

    return true
  })

  // Handle view report
  const handleViewReport = (reportId) => {
    console.log("View report:", reportId)
    // Navigate to report details or show modal
    const report = reports.find((r) => r.id === reportId)
    if (report) {
      alert(`Viewing report: ${report.title}`)
      // In a real app, you would navigate to a detailed view or open a modal
    }
  }

  // Handle resolve report
  // Update the handleResolveReport function
  const handleResolveReport = async (reportId) => {
    try {
      await updateReportStatus(reportId, "resolved")
      // Update the local state
      setReports(reports.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r)))
    } catch (error) {
      console.error("Error resolving report:", error)
    }
  }

  // Handle dismiss report
  // Update the handleDismissReport function
  const handleDismissReport = async (reportId) => {
    try {
      await updateReportStatus(reportId, "dismissed")
      // Update the local state
      setReports(reports.map((r) => (r.id === reportId ? { ...r, status: "dismissed" } : r)))
    } catch (error) {
      console.error("Error dismissing report:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    variant="yellow"
                    leftIcon={<Search size={16} />}
                    className="w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm border-none focus:ring-2 focus:ring-[#4a3630]"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Reports</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3630]"></div>
                </div>
              ) : error ? (
                <Card className="p-6 text-center">
                  <div className="text-red-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reports</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button variant="primary" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </Card>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Report</th>
                          <th className="py-3 px-4">Reason</th>
                          <th className="py-3 px-4">Description</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.length > 0 ? (
                          filteredReports.map((report) => (
                            <ReportRow
                              key={report.id}
                              report={report}
                              onView={handleViewReport}
                              onResolve={handleResolveReport}
                              onDismiss={handleDismissReport}
                            />
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-500">
                              No reports found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredReports.length > 0 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{filteredReports.length}</span> of{" "}
                        <span className="font-medium">{reports.length}</span> reports
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                          Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
