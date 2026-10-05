import {
  BookOpen,
  Compass,
  Crown,
  GraduationCap,
  Heart,
  Landmark,
  Lightbulb,
  Megaphone,
  Network,
  Palette,
  PenLine,
  Scale,
  ScrollText,
  ShieldCheck,
  Sprout,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/*
 * Content for the About page.
 * Every line comes from the ABF constitution (docs/ABF_Details.md).
 * If something is not in the constitution, do not add it here: ask ABF.
 */

export const values: { label: string; icon: LucideIcon }[] = [
  { label: "Academic excellence", icon: BookOpen },
  { label: "Leadership", icon: Crown },
  { label: "Integrity", icon: ShieldCheck },
  { label: "Innovation", icon: Lightbulb },
  { label: "Service", icon: Heart },
];

export const vision =
  "To support intentional undergraduate students of the Department of Information Technology with a strong commitment to learning and good character through its fellowship programme, enabling them to achieve academic success, complete their studies at the University and prepare them for their career pursuits.";

export const mission: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Scholarships and grants", description: "Need-based and merit-based opportunities.", icon: GraduationCap },
  { title: "Mentorship and careers", description: "Promote mentorship and career development.", icon: Compass },
  { title: "A supportive community", description: "Build a supportive academic and professional community.", icon: Users },
  { title: "Leadership and innovation", description: "Encourage leadership, innovation, and lifelong learning.", icon: Lightbulb },
  { title: "Growth and impact", description: "Connect members with opportunities for growth and impact.", icon: Sprout },
];

export const objectives = [
  "Support deserving students of the Department of Information Technology through scholarship initiatives",
  "Establish a mentorship programme",
  "Promote networking among students and professionals",
  "Develop leadership skills among members",
  "Encourage innovation and collaboration",
  "Build career-focused clusters for specialised learning",
];

export const eligibility = [
  "A registered student of the University of Ilorin",
  "A registered student of any level in the Department of Information Technology",
  "Registered with the Fellowship through the Fellowship registration link",
];

export const membershipCategories = ["Active members", "Executive members", "Alumni members"];

export const memberRights = [
  "Be treated fairly and respectfully",
  "Vote for, and contest, any executive position",
  "Participate in Fellowship programmes",
  "Access Fellowship opportunities",
  "Receive mentorship support",
];

export const memberResponsibilities = [
  "Uphold the values of the Fellowship",
  "Attend meetings and programmes of the Fellowship",
  "Respect Fellowship executives and their decisions",
  "Promote unity and professionalism",
  "Protect the reputation of the Fellowship",
  "Abide by the constitution",
];

export const executiveRoles: { id: string; title: string; icon: LucideIcon; duties: string[] }[] = [
  {
    id: "president",
    title: "President",
    icon: Crown,
    duties: [
      "Provides overall leadership and strategic direction for the Association",
      "Represents the Association at formal functions and external engagements",
      "Calls and presides over all executive and general meetings",
    ],
  },
  {
    id: "general-secretary",
    title: "General Secretary",
    icon: PenLine,
    duties: [
      "Prepares meeting agendas and keeps accurate minutes of all meetings",
      "Handles official correspondence and documentation",
      "Maintains membership records and executive decisions",
    ],
  },
  {
    id: "pro",
    title: "Public Relations Officer",
    icon: Megaphone,
    duties: [
      "Develops and implements communication strategies for the Association",
      "Promotes events, achievements and announcements through social media and other channels",
      "Handles inquiries and press releases",
    ],
  },
  {
    id: "financial-secretary",
    title: "Financial Secretary",
    icon: Wallet,
    duties: [
      "Records all income, expenses and financial transactions",
      "Prepares regular financial updates for the executive council and members",
      "Ensures financial transparency and accountability",
    ],
  },
  {
    id: "cluster-coordinator",
    title: "Cluster Coordinator",
    icon: Network,
    duties: [
      "Coordinates and supervises the activities of all career clusters",
      "Works with Cluster Leads to develop cluster plans and initiatives",
      "Reports cluster activities and progress to the executive council",
    ],
  },
  {
    id: "designer",
    title: "Designer",
    icon: Palette,
    duties: [
      "Designs flyers, posters, banners, certificates and promotional materials",
      "Creates graphics for social media and digital channels",
      "Ensures all designs reflect the Association's brand identity",
    ],
  },
];

export const governance: { id: string; title: string; icon: LucideIcon; body: string }[] = [
  {
    id: "finances",
    title: "Accountable finances",
    icon: Landmark,
    body: "Funds come from sponsors, alumni, partners and well-wishers. They are used solely for the objectives of the Fellowship, and every expenditure must be approved before any money is disbursed. Records of income and spending are kept and reported to the Executive Council and members.",
  },
  {
    id: "fair-process",
    title: "A fair process",
    icon: Scale,
    body: "Discipline follows a written code guided by fairness and the right of every member to be heard. A written complaint is made, the accused is given notice and the chance to respond, a committee investigates, and the Executive Council makes the final decision. Anyone disciplined may appeal in writing within seven days.",
  },
  {
    id: "constitution",
    title: "A written constitution",
    icon: ScrollText,
    body: "ABF is governed by a written constitution that sets out its vision, mission, membership, executive roles, programmes, finances and discipline. It is the supreme governing document of the Fellowship, and every officer, committee and member acts in accordance with it.",
  },
];
