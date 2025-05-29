import type { Metadata } from "next"
import Hero from "@/components/landing/hero"
import WhyUs from "@/components/landing/why-us"
import Features from "@/components/landing/features"
import FAQ from "@/components/landing/faq"
import Footer from "@/components/landing/footer"
import LoadingScreen from "@/components/loading-screen"

export const metadata: Metadata = {
  title: "TUITly | Secure Tuition Escrow Platform",
  description: "The most trusted tuition escrow platform for universities and students",
}

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="flex flex-col items-center justify-center w-full">
        <Hero />
        <WhyUs />
        <Features />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}
