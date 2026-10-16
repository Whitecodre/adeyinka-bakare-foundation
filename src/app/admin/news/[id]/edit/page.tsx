"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NewsForm } from "@/components/admin/forms/news-form";
import { LoadingState } from "@/components/admin/loading-state";

export default function EditNewsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetch(`/api/admin/news/${params.id}`);
        const result = await res.json();

        if (result.success) {
          setInitialData({
            ...result.data,
            id: result.data.id,
            title: result.data.title,
            slug: result.data.slug,
            content: result.data.content,
            excerpt: result.data.excerpt || "",
            status: result.data.status,
            featured: result.data.featured || false,
            coverImage: result.data.image || "",
          });
        } else {
          throw new Error(result.error || "Failed to load news article");
        }
      } catch (error) {
        console.error("Error loading news article:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [params.id]);

  if (loading) {
    return <LoadingState message="Loading news article..." />;
  }

  return <NewsForm mode="edit" initial={initialData || undefined} />;
}
