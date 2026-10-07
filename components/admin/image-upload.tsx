"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  bucket?: "public-images" | "public-media" | "private-documents";
  folder?: string;
  maxSize?: number; // in bytes
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  bucket = "public-images",
  folder = "uploads",
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = "image/*",
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${maxSize / 1024 / 1024}MB`,
      });
      return;
    }

    setUploading(true);

    try {
      // TODO: Implement Supabase storage upload
      // const { data, error } = await supabase.storage
      //   .from(bucket)
      //   .upload(`${folder}/${Date.now()}-${file.name}`, file);

      // if (error) throw error;

      // const { data: { publicUrl } } = supabase.storage
      //   .from(bucket)
      //   .getPublicUrl(data.path);

      // onChange(publicUrl);

      // For now, simulate upload with local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Upload successful",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload image",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {value ? (
        <div className="relative group">
          <div className="w-full h-48 rounded-lg overflow-hidden border border-[#e9ddd3] bg-[#fffdf8]">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#e9ddd3] rounded-lg p-8 text-center hover:border-[#f8c84d] transition-colors">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[#aa322b]" />
          <p className="text-sm text-[#2d1816]/60 mb-4">
            Upload an image or enter a URL below
          </p>
          <div className="flex gap-3 justify-center">
            <label className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload File"}
                </span>
              </Button>
              <input
                type="file"
                accept={accept}
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-[#2d1816]/60">Or paste URL:</span>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="border-[#e9ddd3] flex-1"
        />
      </div>
    </div>
  );
}
