"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  FileType,
  Image as ImageIcon,
  Music,
  Save,
  Video as VideoIcon,
} from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUpload, type UploadedFile } from "@/components/admin/image-upload";
import { useToast } from "@/hooks/use-toast";

export type MediaType = "image" | "video" | "audio" | "document" | "other";

export type MediaFormValues = {
  filename: string;
  storage_path: string;
  type: MediaType;
  mime_type?: string;
  size_bytes?: number;
  previewUrl?: string;
};

function detectType(mime?: string, fallback: MediaType = "other"): MediaType {
  if (!mime) return fallback;
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    mime === "application/pdf" ||
    mime.includes("msword") ||
    mime.includes("officedocument") ||
    mime.includes("ms-excel") ||
    mime.includes("spreadsheet")
  ) {
    return "document";
  }
  return fallback === "other" ? "other" : fallback;
}

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function typeIcon(type: MediaType) {
  switch (type) {
    case "image":
      return ImageIcon;
    case "video":
      return VideoIcon;
    case "audio":
      return Music;
    case "document":
      return FileText;
    default:
      return FileType;
  }
}

export function MediaForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: Partial<MediaFormValues>;
}) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [form, setForm] = useState<MediaFormValues>({
    filename: initial?.filename ?? "",
    storage_path: initial?.storage_path ?? "",
    type: (initial?.type as MediaType) ?? "image",
    mime_type: initial?.mime_type,
    size_bytes: initial?.size_bytes,
  });
  const [previewUrl, setPreviewUrl] = useState<string>(initial?.previewUrl ?? initial?.storage_path ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Keep the preview synced to the controlled form value if it changes
  // externally (e.g. on edit load) but the user hasn't uploaded a new file.
  useEffect(() => {
    if (!previewUrl && form.storage_path) setPreviewUrl(form.storage_path);
  }, [form.storage_path, previewUrl]);

  const Icon = useMemo(() => typeIcon(form.type), [form.type]);

  const handleUploadComplete = (file: UploadedFile) => {
    setForm((prev) => ({
      ...prev,
      storage_path: file.path,
      filename: prev.filename?.trim() ? prev.filename : file.filename,
      mime_type: file.mimeType,
      size_bytes: file.size,
      type: detectType(file.mimeType, prev.type),
    }));
    setPreviewUrl(file.url);
    setErrors((e) => ({ ...e, storage_path: "" }));
  };

  const handleUrlChange = (value: string) => {
    setPreviewUrl(value);
    // If this is a fresh external URL (not a Supabase storage path that was
    // uploaded), store it as storage_path so the row can be re-displayed.
    const looksLikeUpload = form.mime_type && form.size_bytes;
    if (!looksLikeUpload) {
      setForm((prev) => ({ ...prev, storage_path: value }));
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.filename.trim()) next.filename = "Filename is required";
    if (!form.storage_path) next.storage_path = "Please attach a file or paste a URL";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Please fix the errors",
        description: nextErrorDescription(errors),
      });
      return;
    }

    setSaving(true);
    try {
      const url = mode === "edit" ? `/api/admin/media/${params.id}` : "/api/admin/media";
      const method = mode === "edit" ? "PATCH" : "POST";
      const payload = {
        filename: form.filename.trim(),
        storage_path: form.storage_path,
        type: form.type,
        mime_type: form.mime_type,
        size_bytes: form.size_bytes,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save media");
      }

      toast({
        title: mode === "edit" ? "Media updated" : "Media uploaded",
        description: `${form.filename} has been ${mode === "edit" ? "updated" : "added to the library"}.`,
      });
      router.push("/admin/media");
      router.refresh();
    } catch (err: any) {
      console.error("Save error:", err);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: err?.message || "Could not save the media file",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "edit" ? "Edit media" : "Upload media"}
        subtitle={
          mode === "edit"
            ? "Update this media item's details"
            : "Add a new file to the ABF media library. Uploads are stored in Supabase Storage and can be linked anywhere on the site."
        }
        backHref="/admin/media"
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: file / dropzone */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">File</CardTitle>
                <CardDescription>Drop a file or paste a URL.</CardDescription>
              </div>
              {form.type && (
                <Badge variant="muted" className="gap-1.5">
                  <Icon className="size-3.5" />
                  {form.type}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <ImageUpload
              resource="media"
              value={previewUrl}
              onChange={handleUrlChange}
              onUploadComplete={handleUploadComplete}
              onUploadingChange={setUploading}
              label="File"
              maxSize={50 * 1024 * 1024}
              accept="image/*,video/*,audio/*,application/pdf"
            />
            {errors.storage_path && (
              <p className="text-xs text-destructive">{errors.storage_path}</p>
            )}
          </CardContent>
        </Card>

        {/* Right: details */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-semibold text-foreground">Details</CardTitle>
              <CardDescription>What the file is and how it should be classified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={form.filename}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, filename: e.target.value }));
                    if (errors.filename) setErrors((prev) => ({ ...prev, filename: "" }));
                  }}
                  placeholder="e.g. fellowship-award-2026.jpg"
                  aria-invalid={!!errors.filename}
                />
                {errors.filename && <p className="text-xs text-destructive">{errors.filename}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, type: v as MediaType }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="mime">MIME</Label>
                  <Input
                    id="mime"
                    value={form.mime_type ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, mime_type: e.target.value }))}
                    placeholder="image/jpeg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" value={formatBytes(form.size_bytes)} readOnly className="bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-semibold text-foreground">Storage</CardTitle>
              <CardDescription>Path inside the Supabase bucket.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="break-all rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                {form.storage_path || "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="lg:col-span-2">
          <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving || uploading}
            >
              <ArrowLeft className="size-4" />
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={saving || uploading}>
              {uploading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Uploading…
                </>
              ) : saving ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {mode === "edit" ? "Save changes" : "Upload media"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function nextErrorDescription(errs: Record<string, string>): string {
  const list = Object.values(errs).filter(Boolean);
  if (!list.length) return "";
  return list[0];
}
