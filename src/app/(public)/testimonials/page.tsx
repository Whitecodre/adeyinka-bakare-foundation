import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Testimonials | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="In their words"
      title="Testimonials"
      description="Hear directly from students who have been part of ABF."
    />
  );
}
