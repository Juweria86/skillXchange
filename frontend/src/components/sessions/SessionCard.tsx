import { Clock } from "lucide-react"
import Badge from "../ui/Badge"
import Button from "../ui/Button"

interface SessionCardProps {
  title: string
  date: {
    month: string
    day: number
  }
  time: string
  skillName: string
  sessionType: "learning" | "teaching"
}

export default function SessionCard({ title, date, time, skillName, sessionType }: SessionCardProps) {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <div className="bg-[#FBEAA0] rounded-lg p-2 text-center min-w-[60px]">
          <div className="text-sm font-bold">{date.month}</div>
          <div className="text-xl font-bold">{date.day}</div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <Clock size={14} className="mr-1" />
            <span>{time}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <Badge variant="blue">{skillName}</Badge>
            <Badge variant={sessionType === "learning" ? "green" : "orange"}>
              {sessionType === "learning" ? "Learning" : "Teaching"}
            </Badge>
          </div>
        </div>
        <Button variant="primary" size="sm">
          Join
        </Button>
      </div>
    </div>
  )
}
