"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

type AppContextType = {
  isLoading: boolean
  isLandingPage: boolean
}

const AppContext = createContext<AppContextType>({
  isLoading: true,
  isLandingPage: true,
})

export const useAppContext = () => useContext(AppContext)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return <AppContext.Provider value={{ isLoading, isLandingPage }}>{children}</AppContext.Provider>
}
