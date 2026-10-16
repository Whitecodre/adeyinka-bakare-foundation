"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, UserPlus, Users } from "lucide-react";

import { ImageUpload } from "@/components/admin/image-upload";
import { PageHero } from "@/components/public/page-hero";
import { Section } from "@/components/public/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    level: "",
    session: "",
    photo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/public/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photo: formData.photo.trim() || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Welcome to the Adeyinka Bakare Foundation! Check your email for next steps and your membership guide.",
        });
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          department: "",
          level: "",
          session: "",
          photo: "",
        });
        setTimeout(() => router.push("/"), 4000);
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Become a Member"
        description="Join the Adeyinka Bakare Fellowship — a community of IT students supporting each other through scholarships, mentorship and career development."
      />

      <Section width="prose">
        <Link
          href="/get-involved"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-maroon-700"
        >
          <ArrowLeft className="size-4" /> Back to Get Involved
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid gap-0 md:grid-cols-[1fr_2fr]">
            {/* Sidebar: what members get */}
            <aside className="space-y-6 bg-gradient-to-br from-maroon-50 to-cream p-6 md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Membership perks
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Why join ABF?</h2>
              </div>
              <ul className="space-y-3 text-sm text-foreground/90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-maroon-500" />
                  Access to scholarship and grant opportunities
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-maroon-500" />
                  Mentorship from seniors and alumni
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-maroon-500" />
                  Career talks, workshops and networking events
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-maroon-500" />
                  A welcoming community of like-minded IT students
                </li>
              </ul>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4 text-xs text-foreground/80">
                <strong className="block text-foreground">Open to</strong>
                All registered students of the Department of Information Technology, University of Ilorin.
              </div>
            </aside>

            {/* Form */}
            <div className="p-6 md:p-8">
              {submitStatus && (
                <div
                  role="alert"
                  className={`mb-6 rounded-xl border p-4 text-sm ${
                    submitStatus.type === "success"
                      ? "border-success bg-success-soft text-success-foreground"
                      : "border-destructive bg-destructive/10 text-destructive"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone (WhatsApp) *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Information Technology"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="level">Level *</Label>
                    <select
                      id="level"
                      name="level"
                      required
                      value={formData.level}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
                    >
                      <option value="">Select your level</option>
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="session">Session *</Label>
                    <Input
                      id="session"
                      name="session"
                      required
                      value={formData.session}
                      onChange={handleChange}
                      placeholder="e.g., 2024/2025"
                    />
                  </div>
                </div>

                <ImageUpload
                  value={formData.photo}
                  onChange={(value) => setFormData({ ...formData, photo: value })}
                  onFileMetadata={(filename) => {
                    if (!formData.full_name) {
                      const guess = filename.split(".")[0].replace(/[-_]+/g, " ");
                      if (guess) setFormData((prev) => ({ ...prev, full_name: prev.full_name || guess }));
                    }
                  }}
                  label="Profile Photo"
                  resource="members"
                  maxSize={5 * 1024 * 1024}
                  accept="image/*"
                />

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => router.push("/get-involved")} disabled={isSubmitting} className="h-12">
                    Cancel
                  </Button>
                  <Button type="submit" variant="brand" disabled={isSubmitting} className="h-12 px-8">
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Submitting…
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <UserPlus className="size-4" />
                        Submit membership
                        <ArrowRight className="size-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          Already a member? <Link href="/get-involved/volunteer" className="font-semibold text-primary hover:text-maroon-700">Volunteer with us →</Link>
        </div>
      </Section>
    </>
  );
}
