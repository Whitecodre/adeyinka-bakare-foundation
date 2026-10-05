import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Event | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Event"
      title="Event details"
      description="Details of this ABF event."
      back={{ href: "/events", label: "All events" }}
    />
  );
}
