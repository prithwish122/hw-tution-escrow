"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, ShieldAlert, Eye, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Enhanced mock data for pending payments
const initialPayments = [
  {
    id: "PAY-2025-001",
    university: "Stanford University",
    amount: "$5,250.00",
    invoiceRef: "INV-2025-8742",
    studentName: "Emma Thompson",
    studentEmail: "emma.thompson@stanford.edu",
    date: "May 23, 2025",
    dueDate: "June 15, 2025",
    status: "pending",
    semester: "Fall 2025",
    program: "Computer Science - MS",
    paymentType: "Tuition",
  },
  {
    id: "PAY-2025-002",
    university: "Massachusetts Institute of Technology",
    amount: "$4,800.00",
    invoiceRef: "INV-2025-6391",
    studentName: "Michael Chen",
    studentEmail: "m.chen@mit.edu",
    date: "May 22, 2025",
    dueDate: "June 10, 2025",
    status: "pending",
    semester: "Fall 2025",
    program: "Electrical Engineering - PhD",
    paymentType: "Tuition",
  },
  {
    id: "PAY-2025-003",
    university: "Harvard University",
    amount: "$6,100.00",
    invoiceRef: "INV-2025-7215",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.johnson@harvard.edu",
    date: "May 20, 2025",
    dueDate: "June 20, 2025",
    status: "pending",
    semester: "Fall 2025",
    program: "Business Administration - MBA",
    paymentType: "Tuition + Fees",
  },
  {
    id: "PAY-2025-004",
    university: "Yale University",
    amount: "$5,750.00",
    invoiceRef: "INV-2025-4982",
    studentName: "David Williams",
    studentEmail: "d.williams@yale.edu",
    date: "May 18, 2025",
    dueDate: "June 5, 2025",
    status: "pending",
    semester: "Fall 2025",
    program: "Law - JD",
    paymentType: "Tuition",
  },
  {
    id: "PAY-2025-005",
    university: "Princeton University",
    amount: "$4,950.00",
    invoiceRef: "INV-2025-3847",
    studentName: "Lisa Rodriguez",
    studentEmail: "l.rodriguez@princeton.edu",
    date: "May 15, 2025",
    dueDate: "June 1, 2025",
    status: "pending",
    semester: "Fall 2025",
    program: "Physics - PhD",
    paymentType: "Tuition",
  },
  {
    id: "PAY-2025-006",
    university: "Columbia University",
    amount: "$5,400.00",
    invoiceRef: "INV-2025-9156",
    studentName: "James Park",
    studentEmail: "j.park@columbia.edu",
    date: "May 12, 2025",
    dueDate: "May 30, 2025",
    status: "pending",
    semester: "Summer 2025",
    program: "Journalism - MS",
    paymentType: "Tuition + Housing",
  },
]

export default function AdminSection() {
  const [pendingPayments, setPendingPayments] = useState(initialPayments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [action, setAction] = useState<"release" | "refund" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleAction = (payment: any, actionType: "release" | "refund") => {
    setSelectedPayment(payment)
    setAction(actionType)
    setDialogOpen(true)
  }

  const confirmAction = () => {
    if (!selectedPayment || !action) return

    // Update the payments list
    setPendingPayments(pendingPayments.filter((payment) => payment.id !== selectedPayment.id))

    setDialogOpen(false)
    setSelectedPayment(null)
    setAction(null)
  }

  const filteredPayments = pendingPayments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  }

  const totalAmount = pendingPayments.reduce((sum, payment) => {
    return sum + Number.parseFloat(payment.amount.replace("$", "").replace(",", ""))
  }, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground">payments awaiting action</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">in escrow</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">institutions involved</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(totalAmount / pendingPayments.length).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">per payment</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Admin Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Pending Payments Management
            </CardTitle>
            <CardDescription>Review and process escrow payments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Badge variant="outline" className="font-normal">
              {filteredPayments.length} of {pendingPayments.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by student name, university, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPayments.length > 0 ? (
            <ScrollArea className="h-[600px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-muted-foreground">{payment.studentEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.university}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.program}</div>
                          <div className="text-sm text-muted-foreground">{payment.semester}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{payment.amount}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              /* View details */
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction(payment, "release")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="mr-1 h-4 w-4" /> Release
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(payment, "refund")}>
                            <X className="mr-1 h-4 w-4" /> Refund
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-2">No payments found</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPendingPayments(initialPayments)
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "release" ? "Release Payment to University" : "Refund Payment to Student"}
            </DialogTitle>
            <DialogDescription>
              {action === "release"
                ? "This action will release the funds to the university and cannot be undone."
                : "This action will refund the payment back to the student and cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Payment ID:</div>
                <div>{selectedPayment.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Student:</div>
                <div>{selectedPayment.studentName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">University:</div>
                <div>{selectedPayment.university}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Amount:</div>
                <div className="font-bold text-lg">{selectedPayment.amount}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Program:</div>
                <div>{selectedPayment.program}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction} variant={action === "release" ? "default" : "destructive"}>
              {action === "release" ? "Release Payment" : "Refund Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
