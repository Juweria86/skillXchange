"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SidebarContextType = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Persist sidebar state in localStorage
  useEffect(() => {
    // Only run on client side
    const savedState = localStorage.getItem("sidebarOpen")
    if (savedState) {
      setSidebarOpen(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  return <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
