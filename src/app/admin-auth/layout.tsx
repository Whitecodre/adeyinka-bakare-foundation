import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { AuthQuote } from "./auth-quote";

/** Shared shell for the admin sign-in pages: form on the left, brand panel on large screens. */
export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex w-full flex-col px-4 pb-6 pt-6 sm:px-12 lg:w-1/2 lg:px-24 lg:pt-8">
        {children}
      </div>

      <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-maroon-500 via-maroon-600 to-maroon-700 lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
        <div
          aria-hidden
          className="abf-float absolute -right-24 -top-24 size-96 rounded-full bg-gradient-to-br from-gold-300 to-gold-200 opacity-30 blur-3xl"
        />
        <div
          aria-hidden
          className="abf-float absolute -bottom-32 -left-24 size-96 rounded-full bg-maroon-400 opacity-40 blur-3xl"
        />

        <div className="flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/logo.png"
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-2xl border border-white/20 object-cover shadow-lg"
            />
            <div className="leading-tight">
              <p className="font-[family-name:var(--font-display)] text-lg font-bold">Adeyinka Bakare Fellowship</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                Admin dashboard
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <AuthQuote />
          </div>

          <div className="flex items-center gap-3 text-sm text-maroon-100">
            <ShieldCheck className="size-5 shrink-0 text-gold-300" />
            Authorised administrators only
          </div>
        </div>
      </aside>
    </div>
  );
}
