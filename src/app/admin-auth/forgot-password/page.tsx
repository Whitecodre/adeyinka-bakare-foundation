"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual Supabase password reset
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <Link href="/admin-auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1816]/60 hover:text-[#2d1816] transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to sign in
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto mt-12 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#2d1816] font-['Libre_Baskerville'] tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-[#2d1816]/60 mt-2">
              {submitted
                ? "Check your email for the reset link"
                : "Enter your email to receive a password reset link"}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#2d1816]/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d1816]/40" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@abf.org"
                    className={`pl-10 border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2d1816] mb-2">
                  Email sent successfully
                </h3>
                <p className="text-sm text-[#2d1816]/60">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-[#2d1816]">{formData.email}</span>
                </p>
              </div>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ email: "" });
                }}
                variant="outline"
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                Send another email
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
