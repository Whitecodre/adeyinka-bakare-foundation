"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import type { FooterSection, FooterLink, SocialLink } from "@/lib/types/domain.types";

const headingClass = "font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#922821]";
const linkClass =
  "group inline-flex items-center gap-1 py-1 text-sm text-[#2d1816]/70 transition-colors hover:text-[#922821]";

export function Footer() {
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const [sectionsRes, linksRes, socialRes] = await Promise.all([
          fetch("/api/public/footer/sections"),
          fetch("/api/public/footer/links"),
          fetch("/api/public/social-links"),
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
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  // Group links by section
  const linksBySection = footerLinks.reduce((acc, link) => {
    if (!acc[link.section_id]) {
      acc[link.section_id] = [];
    }
    acc[link.section_id].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  if (loading) {
    return null; // Or show a loading skeleton
  }

  return (
    <footer className="relative mt-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,250,244,0.95))]">
      {/* Brand accent line */}
      <div aria-hidden className="h-1 w-full bg-gradient-to-r from-[#f8c84d] via-[#aa322b] to-[#7a221b]" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <Image src="/brand/logo.png" alt="ABF" width={48} height={48} className="rounded-xl shadow-md" />
              <span className="leading-tight">
                <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#922821]/80">ABF</span>
                <span className="block text-sm font-medium text-[#2d1816]/70">Adeyinka Bakare Fellowship</span>
              </span>
            </Link>
            <h3 className="max-w-md text-2xl font-semibold tracking-tight text-[#2d1816]">
              Empowering IT students through scholarships, mentorship, and career development.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#2d1816]/70">
              Supporting the Department of Information Technology, University of Ilorin
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2d1816]/70 hover:text-[#922821] transition-colors"
                    aria-label={social.platform}
                  >
                    <span className="sr-only">{social.platform}</span>
                    {/* Icon would be rendered here based on platform */}
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <nav key={section.id} aria-label={section.title}>
              <h4 className={headingClass}>{section.title}</h4>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
                {linksBySection[section.id]?.map((link: FooterLink) => (
                  <li key={link.id}>
                    <Link href={link.url} className={linkClass}>
                      <span className="relative">
                        {link.label}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#922821] transition-transform duration-300 group-hover:scale-x-100"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h4 className={headingClass}>Stay connected</h4>
            <p className="mt-4 text-sm leading-7 text-[#2d1816]/70">
              Join our community and access scholarship opportunities, mentorship programmes, and
              career development resources.
            </p>
            <div className="mt-3 flex flex-col items-start">
              <Link href="/get-involved" className="group inline-flex items-center gap-1 py-1 text-sm font-semibold text-[#922821]">
                Get involved
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="group inline-flex items-center gap-1 py-1 text-sm font-semibold text-[#922821]">
                Contact ABF
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#e9ddd3] pt-6 text-sm text-[#2d1816]/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Adeyinka Bakare Fellowship. All rights reserved.</p>
          <p>Department of Information Technology, University of Ilorin</p>
        </div>
      </div>
    </footer>
  );
}
