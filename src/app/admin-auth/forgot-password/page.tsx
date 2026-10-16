import type { Metadata } from "next";

import { ForgotPasswordForm } from "./ForgotPasswordForm.client";

export const metadata: Metadata = {
  title: "Reset Password | Adeyinka Bakare Fellowship",
  description: "Request a password reset link for your admin account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
