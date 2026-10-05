import { CTABanner } from "@/components/public/cta-banner";

export function CTASection() {
  return (
    <CTABanner
      title="Ready to Join Our Community?"
      description="Become part of a fellowship that empowers students to achieve their academic and career goals"
      primary={{ label: "Apply Now", href: "/get-involved" }}
      secondary={{ label: "View Programmes", href: "/programmes" }}
    />
  );
}
