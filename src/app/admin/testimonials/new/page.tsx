"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
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

export default function NewTestimonialPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    beneficiary_id: "",
    content: "",
    media_url: "",
    media_type: "text",
    status: "draft",
    featured: false,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.beneficiary_id.trim()) {
      newErrors.beneficiary_id = "Beneficiary is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.media_type !== "text" && !formData.media_url.trim()) {
      newErrors.media_url = "Media URL is required for this media type";
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

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('testimonials')
      //   .insert({
      //     beneficiary_id: formData.beneficiary_id,
      //     content: formData.content,
      //     media_url: formData.media_url,
      //     media_type: formData.media_type,
      //     status: formData.status,
      //     featured: formData.featured,
      //   })
      //   .select()
      //   .single();

      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });

      router.push("/admin/testimonials");
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create testimonial",
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground m-0">Add New Testimonial</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create a new testimonial</p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Testimonial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="beneficiary_id" className="text-foreground">
                  Beneficiary <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.beneficiary_id}
                  onValueChange={(value) => handleInputChange("beneficiary_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger className={`border-border ${errors.beneficiary_id ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select beneficiary" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Load beneficiaries from Supabase */}
                    <SelectItem value="1">John Doe</SelectItem>
                    <SelectItem value="2">Jane Smith</SelectItem>
                    <SelectItem value="3">Michael Johnson</SelectItem>
                  </SelectContent>
                </Select>
                {errors.beneficiary_id && (
                  <p className="text-sm text-destructive">{errors.beneficiary_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_type" className="text-foreground">
                  Media Type
                </Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value) => handleInputChange("media_type", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Only</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">
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

              <ImageUpload
                value={formData.media_url}
                onChange={(value) => handleInputChange("media_url", value)}
                label="Media URL"
                bucket="public-media"
                folder="testimonials"
                maxSize={50 * 1024 * 1024}
                accept="image/*,video/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
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
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={loading}
              />
              <Label htmlFor="featured" className="text-foreground cursor-pointer">
                Featured Testimonial
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-linear-to-r from-maroon-500 to-maroon-600 text-white hover:from-maroon-600 hover:to-maroon-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
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
