import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-8 md:py-20">
      {/* Animated background elements with brand colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-[#d88f7f] to-[#ebc3b9] rounded-full blur-3xl opacity-60 animate-pulse-slow" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-gradient-to-br from-[#f8c84d] to-[#ffe08a] rounded-full blur-3xl opacity-60 animate-pulse-slower" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-[#aa322b] to-[#c45d4f] rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Image
              src="/brand/logo.png"
              alt="Adeyinka Bakare Fellowship"
              width={120}
              height={120}
              className="mx-auto rounded-2xl shadow-2xl"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#aa322b] via-[#922821] to-[#73201c] bg-clip-text text-transparent"
          >
            Empowering IT Students
            <br />
            <span className="text-4xl md:text-6xl">For Academic Excellence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Scholarships, mentorship, and career development for Information Technology students at the University of Ilorin
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/get-involved">
              <Button size="lg" className="group bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white shadow-lg shadow-[#aa322b]/50">
                Join the Fellowship
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-2 border-[#aa322b] text-[#aa322b] hover:bg-[#aa322b] hover:text-white">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
