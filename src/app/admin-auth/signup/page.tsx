"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Lock, User, Building, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    signupCode: "",
    organization: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.signupCode.trim()) {
      newErrors.signupCode = "Signup code is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for requesting admin access";
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
      // TODO: Replace with actual Supabase auth and admin creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Request submitted",
        description: "Your admin access request has been submitted for review",
      });

      router.push("/admin-auth/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Failed to submit request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1816]/60 hover:text-[#2d1816] transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to website
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto mt-12 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#2d1816] font-['Libre_Baskerville'] tracking-tight">
              Request Admin Access
            </h1>
            <p className="text-sm text-[#2d1816]/60 mt-2">
              Fill in the form below to request admin dashboard access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d1816]/40" />
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className={`pl-10 border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
            </div>

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

            {/* Organization */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">Organization (optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d1816]/40" />
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Adeyinka Bakare Foundation"
                  className="pl-10 border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Signup Code */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">Signup Code *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d1816]/40" />
                <Input
                  value={formData.signupCode}
                  onChange={(e) => setFormData({ ...formData, signupCode: e.target.value })}
                  placeholder="Enter your signup code"
                  className={`pl-10 border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20 ${
                    errors.signupCode ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.signupCode && <p className="text-[11px] text-red-500">{errors.signupCode}</p>}
              <p className="text-[11px] text-[#2d1816]/60">
                Contact the foundation administrator to obtain a signup code
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d1816]/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="•••••••••"
                  className={`pl-10 pr-10 border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d1816]/40 hover:text-[#2d1816]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d1816]/40" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="•••••••••"
                  className={`pl-10 pr-10 border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d1816]/40 hover:text-[#2d1816]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">Reason for Request *</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why you need admin access..."
                rows={3}
                className={`border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20 resize-none ${
                  errors.reason ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {errors.reason && <p className="text-[11px] text-red-500">{errors.reason}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-[#2d1816]/60">
            Already have access?{" "}
            <Link
              href="/admin-auth/login"
              className="text-[#aa322b] font-medium hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
