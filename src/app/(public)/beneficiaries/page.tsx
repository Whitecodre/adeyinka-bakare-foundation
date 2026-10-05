import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Beneficiaries | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Our beneficiaries"
      title="Beneficiaries"
      description="Past and current beneficiaries of ABF programmes."
    />
  );
}
