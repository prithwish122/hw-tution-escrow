"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function Features() {
  const features = [
    {
      title: "Smart Payment Schedules",
      description: "Create customized payment plans that align with academic terms and financial aid disbursements.",
      items: ["Automated installment plans", "Flexible payment options", "Calendar integration", "Payment reminders"],
    },
    {
      title: "Dispute Resolution",
      description: "Our fair and transparent process protects both students and institutions in case of disagreements.",
      items: [
        "Neutral third-party mediation",
        "Clear documentation requirements",
        "Fast resolution timelines",
        "Policy enforcement",
      ],
    },
    {
      title: "Financial Aid Integration",
      description: "Seamlessly connect with financial aid systems to coordinate disbursements and payments.",
      items: [
        "Direct deposit coordination",
        "Scholarship management",
        "Loan disbursement tracking",
        "Aid verification",
      ],
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers comprehensive tools designed specifically for educational payment management.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <ul className="space-y-2 mt-4">
                    {feature.items.map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <div
                className={`relative aspect-video rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[90%] h-[80%] rounded-lg bg-background/80 backdrop-blur-md shadow-lg border border-border/50 p-4">
                      <div className="h-6 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 h-4 bg-muted rounded-md" />
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-3 h-[calc(100%-2.5rem)]">
                        <div className="col-span-1 bg-muted/50 rounded-md" />
                        <div className="col-span-3 grid grid-rows-4 gap-3">
                          <div className="bg-muted/50 rounded-md" />
                          <div className="bg-muted/50 rounded-md" />
                          <div className="bg-muted/50 rounded-md" />
                          <div className="bg-primary/20 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
