"use client"

import type React from "react"

import { JSX, useState } from "react"
import { motion } from "framer-motion"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { useWriteContract } from "wagmi"
import escrowABI from "@/contractdetails/escrow_abi.json"
import usdcABI from "@/contractdetails/usdc.json"


interface University {
  value: string
  label: string
}

const universities: University[] = [
  { value: "stanford", label: "Stanford University" },
  { value: "mit", label: "Massachusetts Institute of Technology" },
  { value: "harvard", label: "Harvard University" },
  { value: "yale", label: "Yale University" },
  { value: "princeton", label: "Princeton University" },
  { value: "columbia", label: "Columbia University" },
  { value: "berkeley", label: "UC Berkeley" },
]

export default function DepositForm(): JSX.Element {
  
  const [open, setOpen] = useState<boolean>(false)
  const [university, setUniversity] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [invoiceRef, setInvoiceRef] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)

  const { address, isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected
  const { chainId } = useAppKitNetwork() // to get chainid
  const { writeContract, isSuccess } = useWriteContract() // to invoke contract

  const escrowAddress= "0x92146cca0FCA743CE512D5B1791668e01eb48963"
  const usdcAddress= "0xE848aDaDC71b7373639e4EbeC1E81331731F5Dad"
  const universityAddress: string = "0x10B6E5bB22D387AF4E9E2961a6183291337F76fc" // Replace with actual university contract address

 const handleInitiateDeposit = async (invoiceRef: any, address: any, universityAddress: any, amount: any) => { 
  if (!university || !amount || !invoiceRef) return 
  console.log(invoiceRef, address, universityAddress, amount,"================================================")
  try {
    // First contract call
    await writeContract({ 
      abi: escrowABI, 
      functionName: "initializeEscrow", 
      address: escrowAddress, 
      args: [invoiceRef, address, universityAddress, amount], 
    })


    // Second contract call
    await writeContract({
      abi: usdcABI,
      functionName: "approve",
      address: usdcAddress,
      args: [escrowAddress, amount], // Assuming the approve function takes the spender address and amount
    })

    setShowConfirmDialog(true)
  } catch (error) {
    console.error("Transaction failed:", error)
  }
}

  const handleConfirmDeposit = async (invoiceRef: any) => {
  console.log("Confirming deposit for invoice:", invoiceRef);

  await writeContract({
    abi: escrowABI,
    functionName: "deposit",
    address: escrowAddress,
    args: [invoiceRef],
  });

  // Simulate saving to "backend" (here: localStorage)
  const previousDeposits = JSON.parse(localStorage.getItem("deposits") || "[]");
  const newDeposit = {
    university: selectedUniversity?.label,
    amount,
    invoiceRef,
    address,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("deposits", JSON.stringify([...previousDeposits, newDeposit]));

  setShowConfirmDialog(false);
  setIsSubmitting(true);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  setUniversity("");
  setAmount("");
  setInvoiceRef("");
  setIsSubmitting(false);

  alert("Deposit initiated successfully!");
};


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // handleInitiateDeposit()
  }

  const selectedUniversity: University | undefined = universities.find((uni) => uni.value === university)

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl">Make a Deposit</CardTitle>
            <CardDescription>Securely deposit funds into escrow for your educational institution</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="university">Select University</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                      {university ? universities.find((uni) => uni.value === university)?.label : "Select university..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search university..." />
                      <CommandList>
                        <CommandEmpty>No university found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {universities.map((uni) => (
                            <CommandItem
                              key={uni.value}
                              value={uni.value}
                              onSelect={(currentValue: string) => {
                                setUniversity(currentValue === university ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", university === uni.value ? "opacity-100" : "opacity-0")}
                              />
                              {uni.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceRef">Invoice Reference</Label>
                <Input
                  id="invoiceRef"
                  placeholder="e.g. INV-2025-1234"
                  value={invoiceRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInvoiceRef(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              className="w-full"
              onClick={() => handleInitiateDeposit(invoiceRef, address, universityAddress, amount)}
              disabled={isSubmitting || !university || !amount || !invoiceRef}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Initiate Deposit"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deposit</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your deposit details before proceeding. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between">
              <span className="font-medium">University:</span>
              <span>{selectedUniversity?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>${amount} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Invoice Reference:</span>
              <span>{invoiceRef}</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmDeposit(invoiceRef)}>
              Confirm Deposit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}