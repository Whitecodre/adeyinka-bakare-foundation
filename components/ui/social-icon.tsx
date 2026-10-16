import { Globe, Mail } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

type SocialIcon = IconType | typeof Globe;

export interface SocialPlatform {
  value: string;
  label: string;
  icon: SocialIcon;
  /** Example shown in the admin URL field. */
  placeholder: string;
}

/**
 * The platforms ABF can link to. Lucide has no brand logos any more, so brands
 * come from react-icons; the generic ones (email, website) stay Lucide.
 * Used by the footer and the admin Social Links page so they never drift apart.
 */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { value: "facebook", label: "Facebook", icon: FaFacebook, placeholder: "https://facebook.com/yourpage" },
  { value: "twitter", label: "X (Twitter)", icon: FaXTwitter, placeholder: "https://x.com/yourhandle" },
  { value: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "https://instagram.com/yourhandle" },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedin, placeholder: "https://linkedin.com/company/yourpage" },
  { value: "youtube", label: "YouTube", icon: FaYoutube, placeholder: "https://youtube.com/@yourchannel" },
  { value: "tiktok", label: "TikTok", icon: FaTiktok, placeholder: "https://tiktok.com/@yourhandle" },
  { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, placeholder: "https://chat.whatsapp.com/yourinvite" },
  { value: "telegram", label: "Telegram", icon: FaTelegram, placeholder: "https://t.me/yourchannel" },
  { value: "email", label: "Email", icon: Mail, placeholder: "hello@example.com" },
  { value: "other", label: "Website / other", icon: Globe, placeholder: "https://example.com" },
];

export function getSocialPlatform(platform: string): SocialPlatform {
  const lower = platform.trim().toLowerCase();
  const key = lower === "x" ? "twitter" : lower;
  return (
    SOCIAL_PLATFORMS.find((p) => p.value === key) ??
    SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1]
  );
}

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = getSocialPlatform(platform).icon;
  return <Icon aria-hidden className={className} />;
}

/** "hello@abf.org" becomes "mailto:hello@abf.org"; links with a scheme pass through. */
export function normaliseSocialUrl(platform: string, raw: string): string {
  const value = raw.trim();
  if (platform.toLowerCase() === "email" && value && !/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return `mailto:${value}`;
  }
  return value;
}
