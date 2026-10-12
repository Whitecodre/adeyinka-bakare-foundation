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

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  featured: boolean;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [news, setNews] = useState<News | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    status: "draft",
    published_at: "",
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
    const loadNews = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('news')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single();
        // if (error) throw error;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual data from Supabase
        const mockNews: News = {
          id: params.id as string,
          title: "Fellowship Achieves Milestone",
          slug: "fellowship-achieves-milestone",
          excerpt: "Our fellowship has reached a significant milestone in its mission.",
          content: "Full article content goes here...",
          image: "https://example.com/image.jpg",
          status: "published",
          published_at: "2024-01-15T10:00",
          featured: true,
        };

        setNews(mockNews);
        setFormData({
          title: mockNews.title,
          slug: mockNews.slug,
          excerpt: mockNews.excerpt,
          content: mockNews.content,
          image: mockNews.image || "",
          status: mockNews.status,
          published_at: mockNews.published_at || "",
          featured: mockNews.featured,
        });
      } catch (error) {
        console.error("Error loading news article:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load news article",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [params.id, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
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
      //   .from('news')
      //   .update({
      //     title: formData.title,
      //     slug: formData.slug,
      //     excerpt: formData.excerpt,
      //     content: formData.content,
      //     image: formData.image,
      //     status: formData.status,
      //     published_at: formData.published_at,
      //     featured: formData.featured,
      //   })
      //   .eq('id', params.id)
      //   .select()
      //   .single();
      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "News article updated successfully",
      });

      router.push("/admin/news");
    } catch (error) {
      console.error("Error updating news article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update news article",
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
    return <LoadingState message="Loading news article..." />;
  }

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
          <h1 className="text-2xl font-bold text-foreground m-0">Edit News Article</h1>
          <p className="text-muted-foreground mt-1 text-sm">Update article information</p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Article Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="text-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter article title"
                  className={`border-border ${errors.title ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug" className="text-foreground">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="article-slug"
                  className={`border-border ${errors.slug ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">
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

              <div className="space-y-2">
                <Label htmlFor="published_at" className="text-foreground">
                  Published Date
                </Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => handleInputChange("published_at", e.target.value)}
                  className="border-border"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => handleInputChange("image", value)}
                  label="Image URL"
                  bucket="public-images"
                  folder="news"
                  maxSize={10 * 1024 * 1024}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-foreground">
                Excerpt <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Enter a brief excerpt..."
                rows={3}
                className={`border-border resize-none ${errors.excerpt ? "border-destructive" : ""}`}
                disabled={submitting}
              />
              {errors.excerpt && (
                <p className="text-sm text-destructive">{errors.excerpt}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter article content..."
                rows={10}
                className={`border-border resize-none ${errors.content ? "border-destructive" : ""}`}
                disabled={submitting}
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
                disabled={submitting}
              />
              <Label htmlFor="featured" className="text-foreground cursor-pointer">
                Featured Article
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-linear-to-r from-maroon-500 to-maroon-600 text-white hover:from-maroon-600 hover:to-maroon-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Article"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
