import type { Metadata } from "next";
import { SignupForm } from "./SignupForm.client";

export const metadata: Metadata = {
  title: "Request Admin Access | Adeyinka Bakare Fellowship",
  description: "Apply for admin access to the Adeyinka Bakare Fellowship dashboard.",
};

export default function SignupPage() {
  return <SignupForm />;
}
