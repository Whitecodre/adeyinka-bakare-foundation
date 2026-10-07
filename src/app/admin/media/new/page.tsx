"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewMediaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    altText: "",
    caption: "",
    type: "image",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Upload to Supabase storage and save to database
      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
      router.push("/admin/media");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Media"
        subtitle="Add new media files to the library"
        backHref="/admin/media"
      />

      <Card className="p-6 bg-[#fffdf8] border-[#e9ddd3]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>File</Label>
            <div className="border-2 border-dashed border-[#e9ddd3] rounded-lg p-8 text-center hover:border-[#f8c84d] transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-[#aa322b]" />
              <p className="text-sm text-[#2d1816]/60 mb-2">
                Drag and drop a file here, or click to select
              </p>
              <Input
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="max-w-xs mx-auto"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter media title"
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Event photos, Team photos"
            />
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="altText">Alt Text</Label>
            <Input
              id="altText"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              placeholder="Alternative text for accessibility"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Media caption or description"
              rows={3}
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
              {loading ? "Uploading..." : "Upload Media"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
