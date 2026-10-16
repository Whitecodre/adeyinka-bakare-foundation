"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/public/magnetic";

export function HeroSection() {
  // Mouse parallax: the background blobs drift slowly against the pointer. Touch devices skip it.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 50, damping: 20 });
  const goldX = useTransform(smoothX, (v) => v * -50);
  const goldY = useTransform(smoothY, (v) => v * -50);
  const maroonX = useTransform(smoothX, (v) => v * 40);
  const maroonY = useTransform(smoothY, (v) => v * 40);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden py-10 sm:py-16 md:py-24"
    >
      {/* Animated background blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <motion.div style={{ x: maroonX, y: maroonY }} className="animate-pulse-slow absolute -right-20 -top-20 size-48 rounded-full bg-gradient-to-br from-maroon-300 to-maroon-200 opacity-60 blur-3xl sm:size-60" />
        <motion.div style={{ x: goldX, y: goldY }} className="animate-pulse-slower absolute -left-20 top-1/2 size-48 rounded-full bg-gradient-to-br from-gold-300 to-gold-200 opacity-60 blur-3xl sm:size-64" />
        <div
          className="absolute bottom-0 right-1/4 size-56 animate-pulse rounded-full bg-gradient-to-br from-maroon-500 to-maroon-400 opacity-40 blur-3xl sm:size-72"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            <Image
              src="/brand/logo.png"
              alt="Adeyinka Bakare Fellowship"
              width={120}
              height={120}
              priority
              className="mx-auto size-24 rounded-2xl shadow-2xl md:size-[120px]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-gold-800 sm:tracking-[0.18em]"
          >
            <GraduationCap className="size-4" />
            University of Ilorin &middot; Department of IT
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-5 bg-gradient-to-r from-maroon-500 via-maroon-600 to-maroon-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:mb-6 md:text-7xl"
          >
            Empowering IT Students
            <span className="mt-1 block text-2xl sm:text-4xl md:text-6xl">For Academic Excellence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-2xl"
          >
            Scholarships, mentorship, and career development for Information Technology students at
            the University of Ilorin
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Magnetic className="block sm:inline-block">
            <Button
              asChild
              size="lg"
              className="group h-12 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 px-8 text-base text-white shadow-lg shadow-maroon-500/40 hover:from-maroon-600 hover:to-maroon-700 sm:w-auto"
            >
              <Link href="/get-involved">
                Join the Fellowship
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            </Magnetic>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full border-2 border-primary px-8 text-base text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
