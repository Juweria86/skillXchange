import type React from "react"
import {Card, CardContent}  from "../ui/Card"
import { cn } from "../../utils/cn"

interface StatItemProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  className?: string
}

export function StatItem({ label, value, icon, className }: StatItemProps) {
  return (
    <Card className={cn("bg-white", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {icon && <div className="text-gray-500">{icon}</div>}
          <div className={cn("flex flex-col", icon ? "ml-3" : "")}>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-2xl font-bold text-[#4a3630]">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }

  return <div className={cn(`grid gap-4 ${gridCols[columns]}`, className)}>{children}</div>
}
