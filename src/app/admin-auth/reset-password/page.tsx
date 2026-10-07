"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // TODO: Validate token with Supabase
    setValidToken(true);
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // TODO: Replace with actual Supabase password update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPasswordReset(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please sign in with your new password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || "The reset link may have expired. Please request a new one.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="flex flex-col h-full relative">
        <Link href="/admin-auth/forgot-password" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1816]/60 hover:text-[#2d1816] transition-colors w-fit">
          <ArrowLeft size={16} />
          Back to forgot password
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-[#2d1816] font-['Libre_Baskerville'] mb-2">
                Invalid Reset Link
              </h1>
              <p className="text-sm text-[#2d1816]/60">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Link href="/admin-auth/forgot-password">
              <Button className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]">
                Request New Link
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="flex flex-col h-full relative">
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d1816] font-['Libre_Baskerville'] mb-2">
                Password Reset Successful
              </h1>
              <p className="text-sm text-[#2d1816]/60">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
            </div>
            <Link href="/admin-auth/login">
              <Button className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

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
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#2d1816]/80">New Password</Label>
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
              <Label className="text-xs font-medium text-[#2d1816]/80">Confirm New Password</Label>
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

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
