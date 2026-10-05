import { GraduationCap, Zap, Target, Users } from "lucide-react";
import { motion } from "framer-motion";

const programmes = [
  {
    level: "100 Level",
    programme: "Need-Based Scholarship",
    description: "Financial assistance for students who demonstrate genuine financial need",
    color: "from-[#f6e3dd] to-[#ebc3b9]",
    icon: GraduationCap,
  },
  {
    level: "200 Level",
    programme: "Merit-Based Scholarship",
    description: "Recognition and rewards for outstanding academic performance",
    color: "from-[#f8c84d] to-[#ffe08a]",
    icon: Zap,
  },
  {
    level: "300 Level",
    programme: "Internship Programme",
    description: "Practical industry exposure and professional experience",
    color: "from-[#d88f7f] to-[#c45d4f]",
    icon: Target,
  },
  {
    level: "400 Level",
    programme: "Mentorship Programme",
    description: "Career guidance and professional development for final-year students",
    color: "from-[#aa322b] to-[#922821]",
    icon: Users,
  },
];

export function ProgrammesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#922821]">
            Our Programmes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive support designed for every stage of your academic journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programmes.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-[#aa322b]/30 flex flex-col items-center text-center"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-gradient-to-r ${item.color} text-gray-900`}>
                {item.level}
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-md mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-[#aa322b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.programme}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
