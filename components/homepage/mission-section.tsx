import { GraduationCap, Target, Users } from "lucide-react";

import { vision } from "@/config/about";
import { FeatureCard } from "@/components/public/feature-card";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";

const pillars = [
  {
    title: "Scholarships",
    description: "Need-based and merit-based financial support for deserving students",
    icon: GraduationCap,
  },
  {
    title: "Mentorship",
    description: "Connect with experienced professionals and build lasting relationships",
    icon: Users,
  },
  {
    title: "Career Development",
    description: "Practical industry exposure and professional skills training",
    icon: Target,
  },
];

export function MissionSection() {
  return (
    <Section className="bg-white">
      <Reveal>
        {/* The sentence below is the Vision in Article 2 of the constitution. */}
        <SectionHeading title="Our Vision" description={vision} />
      </Reveal>
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
        {pillars.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.1}>
            <FeatureCard icon={<Icon />} title={title} description={description} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
