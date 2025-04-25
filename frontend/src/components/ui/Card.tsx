import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "yellow"
  padding?: "none" | "sm" | "md" | "lg"
}

export default function Card({ children, className = "", variant = "default", padding = "md" }: CardProps) {
  const baseClasses = "rounded-xl shadow-md"

  const variantClasses = {
    default: "bg-white",
    yellow: "bg-[#FBEAA0]",
  }

  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}
