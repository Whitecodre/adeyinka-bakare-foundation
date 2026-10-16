"use client";

import { GraduationCap, Users, Target, Award, BookOpen, TrendingUp, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  image: string;
}

const features: Feature[] = [
  {
    title: "Scholarship Support",
    description: "Need-based and merit-based financial assistance for deserving IT students throughout their academic journey.",
    icon: GraduationCap,
    color: "from-maroon-500 to-maroon-600",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
  },
  {
    title: "Mentorship Network",
    description: "Connect with experienced professionals and alumni who guide you through career decisions and professional growth.",
    icon: Users,
    color: "from-gold-300 to-gold-500",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  },
  {
    title: "Career Development",
    description: "Practical industry exposure, internship placements, and professional skills training for workplace readiness.",
    icon: Target,
    color: "from-maroon-300 to-maroon-400",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  },
  {
    title: "Academic Excellence",
    description: "Academic support, study resources, and collaborative learning environments to help you excel.",
    icon: Award,
    color: "from-maroon-600 to-maroon-700",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
  },
  {
    title: "Skill Building",
    description: "Technical workshops, certification programs, and hands-on training in cutting-edge technologies.",
    icon: BookOpen,
    color: "from-maroon-200 to-maroon-300",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  },
  {
    title: "Leadership Training",
    description: "Develop leadership skills through student governance, event management, and team collaboration opportunities.",
    icon: TrendingUp,
    color: "from-gold-200 to-gold-300",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  },
];

/** Image + text for one feature. Shared by the pinned stack and the plain list. */
function FeatureCardBody({ feature, priority = false }: { feature: Feature; priority?: boolean }) {
  const Icon = feature.icon;

  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={feature.image}
          alt=""
          fill
          sizes="(min-width: 1152px) 72rem, 92vw"
          priority={priority}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/55 to-black/75" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12 lg:p-14">
        <div
          className={`mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl md:mb-5 md:size-16 ${feature.color}`}
        >
          <Icon className="size-7 text-white md:size-8" />
        </div>
        <h3 className="mb-3 max-w-2xl text-2xl font-bold text-white md:mb-4 md:text-4xl">{feature.title}</h3>
        <p className="max-w-xl text-base leading-relaxed text-gray-100 md:text-lg">{feature.description}</p>
      </div>
    </>
  );
}

export function FeatureCardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {/* Heading sits in normal flow so the fixed navbar can never cover it */}
      <div className="bg-maroon-50/60 px-4 pb-4 pt-12 sm:px-6 md:pt-16">
        <Reveal>
          <SectionHeading title="What We Offer" className="mb-0 md:mb-0" />
        </Reveal>
      </div>

      {reduceMotion ? (
        /* Reduced motion: a plain, non-pinned list */
        <div className="mx-auto grid max-w-7xl gap-5 bg-maroon-50/60 px-4 pb-12 sm:px-6 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="relative h-80 overflow-hidden rounded-3xl shadow-xl">
              <FeatureCardBody feature={feature} />
            </div>
          ))}
        </div>
      ) : (
        /* Pinned deck: cards slide away one by one as you scroll. dvh keeps it stable under mobile browser bars. */
        <section ref={sectionRef} className="relative bg-maroon-50/60" style={{ height: `${features.length * 100}vh` }}>
          <div className="sticky top-[88px] flex h-[calc(100dvh-88px)] items-center justify-center px-4 pb-6 md:px-8">
            {features.map((feature, index) => (
              <CardStack
                key={feature.title}
                index={index}
                total={features.length}
                feature={feature}
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// Pinned card that slides up to reveal the next card underneath
function CardStack({
  index,
  total,
  feature,
  scrollProgress,
}: {
  index: number;
  total: number;
  feature: Feature;
  scrollProgress: MotionValue<number>;
}) {
  const cardProgress = useTransform(scrollProgress, (latest: number) => {
    const start = index / total;
    const end = (index + 1) / total;
    const progress = (latest - start) / Math.max(end - start, 0.0001);
    return Math.min(1, Math.max(0, progress));
  });

  const scale = useTransform(cardProgress, [0, 0.7, 1], [1 - index * 0.025, 1, 0.96]);
  const y = useTransform(cardProgress, [0, 0.7, 1], [index * 14, 0, -120]);
  const opacity = useTransform(cardProgress, [0, 0.82, 1], [1, 1, 0]);

  return (
    <motion.div
      style={{ scale, y, opacity, zIndex: total - index }}
      className="absolute h-[min(68dvh,40rem)] w-[min(92vw,72rem)] overflow-hidden rounded-3xl bg-white shadow-2xl md:rounded-[2rem]"
    >
      <FeatureCardBody feature={feature} priority={index === 0} />
    </motion.div>
  );
}
