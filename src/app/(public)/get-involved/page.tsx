import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Get Involved | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Get involved"
      title="Join the Fellowship"
      description="What joining ABF means, and the steps to take."
    />
  );
}
