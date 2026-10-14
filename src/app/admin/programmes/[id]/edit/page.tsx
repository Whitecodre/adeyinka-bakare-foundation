"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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

interface Programme {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
}

export default function EditProgrammePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [programme, setProgramme] = useState<Programme | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    status: "draft",
    featured: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

  useEffect(() => {
    const loadProgramme = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/programmes/${params.id}`);
        const j = await res.json();
        if (!j.success) throw new Error(j.error || "Failed to load programme");
        const data: Programme = j.data;
        setProgramme(data);
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          image: data.image || "",
          status: data.status,
          featured: data.featured,
        });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message || "Failed to load programme" });
      } finally {
        setLoading(false);
      }
    };
    loadProgramme();
  }, [params.id, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/admin/programmes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Failed to update programme");
      toast({ title: "Success", description: "Programme updated successfully" });
      router.push("/admin/programmes");
      router.refresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update programme" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return <LoadingState message="Loading programme..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Edit Programme" subtitle="Update programme information" backHref="/admin/programmes" />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Programme Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter programme title"
                  className={`border-border ${errors.title ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.title && (
                  <p className="text-xs text-destructive" role="alert">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="programme-slug"
                  className={`border-border ${errors.slug ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.slug && (
                  <p className="text-xs text-destructive" role="alert">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => handleInputChange("image", value)}
                  label="Image URL"
                  bucket="public-images"
                  folder="programmes"
                  maxSize={10 * 1024 * 1024}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter programme description..."
                rows={6}
                className={`border-border resize-none ${errors.description ? "border-destructive" : ""}`}
                disabled={submitting}
              />
              {errors.description && (
                <p className="text-xs text-destructive" role="alert">{errors.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={submitting}
              />
              <Label htmlFor="featured" className="text-foreground cursor-pointer">
                Featured Programme
              </Label>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                Cancel
              </Button>
              <Button variant="brand"
                type="submit"
                disabled={submitting}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Programme"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
