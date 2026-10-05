"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";

import { publicNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const compactHeader = isScrolled && !isMobile;

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.header
        animate={{
          width: compactHeader ? "min(95%, 900px)" : "100%",
          y: compactHeader ? 6 : 0,
          borderRadius: compactHeader ? 32 : 0,
          borderWidth: compactHeader ? 1 : 0,
          borderBottomWidth: 1,
          padding: compactHeader ? "16px 24px" : "24px 24px",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto flex justify-between items-center backdrop-blur-lg border-gray-200",
          compactHeader ? "bg-white/80 shadow-2xl shadow-black/5" : "bg-white/50"
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="ABF"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#aa322b]/75">
              ABF
            </span>
            <span className={cn("text-sm font-medium text-gray-700 transition-opacity duration-300", compactHeader ? "opacity-0 h-0" : "opacity-100")}>
              Adeyinka Bakare Fellowship
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          {publicNavigation
            .filter((item) => item.href !== "/")
            .slice(0, 5)
            .map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-widest transition-all",
                    isActive
                      ? "text-[#aa322b]"
                      : "text-gray-600 hover:text-[#aa322b]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex gap-3 items-center">
          <Link href="/contact">
            <Button variant="outline" className={cn("hidden rounded-full bg-white/80 px-4 shadow-sm md:inline-flex border-gray-300 text-gray-700 hover:text-[#aa322b] transition-all duration-300", compactHeader ? "opacity-0 w-0 p-0" : "opacity-100")}>
              Contact
            </Button>
          </Link>
          <Link href="/get-involved">
            <Button className="rounded-full px-5 shadow-lg bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white">
              Join Us
            </Button>
          </Link>
        </div>
      </motion.header>
    </div>
  );
}
