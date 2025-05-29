"use client"

import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RecentTransactions() {
  const transactions = [
    {
      id: "TX-2025-156",
      type: "payment",
      amount: "$2,500.00",
      date: "May 23, 2025",
      time: "2:30 PM",
      institution: "Stanford University",
      description: "Fall 2025 Tuition Payment",
      status: "completed",
      semester: "Fall 2025",
    },
    {
      id: "TX-2025-155",
      type: "deposit",
      amount: "$4,250.00",
      date: "May 20, 2025",
      time: "10:15 AM",
      institution: "Financial Aid Office",
      description: "Federal Student Aid Disbursement",
      status: "completed",
      semester: "Fall 2025",
    },
    {
      id: "TX-2025-154",
      type: "payment",
      amount: "$1,200.00",
      date: "May 15, 2025",
      time: "4:45 PM",
      institution: "MIT",
      description: "Course Materials & Lab Fees",
      status: "completed",
      semester: "Summer 2025",
    },
    {
      id: "TX-2025-153",
      type: "deposit",
      amount: "$3,000.00",
      date: "May 10, 2025",
      time: "9:20 AM",
      institution: "Merit Scholarship Fund",
      description: "Academic Excellence Scholarship",
      status: "completed",
      semester: "Fall 2025",
    },
    {
      id: "TX-2025-152",
      type: "payment",
      amount: "$1,850.00",
      date: "May 5, 2025",
      time: "1:10 PM",
      institution: "Harvard Extension",
      description: "Professional Development Course",
      status: "pending",
      semester: "Summer 2025",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest escrow transactions and payments</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      transaction.type === "payment"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {transaction.type === "payment" ? (
                      <ArrowUp className="h-5 w-5" />
                    ) : (
                      <ArrowDown className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.description}</p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.institution}</span>
                      <span>•</span>
                      <span>
                        {transaction.date} at {transaction.time}
                      </span>
                      <span>•</span>
                      <span>{transaction.semester}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">ID: {transaction.id}</p>
                  </div>
                </div>
                <div
                  className={`text-right font-medium ${
                    transaction.type === "payment"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {transaction.type === "payment" ? "-" : "+"} {transaction.amount}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
