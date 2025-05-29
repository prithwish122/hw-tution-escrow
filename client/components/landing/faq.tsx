"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "How does the escrow process work?",
      answer:
        "Students deposit tuition funds into our secure escrow account. We hold these funds until predefined educational milestones are met, then disburse them to the university according to the agreed schedule.",
    },
    {
      question: "What happens if I need to withdraw from my courses?",
      answer:
        "Our platform follows each institution's refund policy. If you withdraw within the eligible period, we'll process refunds according to the university's terms and conditions that were agreed upon during enrollment.",
    },
    {
      question: "How are universities verified on your platform?",
      answer:
        "We conduct thorough verification of all educational institutions, checking accreditation status, financial stability, and regulatory compliance before allowing them to join our platform.",
    },
    {
      question: "Are there any fees for using TrustFund?",
      answer:
        "We charge a small percentage-based fee on each transaction. This fee is typically split between the student and institution, though some universities choose to cover the entire fee as a benefit to their students.",
    },
    {
      question: "How quickly are funds disbursed to universities?",
      answer:
        "Once a disbursement milestone is reached, funds are typically released to the university within 1-2 business days, ensuring prompt access to tuition payments.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find answers to common questions about our tuition escrow services.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
