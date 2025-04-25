import type React from "react"
import { Link } from "react-router-dom"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  asLink?: boolean
  to?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  asLink = false,
  to = "",
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "rounded-lg font-medium transition-colors flex items-center justify-center gap-2"

  const variantClasses = {
    primary: "bg-[#4a3630] text-white hover:bg-[#3a2a24]",
    secondary: "bg-[#FBEAA0] text-[#4a3630] hover:bg-[#f5e28b]",
    outline: "border border-[#4a3630] text-[#4a3630] hover:bg-white",
    ghost: "text-[#4a3630] hover:bg-gray-100",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }

  const widthClass = fullWidth ? "w-full" : ""

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`

  if (asLink && to) {
    return (
      <Link to={to} className={buttonClasses}>
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </Link>
    )
  }

  return (
    <button className={buttonClasses} {...props}>
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  )
}
