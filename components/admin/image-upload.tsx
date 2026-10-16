"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, FileText, Music, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getBucketForResource } from "@/lib/storage/paths";
import { cn } from "@/lib/utils";

export type UploadResource =
  | "media"
  | "news"
  | "programmes"
  | "events"
  | "testimonials"
  | "content"
  | "members"
  | "beneficiaries"
  | "social-links"
  | "footer"
  | "settings"
  | "logo";

export type UploadedFile = {
  path: string;
  url: string;
  bucket: string;
  filename: string;
  size: number;
  mimeType: string;
};

interface ImageUploadProps {
  /** A public URL or storage path used for the current preview. */
  value: string;
  onChange: (value: string) => void;
  /** Called with full upload metadata after a successful upload. */
  onUploadComplete?: (file: UploadedFile) => void;
  /** Legacy callback kept for callers that only need basic metadata. */
  onFileMetadata?: (filename: string, size: number, mimeType: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  label?: string;
  /** Logical resource, used to pick the correct Supabase bucket. */
  resource?: UploadResource;
  /** Manual override; takes priority over `resource` when provided. */
  bucket?: string;
  /** Folder inside the bucket (defaults to the media type folder). */
  folder?: string;
  maxSize?: number;
  accept?: string;
  /** When true, hides the external-URL input. */
  hideUrlInput?: boolean;
  className?: string;
}

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|avi|mkv)$/i;
const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|flac)$/i;

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

function previewKindFromUrl(url: string): "image" | "video" | "audio" | "document" | "unknown" {
  if (!url) return "unknown";
  if (IMAGE_EXT.test(url)) return "image";
  if (VIDEO_EXT.test(url)) return "video";
  if (AUDIO_EXT.test(url)) return "audio";
  return "document";
}

function detectTypeFromMime(mime: string): "image" | "video" | "audio" | "document" | "other" {
  if (!mime) return "other";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf" || mime.includes("msword") || mime.includes("officedocument") || mime.includes("ms-excel") || mime.includes("spreadsheet")) return "document";
  return "other";
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** A readable file name for a storage URL, so the long link is never shown. */
function fileNameOf(url: string): string {
  try {
    const last = new URL(url, "http://local").pathname.split("/").filter(Boolean).pop() ?? "";
    return decodeURIComponent(last) || "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}

export function ImageUpload({
  value,
  onChange,
  onUploadComplete,
  onFileMetadata,
  onUploadingChange,
  label = "File",
  resource = "media",
  bucket,
  folder,
  maxSize = 50 * 1024 * 1024,
  accept = "image/*,video/*,audio/*,application/pdf",
  hideUrlInput = false,
  className,
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resolvedBucket = bucket ?? getBucketForResource(resource);
  const resolvedFolder = folder ?? (resource === "media" ? "uploads" : resource);

  // Keep the preview URL in sync with the controlled `value`.
  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  // Best-effort preview when the supplied value is a bare storage path
  // (no scheme) — build a Supabase public URL using the resolved bucket.
  useEffect(() => {
    if (!value || isHttpUrl(value)) return;
    const guess = `${window.location.origin}/storage/v1/object/public/${resolvedBucket}/${value.replace(/^\/+/, "")}`;
    setPreviewUrl(guess);
  }, [value, resolvedBucket]);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  async function uploadFile(file: File) {
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${formatBytes(maxSize)}.`,
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      // Animate progress while the request is in flight (Supabase storage
      // doesn't expose a real progress event over the REST API).
      let p = 10;
      const tick = setInterval(() => {
        p = Math.min(p + 10, 90);
        setProgress(p);
      }, 180);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", detectTypeFromMime(file.type));
      fd.append("bucket", resolvedBucket);
      fd.append("resource", resource);
      if (resolvedFolder) fd.append("folder", resolvedFolder);

      const res = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        body: fd,
      });
      clearInterval(tick);

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Upload failed");
      }

      setProgress(100);
      const data = json.data as { path: string; url: string; bucket: string };
      const uploaded: UploadedFile = {
        path: data.path,
        url: data.url,
        bucket: data.bucket,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      };

      onChange(data.url);
      setPreviewUrl(data.url);
      onUploadComplete?.(uploaded);
      onFileMetadata?.(uploaded.filename, uploaded.size, uploaded.mimeType);

      toast({
        title: "Upload complete",
        description: `${file.name} uploaded successfully.`,
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload file",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function clearValue() {
    onChange("");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const kind = previewKindFromUrl(previewUrl || "");

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">{label}</Label>

      {previewUrl ? (
        <Preview previewUrl={previewUrl} kind={kind} onClear={clearValue} uploading={uploading} progress={progress} />
      ) : (
        <Dropzone
          accept={accept}
          uploading={uploading}
          progress={progress}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={onDrop}
          onFileChange={onFileChange}
          fileInputRef={fileInputRef}
          maxSize={maxSize}
          resource={resource}
        />
      )}

      {/* The raw link is only offered while nothing is set; once a file is chosen it stays hidden. */}
      {!hideUrlInput && !value && (
        <div className="flex items-center gap-2">
          <Link2 className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">Or paste a URL:</span>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="h-9 flex-1"
          />
        </div>
      )}

      {uploading && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-gradient-to-r from-maroon-500 to-maroon-700 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function Dropzone({
  accept,
  uploading,
  progress,
  dragOver,
  setDragOver,
  onDrop,
  onFileChange,
  fileInputRef,
  maxSize,
  resource,
}: {
  accept: string;
  uploading: boolean;
  progress: number;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  maxSize: number;
  resource: string;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
        dragOver && "border-maroon-500 bg-maroon-50",
        uploading && "pointer-events-none opacity-70"
      )}
    >
      <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {uploading ? `Uploading… ${progress}%` : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-muted-foreground">
          {resource} • up to {formatBytes(maxSize)}
        </p>
      </div>
      <label className="cursor-pointer">
        <Button type="button" variant="outline" size="sm" disabled={uploading} className="border-border" asChild>
          <span>
            <Upload className="size-4" />
            Choose file
          </span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}

function Preview({
  previewUrl,
  kind,
  onClear,
  uploading,
  progress,
}: {
  previewUrl: string;
  kind: ReturnType<typeof previewKindFromUrl>;
  onClear: () => void;
  uploading: boolean;
  progress: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-video w-full bg-muted">
        {kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-full w-full object-contain" />
        ) : kind === "video" ? (
          <video src={previewUrl} controls className="h-full w-full object-contain" />
        ) : kind === "audio" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <Music className="size-10 text-primary" />
            <audio src={previewUrl} controls className="w-full max-w-md" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            {kind === "unknown" ? <ImageIcon className="size-10 text-muted-foreground" /> : <FileText className="size-10 text-primary" />}
            <p className="line-clamp-2 max-w-md text-xs text-muted-foreground break-all">{fileNameOf(previewUrl)}</p>
            <a href={previewUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-maroon-600 hover:underline">
              Open in new tab
            </a>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 text-sm font-medium text-white">
            Uploading… {progress}%
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onClear}
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        aria-label="Remove file"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
