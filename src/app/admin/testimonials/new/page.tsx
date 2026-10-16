"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Quote } from "lucide-react";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { PageHeader } from "@/components/admin/page-header";

type MediaType = "text" | "image" | "video" | "audio" | "document";

const DB_MEDIA_TYPES: Array<Exclude<MediaType, "text">> = ["image", "video", "audio", "document"];

export default function NewTestimonialPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Array<{ id: string; full_name: string }>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    beneficiary_id: "",
    content: "",
    media_url: "",
    media_type: "text" as MediaType,
    status: "draft",
    featured: false,
  });

  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        const res = await fetch("/api/admin/beneficiaries?status=published");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBeneficiaries(
            json.data.map((b: any) => ({ id: b.id, full_name: b.full_name }))
          );
        }
      } catch (error) {
        console.error("Failed to load beneficiaries:", error);
      }
    };
    loadBeneficiaries();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.beneficiary_id.trim()) {
      newErrors.beneficiary_id = "Beneficiary is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.media_type !== "text" && !formData.media_url.trim()) {
      newErrors.media_url = "Media is required for this media type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMediaTypeChange = (value: MediaType) => {
    setFormData((prev) => ({ ...prev, media_type: value, media_url: value === "text" ? "" : prev.media_url }));
    if (errors.media_url) setErrors((prev) => ({ ...prev, media_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const dbMediaType = formData.media_type === "text" ? null : formData.media_type;
      const payload = {
        beneficiary_id: formData.beneficiary_id || null,
        content: formData.content.trim(),
        media_url: formData.media_url.trim() || null,
        media_type: dbMediaType,
        status: formData.status,
        featured: formData.featured,
      };

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create testimonial");
      }

      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create testimonial",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Add New Testimonial"
        subtitle="Create a new beneficiary testimonial"
        backHref="/admin/testimonials"
      />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Quote className="size-4 text-primary" />
            Testimonial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="beneficiary_id">
                  Beneficiary <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.beneficiary_id}
                  onValueChange={(value) => handleInputChange("beneficiary_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger className={`border-border ${errors.beneficiary_id ? "border-destructive" : ""}`}>
                    <SelectValue placeholder={beneficiaries.length ? "Select beneficiary" : "No published beneficiaries yet"} />
                  </SelectTrigger>
                  <SelectContent>
                    {beneficiaries.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.beneficiary_id && (
                  <p className="text-xs text-destructive" role="alert">{errors.beneficiary_id}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="media_type">Media Type</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(v) => handleMediaTypeChange(v as MediaType)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text only</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.media_type !== "text" && (
              <ImageUpload
                value={formData.media_url}
                onChange={(value) => handleInputChange("media_url", value)}
                onFileMetadata={(filename, size, mimeType) => {
                  // Auto-detect media type from mime if user didn't pick
                  if (formData.media_type === "text" || !formData.media_type) {
                    const detected = mimeType.startsWith("image/")
                      ? "image"
                      : mimeType.startsWith("video/")
                      ? "video"
                      : mimeType.startsWith("audio/")
                      ? "audio"
                      : mimeType === "application/pdf"
                      ? "document"
                      : null;
                    if (detected) handleInputChange("media_type", detected);
                  }
                  // surface to user if needed
                  void filename; void size;
                }}
                label={`${DB_MEDIA_TYPES.find((t) => t === formData.media_type) || "Media"} attachment`}
                resource="testimonials"
                maxSize={50 * 1024 * 1024}
                accept={
                  formData.media_type === "image"
                    ? "image/*"
                    : formData.media_type === "video"
                    ? "video/*"
                    : formData.media_type === "audio"
                    ? "audio/*"
                    : "application/pdf"
                }
              />
            )}
            {errors.media_url && (
              <p className="text-xs text-destructive" role="alert">{errors.media_url}</p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter testimonial content..."
                rows={6}
                className={`border-border resize-none ${errors.content ? "border-destructive" : ""}`}
                disabled={loading}
              />
              {errors.content && (
                <p className="text-xs text-destructive" role="alert">{errors.content}</p>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={loading}
              />
              <Label htmlFor="featured" className="cursor-pointer text-foreground">
                Featured Testimonial
              </Label>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="brand"
                type="submit"
                disabled={loading}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create Testimonial"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
