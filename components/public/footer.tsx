"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageSquare, User } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import { useEffect, useState } from "react";

import type { FooterSection, FooterLink, SocialLink } from "@/lib/types/domain.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const headingClass = "font-sans text-xs font-bold uppercase tracking-[0.2em] text-maroon-600";
const linkClass =
  "group inline-flex items-center gap-1 py-1 text-sm text-muted-foreground transition-colors hover:text-maroon-600";

type QuickLink = { label: string; href: string };

/**
 * Hardcoded quick-access panel that always shows the public pages,
 * regardless of whether the admin has populated the footer_sections
 * table. This guarantees the footer is never empty.
 */
const QUICK_LINKS: QuickLink[] = [
  { label: "About ABF", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Beneficiaries", href: "/beneficiaries" },
  { label: "Testimonials", href: "/testimonials" },
];

const QUICK_NEWS_EVENTS: QuickLink[] = [
  { label: "Latest News", href: "/news" },
  { label: "All Events", href: "/events" },
];

const QUICK_GET_INVOLVED: QuickLink[] = [
  { label: "Become a Member", href: "/get-involved/member" },
  { label: "Volunteer with ABF", href: "/get-involved/volunteer" },
  { label: "Apply", href: "/get-involved" },
  { label: "Contact Us", href: "/contact" },
];

function QuickSection({ title, links }: { title: string; links: QuickLink[] }) {
  return (
    <nav aria-label={title}>
      <h4 className={headingClass}>{title}</h4>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              <span className="relative">
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-maroon-600 transition-transform duration-300 group-hover:scale-x-100"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface SiteSettings {
  site_name?: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  address?: string;
  whatsapp?: string;
}

export function Footer() {
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sectionsRes, linksRes, socialRes, settingsRes] = await Promise.all([
          fetch("/api/public/footer/sections"),
          fetch("/api/public/footer/links"),
          fetch("/api/public/social-links"),
          fetch("/api/settings"),
        ]);

        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json();
          setFooterSections(sectionsData.success ? sectionsData.data : []);
        }

        if (linksRes.ok) {
          const linksData = await linksRes.json();
          setFooterLinks(linksData.success ? linksData.data : []);
        }

        if (socialRes.ok) {
          const socialData = await socialRes.json();
          setSocialLinks(socialData.success ? socialData.data : []);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData.success ? settingsData.data : {});
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ variant: "destructive", title: "Enter a valid email" });
      return;
    }
    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: newsletterName.trim() || undefined,
          source: "footer",
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error);
      toast({ title: j.message === "Already subscribed" ? "Already subscribed" : "Subscribed!", description: "Check your email for a welcome note." });
      setNewsletterEmail("");
      setNewsletterName("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message || "Try again" });
    } finally { setNewsletterLoading(false); }
  };

  // Group links by section
  const linksBySection = footerLinks.reduce((acc, link) => {
    if (!acc[link.section_id]) {
      acc[link.section_id] = [];
    }
    acc[link.section_id].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  // Filter only active sections and links
  const activeSections = footerSections.filter((section) => section.is_active);
  const activeLinksBySection = Object.fromEntries(
    Object.entries(linksBySection).map(([sectionId, links]) => [
      sectionId,
      links.filter((link) => link.is_active),
    ])
  );

  const logoSrc = settings.logo || "/brand/logo.png";
  const siteName = settings.site_name || "Adeyinka Bakare Fellowship";
  const tagline = settings.tagline || "Empowering IT students through scholarships, mentorship, and career development.";


  if (loading) {
    return null; // Or show a loading skeleton
  }

  return (
    <footer className="relative">
      {/* Brand accent line */}
      <div aria-hidden className="h-1 w-full bg-gradient-to-r from-gold-300 via-maroon-500 to-maroon-700" />

      {/* Featured newsletter band — gradient maroon with copy + form + secondary links */}
      <div className="relative overflow-hidden bg-gradient-to-r from-maroon-500 via-maroon-600 to-maroon-700 text-white">
        <div aria-hidden className="abf-float absolute -right-20 -top-16 size-72 rounded-full bg-gold-300/25 blur-3xl" />
        <div aria-hidden className="abf-float absolute -bottom-24 -left-16 size-80 rounded-full bg-maroon-300/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                The ABF Newsletter
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                Get scholarship and programme updates in your inbox
              </h2>
              <p className="mt-3 max-w-xl text-sm text-maroon-100 sm:text-base">
                Monthly digest of new programmes, scholarship windows, event invitations and
                beneficiary stories. No spam, unsubscribe anytime.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full flex-col gap-2"
              aria-label="Subscribe to the ABF newsletter"
            >
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <User
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-maroon-200"
                    aria-hidden
                  />
                  <Input
                    type="text"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="h-12 w-full rounded-full border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-maroon-200 focus-visible:ring-gold-300"
                    aria-label="Your name"
                    disabled={newsletterLoading}
                  />
                </div>
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-maroon-200" aria-hidden />
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-full border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-maroon-200 focus-visible:ring-gold-300"
                    aria-label="Email for newsletter"
                    required
                    disabled={newsletterLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={newsletterLoading}
                className="h-12 w-full shrink-0 rounded-full bg-gold-300 px-7 text-sm font-bold text-maroon-900 shadow-lg shadow-black/20 hover:bg-gold-400 sm:w-auto"
              >
                {newsletterLoading ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer link columns */}
      <div className="bg-gradient-to-b from-white/55 to-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <Image src={logoSrc} alt="ABF" width={48} height={48} className="rounded-xl shadow-md" />
              <span className="leading-tight">
                <span className="block text-xs font-bold uppercase tracking-[0.3em] text-maroon-600/80">ABF</span>
                <span className="block text-sm font-medium text-muted-foreground">{siteName}</span>
              </span>
            </Link>
            <h3 className="max-w-md text-2xl font-semibold tracking-tight text-foreground">
              {tagline}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Supporting the Department of Information Technology, University of Ilorin
            </p>

            {/* Contact Information */}
            <div className="mt-6 space-y-3">
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-maroon-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  {settings.email}
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-maroon-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  {settings.phone}
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-maroon-600 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {settings.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social) => {
                  const isMail = social.url.startsWith("mailto:");
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-maroon-600/40 hover:bg-maroon-600/5 hover:text-maroon-600"
                      aria-label={social.platform}
                    >
                      <SocialIcon platform={social.platform} className="size-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Built-in quick links: only a fallback for when the admin has no footer
              sections yet. Once sections exist in the database they are the single
              source, so nothing renders twice. */}
          {activeSections.length === 0 && (
            <>
              <QuickSection title="Explore" links={QUICK_LINKS} />
              <QuickSection title="News & Events" links={QUICK_NEWS_EVENTS} />
              <QuickSection title="Get Involved" links={QUICK_GET_INVOLVED} />
            </>
          )}

          {/* Additional footer sections managed by the admin (footer_sections / footer_links). */}
          {activeSections.map((section) => (
            <nav key={section.id} aria-label={section.title}>
              <h4 className={headingClass}>{section.title}</h4>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
                {activeLinksBySection[section.id]?.map((link: FooterLink) => (
                  <li key={link.id}>
                    <Link href={link.url} className={linkClass}>
                      <span className="relative">
                        {link.label}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-maroon-600 transition-transform duration-300 group-hover:scale-x-100"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Adeyinka Bakare Fellowship. All rights reserved.</p>
          <p>Department of Information Technology, University of Ilorin</p>
        </div>
      </div>
      </div>
    </footer>
  );
}
