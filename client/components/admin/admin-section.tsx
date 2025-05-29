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
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { useWriteContract } from "wagmi"
import escrowABI from "@/contractdetails/escrow_abi.json"
import usdcABI from "@/contractdetails/usdc.json"

export default function AdminSection() {
  const [pendingPayments, setPendingPayments] = useState(() => {
    if (typeof window !== "undefined") {
      const savedDeposits = localStorage.getItem("deposits")
      if (savedDeposits) {
        const deposits = JSON.parse(savedDeposits)
        return deposits.map((deposit: any, index: number) => ({
          id: `PAY-${new Date(deposit.timestamp).getFullYear()}-${String(index + 1).padStart(3, "0")}`,
          university: deposit.university,
          amount: `$${deposit.amount}`,
          invoiceRef: deposit.invoiceRef,
          studentName: "Student User",
          studentEmail: deposit.address,
          date: new Date(deposit.timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          dueDate: new Date(new Date(deposit.timestamp).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          ),
          status: "pending",
          semester: "Current Term",
          program: "Not Specified",
          paymentType: "Tuition",
        }))
      }
    }
    return []
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [action, setAction] = useState<"release" | "refund" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)

  const { address, isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected
    const { chainId } = useAppKitNetwork() // to get chainid
    const { writeContract, isSuccess } = useWriteContract()

  // Separate handler for release action
  const handleRelease = (payment: any) => {
    console.log("🟢 RELEASE button clicked for payment:", payment.id)
    setSelectedPayment(payment)
    setAction("release")
    setDialogOpen(true)
  }

  // Separate handler for refund action
  const handleRefund = (payment: any) => {
    console.log("🔴 REFUND button clicked for payment:", payment.id)
    setSelectedPayment(payment)
    setAction("refund")
    setDialogOpen(true)
  }

  // Handler for view details
  const handleViewDetails = (payment: any) => {
    console.log("Viewing details for payment:", payment)
    alert(`Viewing details for Payment ID: ${payment.id}`)
  }



const escrowAddress= "0x92146cca0FCA743CE512D5B1791668e01eb48963"
  const usdcAddress= "0xE848aDaDC71b7373639e4EbeC1E81331731F5Dad"
  const universityAddress: string = "0x10B6E5bB22D387AF4E9E2961a6183291337F76fc"


  // Confirm release action
  const confirmRelease = async (invoiceRef: any) => {
    if (!selectedPayment) return

    setIsProcessing(true)

     await writeContract({
    abi: escrowABI,
    functionName: "release",
    address: escrowAddress,
    args: [invoiceRef],
  });




    try {
      console.log("Releasing payment to university:", selectedPayment)

      // Update the payment status or remove from pending list
      setPendingPayments(pendingPayments.filter((payment: { id: any }) => payment.id !== selectedPayment.id))

      // Show success message
      // alert(`Payment ${selectedPayment.id} has been successfully released to ${selectedPayment.university}`)
    } catch (error) {
      console.error("Error releasing payment:", error)
      // alert("Failed to release payment. Please try again.")
    } finally {
      setIsProcessing(false)
      setDialogOpen(false)
      setSelectedPayment(null)
      setAction(null)
    }
  }

  // Confirm refund action
  const confirmRefund = async (invoiceRef: any) => {
    if (!selectedPayment) return
    await writeContract({
    abi: escrowABI,
    functionName: "refund",
    address: escrowAddress,
    args: [invoiceRef],
  });

    setIsProcessing(true)

    try {
      console.log("Refunding payment to student:", selectedPayment)

      // Update the payment status or remove from pending list
      setPendingPayments(pendingPayments.filter((payment: { id: any }) => payment.id !== selectedPayment.id))

      // Show success message
      // alert(`Payment ${selectedPayment.id} has been successfully refunded to ${selectedPayment.studentName}`)
    } catch (error) {
      console.error("Error refunding payment:", error)
      // alert("Failed to refund payment. Please try again.")
    } finally {
      setIsProcessing(false)
      setDialogOpen(false)
      setSelectedPayment(null)
      setAction(null)
    }
  }

  // Generic confirm action that routes to specific handlers
  const confirmAction = (invoiceRef: any) => {
    if (action === "release") {
      confirmRelease(invoiceRef)
    } else if (action === "refund") {
      confirmRefund(invoiceRef)
    }
  }

  const filteredPayments = pendingPayments.filter(
    (payment: { studentName: string; university: string; id: string; status: string }) => {
      const matchesSearch =
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter

      return matchesSearch && matchesStatus
    },
  )

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

  const totalAmount = pendingPayments.reduce((sum: number, payment: { amount: string }) => {
    return sum + Number.parseFloat(payment.amount.replace("$", "").replace(",", ""))
  }, 0)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage escrow payments and transactions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="text-center">
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
              <Card className="text-center">
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
              <Card className="text-center">
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
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Math.round(totalAmount / pendingPayments.length || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">per payment</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Admin Panel */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="text-center flex-1">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  Pending Payments Management
                </CardTitle>
                <CardDescription className="mt-1">Review and process escrow payments</CardDescription>
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
            <CardContent className="p-0">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 px-6">
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
                <div className="w-full border-t">
                  <ScrollArea className="w-full">
                    <div className="overflow-x-auto">
                      <Table className="w-full min-w-[1200px]">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-center">Payment ID</TableHead>
                            <TableHead className="font-semibold text-center">Invoice Ref</TableHead>
                            <TableHead className="font-semibold text-center">Student</TableHead>
                            <TableHead className="font-semibold text-center">University</TableHead>
                            <TableHead className="font-semibold text-center">Program</TableHead>
                            <TableHead className="font-semibold text-center">Amount</TableHead>
                            <TableHead className="font-semibold text-center">Due Date</TableHead>
                            <TableHead className="font-semibold text-center">Status</TableHead>
                            <TableHead className="font-semibold text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((payment: any, index: number) => (
                            <motion.tr
                              key={String(payment.id)}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              variants={itemVariants}
                              className="hover:bg-muted/50 border-b"
                            >
                              <TableCell className="font-medium text-center">{payment.id}</TableCell>
                              <TableCell className="font-medium text-center">{payment.invoiceRef}</TableCell>
                              <TableCell className="text-center">
                                <div className="space-y-1">
                                  <div className="font-medium">{payment.studentName}</div>
                                  <div className="text-sm text-muted-foreground truncate max-w-[180px] mx-auto">
                                    {payment.studentEmail}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div
                                  className="truncate max-w-[200px] mx-auto"
                                  title={
                                    typeof payment.university === "string"
                                      ? payment.university
                                      : payment.university != null
                                        ? String(payment.university)
                                        : undefined
                                  }
                                >
                                  {payment.university}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="space-y-1">
                                  <div
                                    className="font-medium truncate max-w-[140px] mx-auto"
                                    title={
                                      typeof payment.program === "string"
                                        ? payment.program
                                        : payment.program != null
                                          ? String(payment.program)
                                          : undefined
                                    }
                                  >
                                    {payment.program}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{payment.semester}</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-center">{payment.amount}</TableCell>
                              <TableCell className="text-center">{payment.dueDate}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="capitalize text-xs">
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetails(payment)}
                                    className="h-8 w-8 p-0 shrink-0"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>

                                  {/* Release Button */}
                                  <Button
                                    size="sm"
                                    onClick={() => handleRelease(payment)}
                                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 shrink-0 text-xs font-medium"
                                    title="Release Payment to University"
                                    disabled={isProcessing}
                                  >
                                    <Check className="mr-1 h-3 w-3" />
                                    Release
                                  </Button>

                                  {/* Refund Button */}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRefund(payment)}
                                    className="bg-red-600 hover:bg-red-700 text-white h-8 px-3 shrink-0 text-xs font-medium"
                                    title="Refund Payment to Student"
                                    disabled={isProcessing}
                                  >
                                    <X className="mr-1 h-3 w-3" />
                                    Refund
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-6">
                  <p className="text-muted-foreground mb-2">No payments found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const savedDeposits = localStorage.getItem("deposits")
                        if (savedDeposits) {
                          const deposits = JSON.parse(savedDeposits)
                          const transformedDeposits = deposits.map((deposit: any, index: number) => ({
                            id: `PAY-${new Date(deposit.timestamp).getFullYear()}-${String(index + 1).padStart(3, "0")}`,
                            university: deposit.university,
                            amount: `$${deposit.amount}`,
                            invoiceRef: deposit.invoiceRef,
                            studentName: "Student User",
                            studentEmail: deposit.address,
                            date: new Date(deposit.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }),
                            dueDate: new Date(
                              new Date(deposit.timestamp).getTime() + 30 * 24 * 60 * 60 * 1000,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }),
                            status: "pending",
                            semester: "Current Term",
                            program: "Not Specified",
                            paymentType: "Tuition",
                          }))
                          setPendingPayments(transformedDeposits)
                        }
                      }
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
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader className="text-center">
                <DialogTitle>
                  {action === "release" ? "Release Payment to University" : "Refund Payment to Student"}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {action === "release"
                    ? "This action will release the funds to the university and cannot be undone."
                    : "This action will refund the payment back to the student and cannot be undone."}
                </DialogDescription>
              </DialogHeader>

              {selectedPayment && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="font-medium">Payment ID:</div>
                    <div>{selectedPayment.id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="font-medium">Invoice Reference:</div>
                    <div>{selectedPayment.invoiceRef}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="font-medium">Student:</div>
                    <div>{selectedPayment.studentName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="font-medium">University:</div>
                    <div>{selectedPayment.university}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="font-medium">Amount:</div>
                    <div className="font-bold text-lg">{selectedPayment.amount}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="font-medium">Program:</div>
                    <div>{selectedPayment.program}</div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  onClick={() => confirmAction(selectedPayment?.invoiceRef)}
                  variant={action === "release" ? "default" : "destructive"}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : action === "release" ? "Release Payment" : "Refund Payment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  )
}
