import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#aa322b] via-[#922821] to-[#73201c] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-[#f6e3dd]">
            Become part of a fellowship that empowers students to achieve their academic and career goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved">
              <Button size="lg" className="bg-white text-[#aa322b] hover:bg-gray-100 shadow-xl">
                Apply Now
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/programmes">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                View Programmes
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
