import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: "default" | "yellow"
}

export default function Input({
  label,
  error,
  fullWidth = true,
  leftIcon,
  rightIcon,
  variant = "default",
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

  const baseClasses =
    "px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] focus:border-transparent"

  const variantClasses = {
    default: "bg-white",
    yellow: "bg-[#FBEAA0]",
  }

  const widthClass = fullWidth ? "w-full" : ""
  const paddingLeft = leftIcon ? "pl-10" : ""
  const paddingRight = rightIcon ? "pr-10" : ""

  const inputClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${paddingLeft} ${paddingRight} ${className}`

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{leftIcon}</div>}
        <input id={inputId} className={inputClasses} {...props} />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{rightIcon}</div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
