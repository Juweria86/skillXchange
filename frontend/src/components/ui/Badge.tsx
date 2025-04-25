import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "blue" | "green" | "yellow" | "purple" | "orange" | "red"
  size?: "sm" | "md"
  className?: string
}

export default function Badge({ children, variant = "blue", size = "sm", className = "" }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium"

  const variantClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
    red: "bg-red-100 text-red-600",
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>{children}</span>
  )
}
