import { Award, Briefcase, Compass, Wallet, type LucideIcon } from "lucide-react";

export interface ProgrammeLevel {
  short: string;
  level: string;
  title: string;
  summary: string;
  description: string;
  points: string[];
  icon: LucideIcon;
}

/** Source: ABF constitution, Article 5 (Scholarship and Mentorship Programmes). */
export const programmeLevels: ProgrammeLevel[] = [
  {
    short: "100L",
    level: "100 Level",
    title: "Need-Based Scholarship",
    summary: "Financial assistance for members with genuine need.",
    description:
      "The Need-Based Scholarship provides financial assistance to members who demonstrate genuine financial need, so they can focus on their academic pursuits.",
    points: [
      "A student of the Department of Information Technology",
      "In 100 Level",
      "A registered member of ABF",
      "Meets any additional requirements approved by the Scholarship Committee",
    ],
    icon: Wallet,
  },
  {
    short: "200L",
    level: "200 Level",
    title: "Need-Based and Merit-Based",
    summary: "Financial support, plus rewards for outstanding performance.",
    description:
      "In 200 Level, members can receive the Need-Based Scholarship, and the Merit-Based Scholarship recognises and rewards outstanding academic performance.",
    points: [
      "A student of the Department of Information Technology",
      "In 200 Level",
      "A registered member of ABF",
      "For merit: meets the academic performance requirements established by the Fellowship",
    ],
    icon: Award,
  },
  {
    short: "300L",
    level: "300 Level",
    title: "Internship Programme",
    summary: "Practical industry exposure before graduation.",
    description:
      "The Internship Programme provides practical industry exposure and professional experience, so members develop workplace competencies before graduation.",
    points: [
      "A student of the Department of Information Technology",
      "In 300 Level",
      "A registered member of ABF",
      "Meets any requirements set by the Fellowship or its partner organisations",
    ],
    icon: Briefcase,
  },
  {
    short: "400L",
    level: "400 Level",
    title: "Mentorship Programme",
    summary: "Career guidance, CV and interview preparation, networking.",
    description:
      "The Mentorship Programme prepares final-year students for life after graduation by connecting them with experienced professionals and mentors.",
    points: [
      "Career guidance and professional development",
      "Leadership coaching",
      "CV and interview preparation",
      "Networking opportunities and industry mentorship",
    ],
    icon: Compass,
  },
];
