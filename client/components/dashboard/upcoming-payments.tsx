"use client"

import { motion } from "framer-motion"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function UpcomingPayments() {
  const payments = [
    {
      id: "PAY-2025-008",
      institution: "Stanford University",
      amount: "$4,250.00",
      dueDate: "June 15, 2025",
      description: "Fall 2025 Semester Tuition",
      progress: 75,
      status: "on-track",
      daysUntilDue: 23,
      semester: "Fall 2025",
      paymentType: "Tuition",
    },
    {
      id: "PAY-2025-009",
      institution: "MIT",
      amount: "$3,750.00",
      dueDate: "August 30, 2025",
      description: "Fall 2025 Semester Tuition",
      progress: 45,
      status: "pending",
      daysUntilDue: 98,
      semester: "Fall 2025",
      paymentType: "Tuition + Fees",
    },
    {
      id: "PAY-2025-010",
      institution: "Harvard Extension",
      amount: "$1,850.00",
      dueDate: "July 1, 2025",
      description: "Summer Professional Development",
      progress: 90,
      status: "urgent",
      daysUntilDue: 8,
      semester: "Summer 2025",
      paymentType: "Course Fee",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "destructive"
      case "on-track":
        return "default"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertCircle className="h-3.5 w-3.5" />
      case "on-track":
        return <Clock className="h-3.5 w-3.5" />
      default:
        return <CalendarIcon className="h-3.5 w-3.5" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>Scheduled payments for your educational expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                className="rounded-lg border p-4 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{payment.institution}</h3>
                      <Badge variant={getStatusColor(payment.status)} className="text-xs">
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{payment.semester}</span>
                      <span>•</span>
                      <span>{payment.paymentType}</span>
                      <span>•</span>
                      <span>ID: {payment.id}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xl font-bold">{payment.amount}</p>
                    <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>Due {payment.dueDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{payment.daysUntilDue} days remaining</p>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment Progress</span>
                    <span className="font-medium">{payment.progress}% funded</span>
                  </div>
                  <Progress value={payment.progress} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1">Make Payment</Button>
          <Button variant="outline" className="flex-1">
            Schedule Payment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
