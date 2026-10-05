import { GraduationCap, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#922821]">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            To support intentional undergraduate students of the Department of Information Technology with a strong commitment to learning and good character through our fellowship programme, enabling them to achieve academic success, complete their studies at the University, and prepare them for their career pursuits.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {pillars.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#aa322b] to-[#922821] mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
