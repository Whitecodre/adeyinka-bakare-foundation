import type { Metadata } from "next";
import { BadgeCheck, FileText, Mail, MessageCircle, Phone } from "lucide-react";

import { externalLinks } from "@/config/external-links";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section } from "@/components/public/section";
import { ContactCard } from "@/components/public/contact-card";
import { IconTile } from "@/components/public/feature-card";

export const metadata: Metadata = {
  title: "Contact | Adeyinka Bakare Fellowship",
  description: "Official ways to reach the Adeyinka Bakare Fellowship.",
};

export default function ContactPage() {
  const { email, phone, whatsappCommunity, enquiryForm } = externalLinks;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach the Adeyinka Bakare Fellowship through our official channels."
      />

      <Section width="prose">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <ContactCard
              icon={<Mail aria-hidden />}
              label="Email"
              value={email}
              href={email ? `mailto:${email}` : ""}
            />
          </Reveal>
          <Reveal delay={0.06}>
            <ContactCard
              icon={<Phone aria-hidden />}
              label="Phone"
              value={phone}
              href={phone ? `tel:${phone.replace(/\s/g, "")}` : ""}
            />
          </Reveal>
          <Reveal delay={0.12}>
            <ContactCard
              icon={<MessageCircle aria-hidden />}
              label="WhatsApp community"
              value="Join the community"
              href={whatsappCommunity}
              external
            />
          </Reveal>
          <Reveal delay={0.18}>
            <ContactCard
              icon={<FileText aria-hidden />}
              label="Enquiries and volunteering"
              value="Open the form"
              href={enquiryForm}
              external
            />
          </Reveal>
        </div>

        <Reveal delay={0.24}>
          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-maroon-200 bg-maroon-50 p-4">
            <IconTile className="size-11">
              <BadgeCheck aria-hidden />
            </IconTile>
            <p className="text-sm text-muted-foreground">
              This is the official website of the Adeyinka Bakare Fellowship, for students of the
              Department of Information Technology, University of Ilorin.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
