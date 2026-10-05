"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { publicNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // While the mobile menu is open: Escape closes it, and the page behind it does not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const compactHeader = isScrolled && !isMobile;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 flex w-full justify-center">
      <motion.header
        animate={{
          width: compactHeader ? "min(95%, 900px)" : "100%",
          y: compactHeader ? 6 : 0,
          borderRadius: compactHeader ? 32 : 0,
          borderWidth: compactHeader ? 1 : 0,
          borderBottomWidth: 1,
          padding: compactHeader ? "16px 24px" : isMobile ? "14px 16px" : "24px 24px",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto flex items-center justify-between border-border backdrop-blur-lg",
          compactHeader ? "bg-white/80 shadow-2xl shadow-black/5" : "bg-white/70"
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image src="/brand/logo.png" alt="ABF" width={32} height={32} className="rounded-lg" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">ABF</span>
            <span
              className={cn(
                "text-sm font-medium text-foreground/75 transition-opacity duration-300",
                compactHeader ? "h-0 opacity-0" : "opacity-100"
              )}
            >
              Adeyinka Bakare Fellowship
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {publicNavigation
            .filter((item) => item.href !== "/")
            .slice(0, 5)
            .map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative py-1 text-xs font-semibold uppercase tracking-widest transition-colors",
                    isActive ? "text-primary" : "text-foreground/65 hover:text-primary"
                  )}
                >
                  {item.label}
                  {/* Hover: a thin line grows in. Active: a solid line that slides between links. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded bg-primary/40 transition-transform duration-300 group-hover:scale-x-100"
                  />
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-line"
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            className={cn(
              "hidden rounded-full bg-white/80 px-4 shadow-sm transition-all duration-300 hover:text-primary md:inline-flex",
              compactHeader ? "w-0 p-0 opacity-0" : "opacity-100"
            )}
          >
            <Link href="/contact">Contact</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-maroon-500 to-maroon-600 px-5 text-white shadow-lg hover:from-maroon-600 hover:to-maroon-700"
          >
            <Link href="/get-involved" onClick={() => setMenuOpen(false)}>
              Join Us
            </Link>
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-xl border bg-white text-foreground transition-transform active:scale-95 md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="pointer-events-auto fixed inset-0 -z-10 bg-ink/40 backdrop-blur-sm md:hidden"
            />
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto absolute inset-x-3 top-[72px] max-h-[calc(100dvh-88px)] overflow-y-auto rounded-2xl bg-white p-3 shadow-2xl md:hidden"
            >
              {publicNavigation.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center rounded-xl px-4 font-semibold transition-colors active:bg-maroon-100",
                        isActive ? "bg-maroon-50 text-primary" : "text-foreground"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mr-3 h-5 w-1 rounded-full bg-primary transition-all duration-300",
                          isActive ? "opacity-100" : "w-0 opacity-0"
                        )}
                      />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
