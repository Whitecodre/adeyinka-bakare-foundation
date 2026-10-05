import { SITE_CONFIG } from "../lib/constants/site";

export const siteConfig = {
  ...SITE_CONFIG,
  description: "Empowering students through opportunity and support.",
  keywords: ["fellowship", "education", "students", "scholarship", "mentorship"],
  author: "Adeyinka Bakare Fellowship",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/abf",
    facebook: "https://facebook.com/abf",
    instagram: "https://instagram.com/abf",
  },
} as const;
