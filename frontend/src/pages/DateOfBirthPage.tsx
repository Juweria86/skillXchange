"use client"

import { Link } from "react-router-dom"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DateOfBirthPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const isSelected = dateString === selectedDate

      days.push(
        <button
          key={day}
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            isSelected ? "bg-[#4a3630] text-white" : "hover:bg-[#FBEAA0] text-gray-700"
          }`}
          onClick={() => setSelectedDate(dateString)}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="min-h-screen bg-[#FFF7D4] flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#4a3630] text-white p-2 rounded-lg shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 10H3M16 2V6M8 2V6M10.5 14L8 16.5L10.5 19M13.5 14L16 16.5L13.5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">SkillSwap</span>
          </Link>
        </div>
      </header>

      <main className="flex-1  flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FBEAA0] rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-[#4a3630] text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-[#4a3630]">When were you born?</h1>
              <p className="text-gray-600 text-sm">We use this to verify your age and personalize your experience.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-lg font-medium">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>

          <div className="flex justify-between">
            <Link
              to="/signup"
              className="px-4 py-2 border border-[#4a3630] text-[#4a3630] rounded-lg hover:bg-white transition-colors"
            >
              Back
            </Link>
            <Link
              to="/personal-details-1"
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate
                  ? "bg-[#4a3630] text-white hover:bg-[#3a2a24]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
