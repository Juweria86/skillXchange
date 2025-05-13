"use client"

import { useState } from "react"
import { Calendar, MessageSquare, Check, X } from "lucide-react"
import Button from "../ui/Button"
import Avatar from "../ui/Avatar"
import Badge from "../ui/Badge"

interface ConnectionCardProps {
  connection: {
    id: string
    name: string
    avatar: string
    skills: string[]
    learning: string[]
    lastActive?: string
    requestDate?: string
    message?: string
    status: string
    direction?: "incoming" | "outgoing"
  }
  isPending?: boolean
  isSent?: boolean
  onAccept?: () => void
  onDecline?: () => void
  onCancel?: () => void
  onRequestSession?: () => void
}

export default function ConnectionCard({
  connection,
  isPending = false,
  isSent = false,
  onAccept,
  onDecline,
  onCancel,
  onRequestSession,
}: ConnectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar src={connection.avatar} alt={connection.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[#4a3630] truncate">{connection.name}</h3>
            <p className="text-sm text-gray-500">
              {isPending
                ? `Requested ${connection.requestDate}`
                : isSent
                  ? `Sent ${connection.requestDate}`
                  : `Active ${connection.lastActive}`}
            </p>
          </div>
          {!isPending && !isSent && (
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Skills Section */}
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {connection.skills.map((skill, index) => (
              <Badge key={`skill-${index}`} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Learning Section */}
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Learning</h4>
          <div className="flex flex-wrap gap-1">
            {connection.learning.map((skill, index) => (
              <Badge key={`learning-${index}`} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Request Message (for pending requests) */}
        {isPending && connection.message && (
          <div className="mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-[#4a3630] hover:underline focus:outline-none"
            >
              {isExpanded ? "Hide message" : "View message"}
            </button>
            {isExpanded && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700">"{connection.message}"</div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gray-50 border-t">
        {isPending ? (
          <div className="flex gap-2">
            <Button variant="primary" size="sm" fullWidth leftIcon={<Check size={16} />} onClick={onAccept}>
              Accept
            </Button>
            <Button variant="outline" size="sm" fullWidth leftIcon={<X size={16} />} onClick={onDecline}>
              Decline
            </Button>
          </div>
        ) : isSent ? (
          <Button variant="outline" size="sm" fullWidth leftIcon={<X size={16} />} onClick={onCancel}>
            Cancel Request
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="primary" size="sm" fullWidth leftIcon={<Calendar size={16} />} onClick={onRequestSession}>
              Request Session
            </Button>
            <Button variant="outline" size="sm" className="flex-shrink-0" leftIcon={<MessageSquare size={16} />}>
              Message
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
