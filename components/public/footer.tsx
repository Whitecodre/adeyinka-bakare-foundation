import Link from "next/link";
import { footerNavigation } from "@/config/navigation";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,250,244,0.95))]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/brand/logo.png"
                alt="ABF"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/75">
                  ABF
                </p>
                <p className="text-xs text-foreground/68">Adeyinka Bakare Fellowship</p>
              </div>
            </div>
            <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-foreground">
              Empowering IT students through scholarships, mentorship, and career development.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-foreground/68">
              Supporting the Department of Information Technology, University of Ilorin
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
              Explore
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-block py-1 text-foreground/68 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
              Stay connected
            </h4>
            <div className="mt-4 space-y-3 text-sm text-foreground/68">
              <p>Join our community and access scholarship opportunities, mentorship programmes, and career development resources.</p>
              <Link href="/get-involved" className="block py-1 font-medium text-primary transition-colors hover:text-primary/80">
                Get involved
              </Link>
              <Link href="/contact" className="block py-1 font-medium text-primary transition-colors hover:text-primary/80">
                Contact ABF
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Adeyinka Bakare Fellowship. All rights reserved.</p>
          {/* <p>Department of Information Technology, University of Ilorin</p> */}
        </div>
      </div>
    </footer>
  );
}
