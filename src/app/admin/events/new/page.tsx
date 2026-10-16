"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ImageUpload } from "@/components/admin/image-upload";
import { PageHeader } from "@/components/admin/page-header";

export default function NewEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    location: "",
    start_at: "",
    end_at: "",
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

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.start_at) {
      newErrors.start_at = "Start date is required";
    }

    if (!formData.end_at) {
      newErrors.end_at = "End date is required";
    }

    if (formData.start_at && formData.end_at && new Date(formData.start_at) > new Date(formData.end_at)) {
      newErrors.end_at = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        location: formData.location.trim() || null,
        start_at: formData.start_at,
        end_at: formData.end_at || null,
        image: formData.image.trim() || null,
        status: formData.status,
        featured: formData.featured,
      };

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create event");
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      router.push("/admin/events");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create event",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Add New Event" subtitle="Create a new fellowship event" backHref="/admin/events" />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Event Information
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
                  placeholder="Enter event title"
                  className={`border-border ${errors.title ? "border-destructive" : ""}`}
                  disabled={loading}
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
                  placeholder="event-slug"
                  className={`border-border ${errors.slug ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.slug && (
                  <p className="text-xs text-destructive" role="alert">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Main Hall, Campus"
                  className={`border-border ${errors.location ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.location && (
                  <p className="text-xs text-destructive" role="alert">{errors.location}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={loading}
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
                <Label htmlFor="start_at">
                  Start Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start_at"
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) => handleInputChange("start_at", e.target.value)}
                  className={`border-border ${errors.start_at ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.start_at && (
                  <p className="text-xs text-destructive" role="alert">{errors.start_at}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_at">
                  End Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="end_at"
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) => handleInputChange("end_at", e.target.value)}
                  className={`border-border ${errors.end_at ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.end_at && (
                  <p className="text-xs text-destructive" role="alert">{errors.end_at}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => handleInputChange("image", value)}
                  label="Image URL"
                  bucket="public-images"
                  folder="events"
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
                placeholder="Enter event description..."
                rows={6}
                className={`border-border resize-none ${errors.description ? "border-destructive" : ""}`}
                disabled={loading}
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
                disabled={loading}
              />
              <Label htmlFor="featured" className="text-foreground cursor-pointer">
                Featured Event
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
              <Button variant="brand"
                type="submit"
                disabled={loading}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
