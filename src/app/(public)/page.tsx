import {
  HeroSection,
  StatsSection,
  FeatureCardsSection,
  MissionSection,
  ProgrammesSection,
  HowToJoinSection,
  CTASection,
} from "@/components/homepage";
import { Marquee } from "@/components/public/marquee";
import { values } from "@/config/about";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Marquee items={values.map((value) => value.label)} />
      <StatsSection />
      <FeatureCardsSection />
      <MissionSection />
      <ProgrammesSection />
      <HowToJoinSection />
      <CTASection />
    </>
  );
}
