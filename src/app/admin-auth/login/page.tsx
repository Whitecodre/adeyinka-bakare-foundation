import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm.client";

export const metadata: Metadata = {
  title: "Admin Login | Adeyinka Bakare Fellowship",
  description: "Sign in to the Adeyinka Bakare Fellowship administration dashboard.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
