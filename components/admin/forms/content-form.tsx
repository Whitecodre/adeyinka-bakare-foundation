"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/image-upload";

export type ContentFormValues = {
  key: string;
  title: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
};

export function ContentForm({ mode = "create", initial }: { mode?: "create" | "edit"; initial?: Partial<ContentFormValues> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContentFormValues>({
    key: "",
    title: "",
    content: "",
    imageUrl: "",
    isActive: true,
    ...initial,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Save to Supabase
      toast({
        title: "Success",
        description: mode === "edit" ? "Content updated successfully" : "Content created successfully",
      });
      router.push("/admin/contents");
    } catch (error) {
      toast({
        title: "Error",
        description: mode === "edit" ? "Failed to update content" : "Failed to create content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "edit" ? "Edit Content" : "New Content"}
        subtitle={mode === "edit" ? "Update this CMS content" : "Create new CMS content"}
        backHref="/admin/contents"
      />

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Key */}
          <div className="space-y-1.5">
            <Label htmlFor="key">Content Key</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g., hero_section, about_us"
              required
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier for this content block
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Content title"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Content body text"
              rows={6}
              required
            />
          </div>

          {/* Image URL */}
          <ImageUpload
            value={formData.imageUrl}
            onChange={(value) => setFormData({ ...formData, imageUrl: value })}
            label="Image URL"
            bucket="public-images"
            folder="content"
            maxSize={10 * 1024 * 1024}
            accept="image/*"
          />

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">
                Show this content on the website
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end [&>button]:h-11 [&>button]:w-full sm:[&>button]:h-10 sm:[&>button]:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>
            <Button variant="brand"
              type="submit"
              disabled={loading}
>
              {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Content"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
