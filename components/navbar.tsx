"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <motion.div
        className="w-[95%] max-w-4xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <motion.nav
          className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border/40 rounded-full px-6 py-3 shadow-lg"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="flex aspect-square h-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M20 7h-9" />
                <path d="M14 17H5" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
            </div>
            <span className="text-lg font-semibold">TUITly</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center space-x-6">
              <NavLink href="/" active={pathname === "/"}>
                Home
              </NavLink>
              <NavLink href="/dashboard" active={pathname.startsWith("/dashboard")}>
                Dashboard
              </NavLink>
              <NavLink href="/admin" active={pathname.startsWith("/admin")}>
                Admin
              </NavLink>
              <NavLink href="#features" active={false}>
                Features
              </NavLink>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <appkit-button balance="hide"/>
            </motion.div>
          </div>
        </motion.nav>
      </motion.div>
    </div>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
      {active && (
        <motion.span
          className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
          layoutId="navbar-indicator"
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}
    </Link>
  )
}