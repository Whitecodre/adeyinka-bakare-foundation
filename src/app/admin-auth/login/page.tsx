"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const redirectPath = searchParams.get("redirect") || "/admin";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      // TODO: Replace with actual Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: formData.email,
      //   password: formData.password,
      // });
      // if (error) throw error;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Login successful",
        description: "Welcome back to the admin dashboard",
      });

      router.push(redirectPath);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password",
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
              Admin Login
            </h1>
            <p className="text-sm text-[#2d1816]/60 mt-2">
              Sign in to access the administration dashboard
            </p>
          </div>

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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-[#2d1816]/80">Password</Label>
                <Link
                  href="/admin-auth/forgot-password"
                  className="text-xs text-[#aa322b] hover:text-[#922821] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-[#2d1816]/60">
            New admin?{" "}
            <Link
              href="/admin-auth/signup"
              className="text-[#aa322b] font-medium hover:underline underline-offset-4"
            >
              Request access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
