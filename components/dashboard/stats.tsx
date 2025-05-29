"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, DollarSign, Calendar, School, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Escrow Balance",
      value: "$18,750.00",
      change: "+12.5%",
      changeLabel: "from last semester",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Next Payment Due",
      value: "$4,250.00",
      date: "June 15, 2025",
      institution: "Stanford University",
      icon: Calendar,
      trend: "neutral",
    },
    {
      title: "Active Enrollments",
      value: "3",
      list: ["Stanford University", "MIT", "Harvard Extension"],
      icon: School,
      trend: "neutral",
    },
    {
      title: "Payments This Year",
      value: "8",
      change: "+33%",
      changeLabel: "vs last year",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="grid gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5">
                <stat.icon className="h-full w-full text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              {stat.change && (
                <div
                  className={`flex items-center text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {stat.trend === "up" && <ArrowUpRight className="mr-1 h-4 w-4" />}
                  {stat.change} {stat.changeLabel}
                </div>
              )}
              {stat.date && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Due on {stat.date}</div>
                  {stat.institution && <div className="text-xs text-muted-foreground">{stat.institution}</div>}
                </div>
              )}
              {stat.list && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.list.slice(0, 2).join(", ")}
                  {stat.list.length > 2 && ` +${stat.list.length - 2} more`}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
