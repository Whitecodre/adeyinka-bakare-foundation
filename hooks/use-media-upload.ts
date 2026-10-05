import { useState } from "react";
import { uploadFile } from "@/lib/storage/upload";
import type { MediaType } from "@/lib/types/domain.types";

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, type: MediaType) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(50);
      const result = await uploadFile(file, type);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { upload, uploading, progress, error };
}
