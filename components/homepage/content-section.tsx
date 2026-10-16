"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Content {
  id: string;
  key: string;
  title: string;
  content: string;
  image?: string;
  status: string;
}

export function ContentSection() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContents = async () => {
      try {
        const res = await fetch("/api/public/contents");
        const result = await res.json();

        if (result.success) {
          setContents(result.data);
        }
      } catch (error) {
        console.error("Error loading contents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (contents.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white/55 to-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {contents.map((content, index) => (
          <div key={content.id} className="mb-16 last:mb-0">
            <div className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}>
              {content.image && (
                <div className="w-full lg:w-1/2">
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
                    <img
                      src={content.image}
                      alt={content.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className={`w-full ${content.image ? "lg:w-1/2" : ""}`}>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                  {content.title}
                </h2>
                <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                  {content.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
