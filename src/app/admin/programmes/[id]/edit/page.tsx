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

        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('programmes')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single();
        // if (error) throw error;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual data from Supabase
        const mockProgramme: Programme = {
          id: params.id as string,
          title: "Scholarship Programme",
          slug: "scholarship-programme",
          description: "A comprehensive scholarship programme for deserving students.",
          image: "https://example.com/image.jpg",
          status: "published",
          featured: true,
        };

        setProgramme(mockProgramme);
        setFormData({
          title: mockProgramme.title,
          slug: mockProgramme.slug,
          description: mockProgramme.description,
          image: mockProgramme.image || "",
          status: mockProgramme.status,
          featured: mockProgramme.featured,
        });
      } catch (error) {
        console.error("Error loading programme:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load programme",
        });
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

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('programmes')
      //   .update({
      //     title: formData.title,
      //     slug: formData.slug,
      //     description: formData.description,
      //     image: formData.image,
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
        description: "Programme updated successfully",
      });

      router.push("/admin/programmes");
    } catch (error) {
      console.error("Error updating programme:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update programme",
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
    return <LoadingState message="Loading programme..." />;
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
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Edit Programme</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Update programme information</p>
        </div>
      </div>

      <Card className="border-[#e9ddd3] bg-[#fffdf8]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816]">
            Programme Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="text-[#2d1816]">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter programme title"
                  className={`border-[#e9ddd3] ${errors.title ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug" className="text-[#2d1816]">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="programme-slug"
                  className={`border-[#e9ddd3] ${errors.slug ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
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

              <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#2d1816]">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter programme description..."
                rows={6}
                className={`border-[#e9ddd3] resize-none ${errors.description ? "border-red-500" : ""}`}
                disabled={submitting}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
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
                Featured Programme
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
