import type { Metadata } from "next";
import { MFAConfirmForm } from "./MFAConfirmForm.client";

export const metadata: Metadata = {
  title: "MFA Verification | Adeyinka Bakare Fellowship",
  description: "Verify your multi-factor authentication to access the admin panel.",
};

export default function MFAConfirmPage() {
  return <MFAConfirmForm />;
}
