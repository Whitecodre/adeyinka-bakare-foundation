"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const quotes = [
  {
    quote: "Empowering IT students to achieve their dreams through mentorship, resources, and community support.",
    author: "Adeyinka Bakare",
    desc: "Founder, ABF",
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    desc: "Inspiration",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    desc: "Inspiration",
  },
];

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeQuote, setActiveQuote] = useState(quotes[0]);

  useEffect(() => {
    setActiveQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-[#fffdf8]">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 px-6 pb-6 sm:px-12 lg:px-24">
        {children}
      </div>

      {/* Right Visual Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
            alt="ABF Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-[#2d1816]/60 backdrop-blur-sm z-0" />

        {/* Gradient Blobs */}
        <div className="absolute w-[500px] h-[500px] bg-[#f8c84d]/20 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 animate-pulse transition-all duration-1000" />
        <div className="absolute w-[300px] h-[300px] bg-[#aa322b]/20 rounded-full blur-[100px] bottom-0 right-0 z-0" />

        {/* Logo */}
        <div className="absolute top-8 left-8 z-20">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Image
              src="/brand/logo.png"
              alt="ABF Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-cover"
            />
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 max-w-lg p-12">
          <div className="text-6xl font-serif text-white/30 leading-none mb-4">"</div>

          <div className="min-h-[160px]">
            <AnimatePresence mode="wait">
              {mounted && (
                <motion.div
                  key={activeQuote.author}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <p className="text-2xl font-medium tracking-tight text-white/90 leading-snug font-['Libre_Baskerville']">
                    {activeQuote.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f8c84d]/20 border border-[#f8c84d]/30 rounded-full flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-[#f8c84d]/30" />
                      <div className="w-6 h-6 bg-[#f8c84d]/50 rounded-full blur-[2px]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{activeQuote.author}</p>
                      <p className="text-xs text-white/60">{activeQuote.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
