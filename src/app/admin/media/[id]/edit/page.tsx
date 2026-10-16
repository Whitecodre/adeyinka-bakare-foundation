"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MediaForm } from "@/components/admin/forms/media-form";
import { LoadingState } from "@/components/admin/loading-state";

export default function EditMediaPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const res = await fetch(`/api/admin/media/${params.id}`);
        const result = await res.json();

        if (result.success) {
          setInitialData({
            ...result.data,
            previewUrl: result.data.public_url || result.data.storage_path,
          });
        } else {
          throw new Error(result.error || "Failed to load media");
        }
      } catch (error) {
        console.error("Error loading media:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [params.id]);

  if (loading) {
    return <LoadingState message="Loading media..." />;
  }

  return <MediaForm mode="edit" initial={initialData || undefined} />;
}
