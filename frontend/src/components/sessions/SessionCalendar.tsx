import { ChevronLeft, ChevronRight } from "lucide-react"
import {Card} from "../ui/Card"
import { useState } from "react"


export default function SessionCalendar({ sessions, onEdit }: { sessions: any[], onEdit: (session: any) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-24 p-1"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const daySessions = sessions.filter(session => 
              new Date(session.date).getDate() === day && 
              new Date(session.date).getMonth() === currentMonth.getMonth()
            )

            return (
              <div
                key={`day-${day}`}
                className={`h-24 p-1 border border-gray-100 ${daySessions.length ? "bg-[#FBEAA0] bg-opacity-30" : ""}`}
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                {daySessions.map((session, i) => (
                  <div
                    key={i}
                    className={`text-xs p-1 mb-1 rounded cursor-pointer ${
                      session.type === "learning" ? "bg-blue-100" : "bg-orange-100"
                    }`}
                    onClick={() => onEdit(session)}
                  >
                    {session.time.split(' - ')[0]} - {session.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
