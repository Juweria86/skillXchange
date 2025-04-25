import type React from "react"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

interface PageHeaderProps {
  title?: string
  backTo?: string
  backLabel?: string
  children?: React.ReactNode
  className?: string
}

export default function PageHeader({ title, backTo, backLabel = "Back", children, className = "" }: PageHeaderProps) {
  return (
    <div className={`p-4 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {backTo && (
            <Link to={backTo} className="inline-flex items-center text-[#4a3630] hover:text-[#3a2a24] font-medium mr-4">
              <ChevronLeft size={20} className="mr-1" />
              {backLabel}
            </Link>
          )}
          {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
        {children}
      </div>
    </div>
  )
}
