"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, Eye, EyeOff, KeyRound, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + error/hint. Keeps every field on this page identical. */
function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: React.ReactNode;
  invalid?: boolean;
}

function IconInput({ icon, invalid, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-5">
        {icon}
      </span>
      <Input aria-invalid={invalid} className={cn("h-11 pl-10", invalid && "border-destructive", className)} {...props} />
    </div>
  );
}

function PasswordInput({
  invalid,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type"> & { invalid?: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type={visible ? "text" : "password"}
        aria-invalid={invalid}
        className={cn("h-11 pl-10 pr-12", invalid && "border-destructive")}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const update = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

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
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to submit request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <Link
        href="/"
        className="inline-flex min-h-[44px] w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to website
      </Link>

      <div className="mx-auto mt-6 flex w-full max-w-xl flex-1 flex-col justify-center pb-8">
        <div className="abf-fade-up space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Request Admin Access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in the form below to request admin dashboard access
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <fieldset className="space-y-4" disabled={loading}>
              <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                About you
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="fullName" label="Full name" error={errors.fullName}>
                  <IconInput
                    id="fullName"
                    icon={<User />}
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={update("fullName")}
                    placeholder="Your full name"
                    invalid={!!errors.fullName}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <IconInput
                    id="email"
                    type="email"
                    icon={<Mail />}
                    autoComplete="email"
                    value={formData.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    invalid={!!errors.email}
                  />
                </Field>
                <Field id="organization" label="Role or organisation (optional)">
                  <IconInput
                    id="organization"
                    icon={<Building />}
                    value={formData.organization}
                    onChange={update("organization")}
                    placeholder="e.g. ABF executive"
                  />
                </Field>
                <Field
                  id="signupCode"
                  label="Signup code"
                  error={errors.signupCode}
                  hint="Ask an ABF administrator for a code"
                >
                  <IconInput
                    id="signupCode"
                    icon={<KeyRound />}
                    value={formData.signupCode}
                    onChange={update("signupCode")}
                    placeholder="Enter your signup code"
                    invalid={!!errors.signupCode}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4" disabled={loading}>
              <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Secure your account
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="password" label="Password" error={errors.password} hint="At least 8 characters">
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={update("password")}
                    placeholder="Create a password"
                    invalid={!!errors.password}
                  />
                </Field>
                <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
                  <PasswordInput
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={update("confirmPassword")}
                    placeholder="Repeat the password"
                    invalid={!!errors.confirmPassword}
                  />
                </Field>
              </div>
            </fieldset>

            <Field id="reason" label="Reason for request" error={errors.reason}>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={update("reason")}
                placeholder="Explain why you need admin access"
                rows={3}
                aria-invalid={!!errors.reason}
                disabled={loading}
                className={cn("resize-none", errors.reason && "border-destructive")}
              />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 font-semibold text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700"
            >
              {loading ? "Submitting..." : "Submit request"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have access?{" "}
            <Link href="/admin-auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
