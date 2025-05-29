"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, ShieldAlert } from "lucide-react"
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

// Mock data for pending payments
const initialPayments = [
  {
    id: "PAY-1234",
    university: "Stanford University",
    amount: "$5,250.00",
    invoiceRef: "INV-2025-8742",
    studentName: "Emma Thompson",
    date: "May 23, 2025",
    status: "pending",
  },
  {
    id: "PAY-1235",
    university: "MIT",
    amount: "$4,800.00",
    invoiceRef: "INV-2025-6391",
    studentName: "Michael Chen",
    date: "May 22, 2025",
    status: "pending",
  },
  {
    id: "PAY-1236",
    university: "Harvard University",
    amount: "$6,100.00",
    invoiceRef: "INV-2025-7215",
    studentName: "Sarah Johnson",
    date: "May 20, 2025",
    status: "pending",
  },
  {
    id: "PAY-1237",
    university: "Yale University",
    amount: "$5,750.00",
    invoiceRef: "INV-2025-4982",
    studentName: "David Williams",
    date: "May 18, 2025",
    status: "pending",
  },
]

export default function AdminSection() {
  const [pendingPayments, setPendingPayments] = useState(initialPayments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [action, setAction] = useState<"release" | "refund" | null>(null)

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

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Admin Section
            </CardTitle>
            <CardDescription>Manage pending escrow payments</CardDescription>
          </div>
          <Badge variant="outline" className="font-normal">
            {pendingPayments.length} Pending
          </Badge>
        </CardHeader>
        <CardContent>
          {pendingPayments.length > 0 ? (
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Invoice Ref</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.university}</TableCell>
                      <TableCell>{payment.studentName}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.invoiceRef}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
              <p className="text-muted-foreground mb-2">No pending payments</p>
              <Button variant="outline" onClick={() => setPendingPayments(initialPayments)}>
                Reset Demo Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                <div className="font-medium">University:</div>
                <div>{selectedPayment.university}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Amount:</div>
                <div>{selectedPayment.amount}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Student:</div>
                <div>{selectedPayment.studentName}</div>
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
