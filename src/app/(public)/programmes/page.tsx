import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Programmes | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="What ABF offers"
      title="Programmes"
      description="Scholarships, an internship programme and mentorship, matched to each level of your degree."
    />
  );
}
