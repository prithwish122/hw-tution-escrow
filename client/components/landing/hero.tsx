"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(74, 222, 128, 0.2) 0, transparent 40%)",
            backgroundSize: "120% 120%",
            backgroundPosition: "center",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        className="container px-4 md:px-6 flex flex-col items-center text-center space-y-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Secure Your Educational Future with <span className="text-primary">TUITly</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            The most trusted tuition escrow platform connecting students and universities with transparent, secure
            payment solutions.
          </p>
        </motion.div>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-medium">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-medium">
            <Link href="#features">Learn More</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl h-[80%] rounded-lg bg-background/80 backdrop-blur-md shadow-lg border border-border/50 p-4">
                <div className="h-8 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 h-6 bg-muted rounded-md" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 h-[calc(100%-3rem)]">
                  <div className="col-span-1 bg-muted/50 rounded-md" />
                  <div className="col-span-2 grid grid-rows-3 gap-4">
                    <div className="bg-muted/50 rounded-md" />
                    <div className="bg-muted/50 rounded-md" />
                    <div className="bg-muted/50 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
