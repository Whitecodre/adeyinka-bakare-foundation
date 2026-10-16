"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/admin/loading-state";
import { ImageUpload } from "@/components/admin/image-upload";
import { PageHeader } from "@/components/admin/page-header";

interface Beneficiary {
  id: string;
  full_name: string;
  department?: string | null;
  level?: string | null;
  session?: string | null;
  programme?: string | null;
  photo?: string | null;
  bio?: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
}

export default function EditBeneficiaryPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    level: "",
    session: "",
    programme: "",
    photo: "",
    bio: "",
    status: "draft",
    featured: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/beneficiaries/${params.id}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to load beneficiary");
        const b: Beneficiary = json.data;
        setBeneficiary(b);
        setFormData({
          full_name: b.full_name ?? "",
          department: b.department ?? "",
          level: b.level ?? "",
          session: b.session ?? "",
          programme: b.programme ?? "",
          photo: b.photo ?? "",
          bio: b.bio ?? "",
          status: b.status ?? "draft",
          featured: !!b.featured,
        });
      } catch (error: any) {
        console.error("Error loading beneficiary:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "Failed to load beneficiary",
        });
      } finally {
        setLoading(false);
      }
    };
    if (params.id) load();
  }, [params.id, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.level.trim()) newErrors.level = "Level is required";
    if (!formData.session.trim()) newErrors.session = "Session is required";
    if (!formData.programme.trim()) newErrors.programme = "Programme is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        department: formData.department.trim() || null,
        level: formData.level.trim() || null,
        session: formData.session.trim() || null,
        programme: formData.programme.trim() || null,
        photo: formData.photo.trim() || null,
        bio: formData.bio.trim() || null,
        status: formData.status,
        featured: formData.featured,
      };
      const res = await fetch(`/api/admin/beneficiaries/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update beneficiary");

      toast({ title: "Success", description: "Beneficiary updated successfully" });
      router.push("/admin/beneficiaries");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating beneficiary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update beneficiary",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (loading) return <LoadingState message="Loading beneficiary..." />;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Edit Beneficiary" subtitle={`Update ${beneficiary?.full_name ?? "beneficiary"}`} backHref="/admin/beneficiaries" />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <GraduationCap className="size-4 text-primary" />
            Beneficiary Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="full_name" value={formData.full_name} onChange={(e) => handleInputChange("full_name", e.target.value)} className={`border-border ${errors.full_name ? "border-destructive" : ""}`} disabled={submitting} />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="department">Department <span className="text-destructive">*</span></Label>
                <Input id="department" value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} className={`border-border ${errors.department ? "border-destructive" : ""}`} disabled={submitting} />
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="level">Level <span className="text-destructive">*</span></Label>
                <Input id="level" value={formData.level} onChange={(e) => handleInputChange("level", e.target.value)} className={`border-border ${errors.level ? "border-destructive" : ""}`} disabled={submitting} />
                {errors.level && <p className="text-xs text-destructive">{errors.level}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="session">Session <span className="text-destructive">*</span></Label>
                <Input id="session" value={formData.session} onChange={(e) => handleInputChange("session", e.target.value)} className={`border-border ${errors.session ? "border-destructive" : ""}`} disabled={submitting} />
                {errors.session && <p className="text-xs text-destructive">{errors.session}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="programme">Programme <span className="text-destructive">*</span></Label>
                <Input id="programme" value={formData.programme} onChange={(e) => handleInputChange("programme", e.target.value)} className={`border-border ${errors.programme ? "border-destructive" : ""}`} disabled={submitting} />
                {errors.programme && <p className="text-xs text-destructive">{errors.programme}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)} disabled={submitting}>
                  <SelectTrigger className="border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload
              value={formData.photo}
              onChange={(value) => handleInputChange("photo", value)}
              label="Photo"
              resource="beneficiaries"
              maxSize={5 * 1024 * 1024}
              accept="image/*"
            />

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} rows={4} className="border-border resize-none" disabled={submitting} />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => handleInputChange("featured", checked)} disabled={submitting} />
              <Label htmlFor="featured" className="cursor-pointer text-foreground">Featured Beneficiary</Label>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting} className="h-11 w-full sm:h-10 sm:w-auto">Cancel</Button>
              <Button variant="brand" type="submit" disabled={submitting} className="h-11 w-full sm:h-10 sm:w-auto">
                {submitting ? <><Loader2 className="size-4 animate-spin" /> Updating…</> : "Update Beneficiary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
