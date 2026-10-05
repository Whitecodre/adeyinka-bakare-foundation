import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "News article | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="News"
      title="News article"
      description="An update from ABF."
      back={{ href: "/news", label: "All news" }}
    />
  );
}
