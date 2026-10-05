"use client";

import { GraduationCap, Users, Briefcase, Target } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// NOTE: only "Programmes: 4" comes from the constitution. The other figures
// still need to be confirmed by ABF before launch.
const stats = [
  { icon: GraduationCap, label: "Scholarships", value: "20+" },
  { icon: Users, label: "Members", value: "100+" },
  { icon: Briefcase, label: "Placements & Support", value: "5+" },
  { icon: Target, label: "Programmes", value: "4" },
];

export function StatsSection() {
  return (
    <section className="border-y bg-white py-12 md:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 sm:px-6"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants} className="text-center">
              <div className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-maroon-100 to-maroon-200 md:mb-4 md:size-16">
                <stat.icon className="size-7 text-primary md:size-8" />
              </div>
              <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
