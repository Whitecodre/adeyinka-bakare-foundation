import { GraduationCap, Users, Briefcase, Target } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const stats = [
  { icon: GraduationCap, label: "Scholarships", value: "20+" },
  { icon: Users, label: "Members", value: "100+" },
  { icon: Briefcase, label: "Placements & Support", value: "5+" },
  { icon: Target, label: "Programmes", value: "4" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#f6e3dd] to-[#ebc3b9] mb-4">
                <stat.icon className="w-8 h-8 text-[#aa322b]" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
