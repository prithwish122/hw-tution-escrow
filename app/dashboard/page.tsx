import type { Metadata } from "next"
import DashboardStats from "@/components/dashboard/stats"
import DepositForm from "@/components/dashboard/deposit-form"
import RecentTransactions from "@/components/dashboard/recent-transactions"
import UpcomingPayments from "@/components/dashboard/upcoming-payments"
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { useWriteContract } from "wagmi"



export const metadata: Metadata = {
  title: "Dashboard | TUITly",
  description: "Manage your tuition escrow accounts",
}

export default function Dashboard() {



  

  // const handleDeposit = async (amount: string) => {
  //   if (!isConnected || !address || !chainId) {
  //     console.error("Wallet not connected or address/chainId missing")
  //     return
  //   }
  //   try {
  //     const tx = await writeContract({
  //       address: "0xYourEscrowContractAddress", // Replace with your escrow contract address
  //       abi: escrowABI,
  //       functionName: "deposit",
  //       args: [address, amount], // Assuming deposit takes the recipient address and amount
  //     })
  //     console.log("Transaction sent:", tx)
  //     const receipt = await tx.wait()
  //     console.log("Transaction confirmed:", receipt)
  //   } catch (error) {
  //     console.error("Error sending transaction:", error)
  //   }
  // }
 
  






  return (
    <div className="flex flex-col w-full min-h-screen pt-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Manage your tuition payments and escrow accounts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <DashboardStats />
          </div>
          <div className="lg:col-span-2">
            <DepositForm />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions />
          <UpcomingPayments />
        </div>
      </div>
    </div>
  )
}
