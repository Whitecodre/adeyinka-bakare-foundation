import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BellOff,
  CheckCircle2,
  Mail,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";
import { Reveal } from "@/components/public/reveal";
import { createAdminClient } from "@/lib/supabase/admin";
import { UnsubscribeForm } from "./unsubscribe-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe | Adeyinka Bakare Foundation",
  description:
    "Manage your subscription to the Adeyinka Bakare Foundation newsletter.",
  robots: { index: false, follow: false },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";

type LookupResult =
  | { kind: "ok"; status: "subscribed" | "unsubscribed" | "pending"; email: string; full_name: string | null }
  | { kind: "missing" }
  | { kind: "invalid" };

async function lookup(emailParam: string | undefined): Promise<LookupResult> {
  if (!emailParam) return { kind: "invalid" };
  const email = emailParam.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { kind: "invalid" };
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("newsletter_subscribers")
      .select("email, full_name, status")
      .eq("email", email)
      .maybeSingle();
    if (!data) return { kind: "missing" };
    return {
      kind: "ok",
      email: data.email,
      full_name: data.full_name,
      status: (data.status as "subscribed" | "unsubscribed" | "pending") ?? "subscribed",
    };
  } catch (err) {
    console.error("unsubscribe lookup error", err);
    return { kind: "invalid" };
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; confirmed?: string }>;
}) {
  const params = await searchParams;
  const lookupResult = await lookup(params.email);
  const justConfirmed = params.confirmed === "1";

  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="Manage your subscription"
        description="We respect your inbox. Unsubscribe anytime — no hard feelings."
      >
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" /> Back to ABF
          </Link>
        </div>
      </PageHero>

      <Section width="prose">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={HERO_IMAGE}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid size-16 place-items-center rounded-2xl bg-white/95 text-primary shadow-xl">
                  <BellOff className="size-7" />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {lookupResult.kind === "invalid" && (
                <InvalidState />
              )}

              {lookupResult.kind === "missing" && (
                <MissingState email={params.email} />
              )}

              {lookupResult.kind === "ok" && lookupResult.status === "subscribed" && !justConfirmed && (
                <ConfirmState
                  email={lookupResult.email}
                  fullName={lookupResult.full_name}
                />
              )}

              {lookupResult.kind === "ok" && (lookupResult.status === "unsubscribed" || justConfirmed) && (
                <SuccessState
                  email={lookupResult.email}
                  fullName={lookupResult.full_name}
                  alreadyUnsubscribed={lookupResult.status === "unsubscribed"}
                />
              )}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function ConfirmState({ email, fullName }: { email: string; fullName: string | null }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">
          Are you sure?
        </span>
      </div>
      <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
        Unsubscribe from the ABF newsletter
      </h2>
      <p className="text-muted-foreground">
        We'll stop sending monthly scholarship, programme and event updates to{" "}
        <span className="font-semibold text-foreground">{fullName || "this address"}</span>.{" "}
        You can resubscribe anytime from the footer of any page on the site.
      </p>

      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Subscriber email
            </p>
            <p className="truncate text-sm font-semibold text-foreground">{email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4 text-sm text-foreground/80">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-gold-700" />
          <p>
            <strong className="text-foreground">Heads up:</strong> you'll still receive
            important transactional emails (e.g. your membership, event bookings, security
            alerts) — this only stops the monthly digest.
          </p>
        </div>
      </div>

      <UnsubscribeForm email={email} />

      <p className="text-center text-sm text-muted-foreground">
        Changed your mind? <Link href="/" className="font-semibold text-primary hover:text-maroon-700">Keep me subscribed →</Link>
      </p>
    </div>
  );
}

function SuccessState({
  email,
  fullName,
  alreadyUnsubscribed,
}: {
  email: string;
  fullName: string | null;
  alreadyUnsubscribed: boolean;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-success-soft text-success">
        <CheckCircle2 className="size-8" />
      </div>
      <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
        {alreadyUnsubscribed ? "You're already unsubscribed" : "You're unsubscribed"}
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        {alreadyUnsubscribed
          ? "We've already removed you from the list — no further action needed."
          : "Thanks for being part of the ABF community, even briefly. You'll no longer receive the monthly digest."}{" "}
        {fullName ? `Take care, ${fullName}.` : "Take care."}
      </p>
      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground/80">
        <div className="flex items-center justify-center gap-3">
          <Mail className="size-4 shrink-0 text-primary" />
          <span className="truncate">{email}</span>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
        >
          Back to ABF
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
        <Link
          href="/news"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-7 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Browse latest news
        </Link>
      </div>
    </div>
  );
}

function MissingState({ email }: { email: string | undefined }) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-warning-soft text-warning">
        <ShieldAlert className="size-8" />
      </div>
      <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
        We couldn't find that subscription
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        {email
          ? <>There's no ABF newsletter subscription for <span className="font-semibold text-foreground">{email}</span> in our records. It may have already been removed, or the address could be a typo.</>
          : "The link you used is missing the email address. Please open the most recent newsletter and use the Unsubscribe link at the bottom."}
      </p>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
        >
          Back to ABF
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-7 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}

function InvalidState() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-warning-soft text-warning">
        <ShieldAlert className="size-8" />
      </div>
      <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
        Link looks incomplete
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        We couldn't read your email from the unsubscribe link. Please open the most recent
        newsletter and use the Unsubscribe link at the bottom of the email.
      </p>
      <Link
        href="/contact"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
      >
        Contact support
      </Link>
    </div>
  );
}
