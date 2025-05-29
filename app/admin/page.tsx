import type { Metadata } from "next"
import AdminSection from "@/components/admin/admin-section"

export const metadata: Metadata = {
  title: "Admin Panel | TUITly",
  description: "Manage escrow payments and transactions",
}

export default function AdminPage() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage pending escrow payments and transactions</p>
        </div>
        <AdminSection />
      </div>
    </div>
  )
}
