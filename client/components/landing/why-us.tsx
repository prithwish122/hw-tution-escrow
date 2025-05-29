"use client"

import { motion } from "framer-motion"
import { Shield, Banknote, Clock } from "lucide-react"

export default function WhyUs() {
  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level encryption and security protocols protect every transaction on our platform.",
    },
    {
      icon: Banknote,
      title: "Transparent Fees",
      description: "No hidden costs. Our fee structure is clear and straightforward for all parties.",
    },
    {
      icon: Clock,
      title: "Quick Disbursements",
      description: "Universities receive funds promptly according to pre-agreed milestones and schedules.",
    },
  ]

  return (
    <section id="why-us" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            TrustFund provides the most reliable escrow service for educational institutions and students worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
