import type React from "react"
import {Card} from "../ui/Card"

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <Card variant="yellow" padding="lg" className="max-w-md w-full">
      <h1 className="text-2xl font-bold text-center text-[#4a3630] mb-2">{title}</h1>
      {subtitle && <p className="text-center text-gray-600 mb-6">{subtitle}</p>}
      {children}
    </Card>
  )
}
