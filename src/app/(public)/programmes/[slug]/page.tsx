import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Programme | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Programme"
      title="Programme details"
      description="Details of this ABF programme."
      back={{ href: "/programmes", label: "All programmes" }}
    />
  );
}
