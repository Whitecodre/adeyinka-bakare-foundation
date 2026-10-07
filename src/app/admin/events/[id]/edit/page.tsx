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

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string;
  image?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [event, setEvent] = useState<Event | null>(null);

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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('events')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single();
        // if (error) throw error;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual data from Supabase
        const mockEvent: Event = {
          id: params.id as string,
          title: "Annual Fellowship Dinner",
          slug: "annual-fellowship-dinner",
          description: "Join us for our annual fellowship dinner celebration.",
          location: "Main Hall, Campus",
          start_at: "2024-12-15T18:00",
          end_at: "2024-12-15T22:00",
          image: "https://example.com/image.jpg",
          status: "published",
          featured: true,
        };

        setEvent(mockEvent);
        setFormData({
          title: mockEvent.title,
          slug: mockEvent.slug,
          description: mockEvent.description,
          location: mockEvent.location,
          start_at: mockEvent.start_at,
          end_at: mockEvent.end_at,
          image: mockEvent.image || "",
          status: mockEvent.status,
          featured: mockEvent.featured,
        });
      } catch (error) {
        console.error("Error loading event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
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
      setSubmitting(true);

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('events')
      //   .update({
      //     title: formData.title,
      //     slug: formData.slug,
      //     description: formData.description,
      //     location: formData.location,
      //     start_at: formData.start_at,
      //     end_at: formData.end_at,
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
        description: "Event updated successfully",
      });

      router.push("/admin/events");
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event",
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
    return <LoadingState message="Loading event..." />;
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
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Edit Event</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Update event information</p>
        </div>
      </div>

      <Card className="border-[#e9ddd3] bg-[#fffdf8]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816]">
            Event Information
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
                  placeholder="Enter event title"
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
                  placeholder="event-slug"
                  className={`border-[#e9ddd3] ${errors.slug ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#2d1816]">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Main Hall, Campus"
                  className={`border-[#e9ddd3] ${errors.location ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
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
                <Label htmlFor="start_at" className="text-[#2d1816]">
                  Start Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start_at"
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) => handleInputChange("start_at", e.target.value)}
                  className={`border-[#e9ddd3] ${errors.start_at ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {errors.start_at && (
                  <p className="text-sm text-red-500">{errors.start_at}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_at" className="text-[#2d1816]">
                  End Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end_at"
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) => handleInputChange("end_at", e.target.value)}
                  className={`border-[#e9ddd3] ${errors.end_at ? "border-red-500" : ""}`}
                  disabled={submitting}
                />
                {errors.end_at && (
                  <p className="text-sm text-red-500">{errors.end_at}</p>
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

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#2d1816]">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter event description..."
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
                Featured Event
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
                  "Update Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
