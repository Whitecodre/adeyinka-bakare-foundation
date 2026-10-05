"use client";

import { useState, useEffect } from "react";
import { HeroSection, StatsSection, FeatureCardsSection, MissionSection, ProgrammesSection, CTASection } from "@/components/homepage";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <HeroSection />
      <StatsSection />
      <FeatureCardsSection />
      <MissionSection />
      <ProgrammesSection />
      <CTASection />
    </div>
  );
}
