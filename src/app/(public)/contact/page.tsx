import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Contact | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Contact"
      title="Contact ABF"
      description="Get in touch with the fellowship."
    />
  );
}
