"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { LoadingState } from "@/components/admin/loading-state";
import { ImageUpload } from "@/components/admin/image-upload";

interface Testimonial {
  id: string;
  beneficiary_id: string;
  content: string;
  media_url?: string;
  media_type: "text" | "image" | "video";
  status: "draft" | "published" | "archived";
  featured: boolean;
}

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    beneficiary_id: "",
    content: "",
    media_url: "",
    media_type: "text",
    status: "draft",
    featured: false,
  });

  useEffect(() => {
    const loadTestimonial = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('testimonials')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single();
        // if (error) throw error;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual data from Supabase
        const mockTestimonial: Testimonial = {
          id: params.id as string,
          beneficiary_id: "1",
          content: "This fellowship has truly transformed my academic journey. The support and guidance I received have been invaluable.",
          media_url: "https://example.com/media.jpg",
          media_type: "image",
          status: "published",
          featured: true,
        };

        setTestimonial(mockTestimonial);
        setFormData({
          beneficiary_id: mockTestimonial.beneficiary_id,
          content: mockTestimonial.content,
          media_url: mockTestimonial.media_url || "",
          media_type: mockTestimonial.media_type,
          status: mockTestimonial.status,
          featured: mockTestimonial.featured,
        });
      } catch (error) {
        console.error("Error loading testimonial:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load testimonial",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTestimonial();
  }, [params.id, toast]);

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
      setSubmitting(true);

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('testimonials')
      //   .update({
      //     beneficiary_id: formData.beneficiary_id,
      //     content: formData.content,
      //     media_url: formData.media_url,
      //     media_type: formData.media_type,
      //     status: formData.status,
      //     featured: formData.featured,
      //   })
      //   .eq('id', params.id)
      //   .select()
      //   .single();
      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });

      router.push("/admin/testimonials");
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update testimonial",
      });
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
    return <LoadingState message="Loading testimonial..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-[#e9ddd3]/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Edit Testimonial</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Update testimonial information</p>
        </div>
      </div>

      <Card className="border-[#e9ddd3] bg-[#fffdf8]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816]">
            Testimonial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="beneficiary_id" className="text-[#2d1816]">
                  Beneficiary <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.beneficiary_id}
                  onValueChange={(value) => handleInputChange("beneficiary_id", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className={`border-[#e9ddd3] ${errors.beneficiary_id ? "border-red-500" : ""}`}>
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
                  <p className="text-sm text-red-500">{errors.beneficiary_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_type" className="text-[#2d1816]">
                  Media Type
                </Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value) => handleInputChange("media_type", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className="border-[#e9ddd3]">
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
                <Label htmlFor="status" className="text-[#2d1816]">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className="border-[#e9ddd3]">
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
              <Label htmlFor="content" className="text-[#2d1816]">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter testimonial content..."
                rows={6}
                className={`border-[#e9ddd3] resize-none ${errors.content ? "border-red-500" : ""}`}
                disabled={submitting}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#e9ddd3] rounded-lg bg-[#fffdf8]">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={submitting}
              />
              <Label htmlFor="featured" className="text-[#2d1816] cursor-pointer">
                Featured Testimonial
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#e9ddd3]">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#aa322b] to-[#922821] text-white hover:from-[#922821] hover:to-[#7a221b]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Testimonial"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
