import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { footerNavigation } from "@/config/navigation";

const headingClass = "font-sans text-xs font-bold uppercase tracking-[0.2em] text-primary";
const linkClass =
  "group inline-flex items-center gap-1 py-1 text-sm text-foreground/70 transition-colors hover:text-primary";

export function Footer() {
  return (
    <footer className="relative mt-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,250,244,0.95))]">
      {/* Brand accent line */}
      <div aria-hidden className="h-1 w-full bg-gradient-to-r from-gold-400 via-maroon-500 to-maroon-700" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <Image src="/brand/logo.png" alt="ABF" width={48} height={48} className="rounded-xl shadow-md" />
              <span className="leading-tight">
                <span className="block text-xs font-bold uppercase tracking-[0.3em] text-primary/80">ABF</span>
                <span className="block text-sm font-medium text-foreground/70">Adeyinka Bakare Fellowship</span>
              </span>
            </Link>
            <h3 className="max-w-md text-2xl font-semibold tracking-tight text-foreground">
              Empowering IT students through scholarships, mentorship, and career development.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-foreground/70">
              Supporting the Department of Information Technology, University of Ilorin
            </p>
          </div>

          <nav aria-label="Footer">
            <h4 className={headingClass}>Explore</h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className={headingClass}>Stay connected</h4>
            <p className="mt-4 text-sm leading-7 text-foreground/70">
              Join our community and access scholarship opportunities, mentorship programmes, and
              career development resources.
            </p>
            <div className="mt-3 flex flex-col items-start">
              <Link href="/get-involved" className="group inline-flex items-center gap-1 py-1 text-sm font-semibold text-primary">
                Get involved
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="group inline-flex items-center gap-1 py-1 text-sm font-semibold text-primary">
                Contact ABF
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-sm text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Adeyinka Bakare Fellowship. All rights reserved.</p>
          <p>Department of Information Technology, University of Ilorin</p>
        </div>
      </div>
    </footer>
  );
}
