"use client";

import { ContentForm } from "@/components/admin/forms/content-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditContentPage() {
  const params = useParams();
  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`/api/admin/contents/${params.id}`);
        const result = await res.json();

        if (result.success) {
          setInitial({
            key: result.data.key,
            title: result.data.title,
            content: result.data.content,
            imageUrl: result.data.image || "",
            isActive: result.data.status === "published",
          });
        }
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <ContentForm mode="edit" initial={initial} />;
}
