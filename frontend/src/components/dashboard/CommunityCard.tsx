import type React from "react"
import Card from "../ui/Card"

interface CommunityCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

export default function CommunityCard({ title, icon, children }: CommunityCardProps) {
  return (
    <Card className="p-4 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      {children}
    </Card>
  )
}
