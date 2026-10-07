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

export default function NewContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    content: "",
    imageUrl: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Save to Supabase
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      router.push("/admin/contents");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Content"
        subtitle="Create new CMS content"
        backHref="/admin/contents"
      />

      <Card className="p-6 bg-[#fffdf8] border-[#e9ddd3]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="key">Content Key</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g., hero_section, about_us"
              required
            />
            <p className="text-xs text-[#2d1816]/60">
              Unique identifier for this content block
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
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
          <div className="space-y-2">
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
              <p className="text-xs text-[#2d1816]/60">
                Show this content on the website
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              {loading ? "Creating..." : "Create Content"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
