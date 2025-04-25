import type React from "react"
import Header from "./Header"
import Footer from "./Footer"
import { useSidebar } from "../../context/SidebarContext"

interface MainLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

export default function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  className = "",
}: MainLayoutProps) {
  const { sidebarOpen } = useSidebar()

  return (
    <div className={`min-h-screen bg-[#FFF7D4] flex flex-col ${className}`}>
      {showHeader && <Header />}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
