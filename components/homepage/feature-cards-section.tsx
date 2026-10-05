import { GraduationCap, Users, Target, Award, BookOpen, TrendingUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const features = [
  {
    title: "Scholarship Support",
    description: "Need-based and merit-based financial assistance for deserving IT students throughout their academic journey.",
    icon: GraduationCap,
    color: "from-[#aa322b] to-[#922821]",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
  },
  {
    title: "Mentorship Network",
    description: "Connect with experienced professionals and alumni who guide you through career decisions and professional growth.",
    icon: Users,
    color: "from-[#f8c84d] to-[#d9960d]",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  },
  {
    title: "Career Development",
    description: "Practical industry exposure, internship placements, and professional skills training for workplace readiness.",
    icon: Target,
    color: "from-[#d88f7f] to-[#c45d4f]",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  },
  {
    title: "Academic Excellence",
    description: "Academic support, study resources, and collaborative learning environments to help you excel.",
    icon: Award,
    color: "from-[#922821] to-[#73201c]",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
  },
  {
    title: "Skill Building",
    description: "Technical workshops, certification programs, and hands-on training in cutting-edge technologies.",
    icon: BookOpen,
    color: "from-[#ebc3b9] to-[#d88f7f]",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  },
  {
    title: "Leadership Training",
    description: "Develop leadership skills through student governance, event management, and team collaboration opportunities.",
    icon: TrendingUp,
    color: "from-[#ffe08a] to-[#f8c84d]",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  },
];

export function FeatureCardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${features.length * 110}vh` }}>
      {/* Sticky Header */}
      <div className="sticky top-0 left-0 right-0 z-30 bg-gray-50/90 backdrop-blur-md py-6 border-b border-black/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#922821]">
              What We Offer
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Pinned deck container */}
      <div className="sticky top-24 h-[calc(100vh-6rem)] flex items-center justify-center px-4 pb-6 md:px-8">
        {features.map((feature, index) => (
          <CardStack
            key={index}
            index={index}
            total={features.length}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            color={feature.color}
            image={feature.image}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

// Card Stack Component - Pinned cards that slide up and reveal the next card underneath
function CardStack({ index, total, title, description, icon: Icon, color, image, scrollProgress }: {
  index: number;
  total: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  image: string;
  scrollProgress: any;
}) {
  // Calculate progress for this card based on its position in the stack
  const cardProgress = useTransform(
    scrollProgress,
    (latest: number) => {
      const start = index / total;
      const end = (index + 1) / total;
      const progress = (latest - start) / Math.max(end - start, 0.0001);
      return Math.min(1, Math.max(0, progress));
    }
  );

  const scale = useTransform(cardProgress, [0, 0.7, 1], [1 - index * 0.025, 1, 0.96]);
  const y = useTransform(cardProgress, [0, 0.7, 1], [index * 14, 0, -120]);
  const opacity = useTransform(cardProgress, [0, 0.82, 1], [1, 1, 0]);

  return (
    <motion.div
      style={{
        scale,
        y,
        opacity,
        zIndex: total - index,
      }}
      className="absolute w-[min(92vw,72rem)] h-[min(72vh,44rem)] rounded-[2rem] shadow-2xl overflow-hidden bg-white"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={800}
          className="object-cover w-full h-full"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/55 to-black/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 lg:p-14">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 bg-gradient-to-br ${color} backdrop-blur-sm shadow-xl`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white max-w-2xl">{title}</h3>
        <p className="text-base md:text-lg text-gray-100 leading-relaxed max-w-xl">{description}</p>
      </div>
    </motion.div>
  );
}
