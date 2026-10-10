import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Compass, MessageCircle, ShieldCheck, Users, Vote } from "lucide-react";

import { externalLinks } from "@/config/external-links";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { IconTile, NumberedItem } from "@/components/public/feature-card";
import { LinkButton } from "@/components/public/link-button";

export const metadata: Metadata = {
  title: "Get Involved | Adeyinka Bakare Fellowship",
  description:
    "Who can join the Adeyinka Bakare Fellowship, what members receive, and how to register.",
};

/** Source: ABF constitution, Section 3.2 (Membership Eligibility). */
const requirements = [
  "A registered student of the University of Ilorin",
  "A registered student of any level of the Department of Information Technology",
  "Registered with the Fellowship through the Fellowship registration link",
];

/** Source: ABF constitution, Section 3.4 (Rights of Members). */
const rights = [
  { icon: ShieldCheck, title: "Be treated fairly and respectfully" },
  { icon: Vote, title: "Vote for and contest any executive position" },
  { icon: Users, title: "Participate in Fellowship programmes" },
  { icon: Award, title: "Access Fellowship opportunities" },
  { icon: Compass, title: "Receive mentorship support" },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Join the Fellowship"
        description="Membership is open to students of the Department of Information Technology, University of Ilorin."
      >
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <LinkButton href={externalLinks.registrationForm}>
            Register as a member
            <ArrowRight aria-hidden />
          </LinkButton>
          <LinkButton href={externalLinks.whatsappCommunity} variant="outline">
            <MessageCircle aria-hidden />
            Join the WhatsApp community
          </LinkButton>
        </div>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Eligibility" title="Who can join" />
        <div className="grid gap-6 md:grid-cols-3">
          {requirements.map((requirement, index) => (
            <Reveal key={requirement} delay={index * 0.08}>
              <NumberedItem number={index + 1} title={requirement} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading
          eyebrow="Member rights"
          title="What members can expect"
          description="Every member has the right to:"
        />
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {rights.map(({ icon: Icon, title }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <div className="flex min-h-[44px] items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm">
                <IconTile className="size-11">
                  <Icon aria-hidden />
                </IconTile>
                <p className="font-semibold text-foreground">{title}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground">
          Members uphold the values of the Fellowship and attend its meetings and programmes. See{" "}
          <Link href="/programmes" className="font-medium text-primary hover:text-maroon-600">
            what ABF offers
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
