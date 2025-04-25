import type React from "react"
import MainLayout from "../layout/MainLayout"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <MainLayout showFooter={false}>
      <div className="flex-1 flex items-center justify-center p-4">{children}</div>
    </MainLayout>
  )
}
