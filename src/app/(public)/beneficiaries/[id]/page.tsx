import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/public/page-placeholder";

export const metadata: Metadata = {
  title: "Beneficiary | Adeyinka Bakare Fellowship",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Beneficiary"
      title="Beneficiary profile"
      description="Profile of an ABF beneficiary."
      back={{ href: "/beneficiaries", label: "All beneficiaries" }}
    />
  );
}
