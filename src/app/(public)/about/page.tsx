import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import {
  eligibility,
  executiveRoles,
  governance,
  memberResponsibilities,
  memberRights,
  membershipCategories,
  mission,
  objectives,
  values,
  vision,
} from "@/config/about";
import { programmeLevels } from "@/config/programme-levels";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CTABanner } from "@/components/public/cta-banner";
import { FeatureCard, NumberedItem } from "@/components/public/feature-card";
import { JourneyTimeline } from "@/components/public/journey-timeline";
import { Marquee } from "@/components/public/marquee";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";

export const metadata: Metadata = {
  title: "About ABF | Adeyinka Bakare Fellowship",
  description:
    "The Adeyinka Bakare Fellowship (ABF) empowers Information Technology students at the University of Ilorin through scholarships, mentorship, career development and collaborative learning.",
};

const tabPanelClass =
  "mt-5 animate-in fade-in-0 slide-in-from-bottom-3 duration-500";

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-maroon-50 text-primary">
            <Check className="size-3.5" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About ABF"
        title="Who we are"
        description="The Adeyinka Bakare Fellowship exists to empower students through scholarships, mentorship, career development, and collaborative learning."
      />

      {/* Who we are */}
      <Section id="who-we-are">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Who we are
            </p>
            <h2 className="mb-5 text-3xl font-bold text-foreground md:text-4xl">
              A fellowship built on character and learning
            </h2>
            <p className="mb-4 text-muted-foreground">
              ABF is the student association of the Department of Information Technology at the
              University of Ilorin, united by a commitment to academic excellence, leadership,
              integrity, innovation, and service.
            </p>
            <p className="mb-6 text-muted-foreground">
              We foster an environment of excellence, accountability, innovation and mutual support.
            </p>
            <ul className="flex flex-wrap gap-2">
              {values.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2 text-sm font-bold text-gold-800 transition-all duration-300 active:scale-95 active:bg-gold-400 active:text-ink hover:-translate-y-0.5 hover:-rotate-2 hover:border-gold-400 hover:bg-gold-400 hover:text-ink"
                >
                  <Icon className="size-4" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="right" className="space-y-5">
            <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
              <Image
                src="/brand/logo.png"
                alt="Adeyinka Bakare Fellowship logo"
                width={96}
                height={96}
                className="mx-auto rounded-2xl shadow-xl"
              />
              <p className="mt-4 font-display text-lg font-bold text-foreground">
                Adeyinka Bakare Fellowship
              </p>
              <p className="text-muted-foreground">Also referred to as ABF Fellowship</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Marquee items={values.map((value) => value.label)} />

      {/* Vision and mission */}
      <Section tone="tint" id="vision-and-mission">
        <SectionHeading
          eyebrow="Vision and Mission"
          title="Where we are going, and how"
        />
        <Reveal className="mx-auto mb-14 max-w-3xl">
          <blockquote className="border-l-4 border-gold-400 pl-6 font-display text-lg italic leading-relaxed text-maroon-700 md:text-2xl">
            {vision}
          </blockquote>
          <p className="mt-3 pl-7 text-sm text-muted-foreground">Our vision</p>
        </Reveal>
        <h3 className="mb-6 text-center text-xl font-bold text-foreground">Our mission</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mission.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <FeatureCard icon={<Icon />} title={title} description={description} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Objectives */}
      <Section id="objectives">
        <SectionHeading eyebrow="Objectives" title="What we set out to do" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective, index) => (
            <Reveal key={objective} delay={index * 0.08}>
              <NumberedItem number={index + 1} title={objective} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Programmes by level */}
      <Section tone="tint" id="journey">
        <SectionHeading
          eyebrow="The ABF journey"
          title="Support at every level"
          description="Each stage of your degree has a programme designed for it. Scroll to follow the path, or tap a stage."
        />
        <JourneyTimeline
          steps={programmeLevels.map(({ icon: Icon, level, ...step }) => ({
            ...step,
            icon: <Icon />,
            heading: `${level}: ${step.title}`,
          }))}
        />
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link href="/programmes">
              Explore all programmes
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Membership */}
      <Section id="membership">
        <SectionHeading eyebrow="Membership" title="Becoming part of ABF" />
        <Reveal className="mx-auto max-w-3xl">
          <Tabs defaultValue="join">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border p-1.5">
              <TabsTrigger value="join" className="min-h-11 flex-1 rounded-xl px-4 data-[state=active]:text-primary">
                Who can join
              </TabsTrigger>
              <TabsTrigger value="categories" className="min-h-11 flex-1 rounded-xl px-4 data-[state=active]:text-primary">
                Categories
              </TabsTrigger>
              <TabsTrigger value="rights" className="min-h-11 flex-1 rounded-xl px-4 data-[state=active]:text-primary">
                Your rights
              </TabsTrigger>
              <TabsTrigger value="part" className="min-h-11 flex-1 rounded-xl px-4 data-[state=active]:text-primary">
                Your part
              </TabsTrigger>
            </TabsList>

            <TabsContent value="join" className={tabPanelClass}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <CheckList items={eligibility} />
                <Button asChild size="lg" className="mt-6 h-12 px-8">
                  <Link href="/get-involved">
                    Join the Fellowship
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="categories" className={tabPanelClass}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <p className="mb-4 text-muted-foreground">Membership comes in three categories:</p>
                <div className="flex flex-wrap gap-2">
                  {membershipCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="px-3 py-1 text-sm">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="rights" className={tabPanelClass}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <p className="mb-4 font-semibold text-foreground">Every member has the right to:</p>
                <CheckList items={memberRights} />
              </div>
            </TabsContent>
            <TabsContent value="part" className={tabPanelClass}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <p className="mb-4 font-semibold text-foreground">Every member is expected to:</p>
                <CheckList items={memberResponsibilities} />
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </Section>

      {/* Leadership */}
      <Section tone="tint" width="prose" id="leadership">
        <SectionHeading
          eyebrow="Leadership"
          title="Who runs ABF"
          description="Executives are elected or appointed through screening, interview and selection. Tap a role to see what it does."
        />
        <Reveal>
          <Accordion
            mode="multiple"
            items={executiveRoles.map(({ id, title, icon: Icon, duties }) => ({
              id,
              title,
              icon: <Icon />,
              content: <CheckList items={duties} />,
            }))}
          />
        </Reveal>
      </Section>

      {/* Governance */}
      <Section width="prose" id="governance">
        <SectionHeading eyebrow="Governance and transparency" title="Run by a written constitution" />
        <Reveal>
          <Accordion
            mode="single"
            defaultOpen={["finances"]}
            items={governance.map(({ id, title, icon: Icon, body }) => ({
              id,
              title,
              icon: <Icon />,
              content: <p className="m-0">{body}</p>,
            }))}
          />
        </Reveal>
      </Section>

      <CTABanner
        title="Ready to be part of ABF?"
        description="Become part of a fellowship that supports students to achieve their academic and career goals."
        primary={{ label: "Join the Fellowship", href: "/get-involved" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
