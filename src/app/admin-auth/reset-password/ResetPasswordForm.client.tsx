"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const token = searchParams.get("token");

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

  return (
    <div className="relative flex h-full flex-col">
      <Link
        href="/admin-auth/login"
        className="inline-flex min-h-[44px] w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>

      <div className="mx-auto mt-8 flex w-full max-w-sm flex-1 flex-col justify-center lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          {!validToken || passwordReset ? (
            <div>
              <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Reset Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Reset your admin account password
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 8 characters"
                    aria-invalid={!!errors.password}
                    className={`h-11 pl-10 pr-12 ${errors.password ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat your new password"
                    aria-invalid={!!errors.confirmPassword}
                    className={`h-11 pl-10 pr-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 font-semibold text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}