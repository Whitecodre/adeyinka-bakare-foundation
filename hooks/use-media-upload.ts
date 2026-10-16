"use client";
import { useState } from "react";
import type { MediaType } from "@/lib/types/domain.types";
import { getBucketForResource } from "@/lib/storage/paths";

export function useMediaUpload(resource: string = "media") {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const bucket = getBucketForResource(resource);

  const upload = async (file: File, type: MediaType) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      setProgress(30);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      fd.append("bucket", bucket);
      // Prefer server route that handles auth + bucket mapping + owner prefix
      const res = await fetch("/api/admin/media/upload-url", { method: "POST", body: fd });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Upload failed");
      setProgress(100);
      return j.data as { path: string; url: string; bucket: string };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { upload, uploading, progress, error, bucket };
}
