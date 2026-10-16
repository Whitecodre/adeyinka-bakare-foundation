import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm.client";

export const metadata: Metadata = {
  title: "Reset Password | Adeyinka Bakare Fellowship",
  description: "Set a new password for your admin account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
