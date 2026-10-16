"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Newspaper } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge, FeaturedBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author_id?: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  featured: boolean;
  created_at: string;
}

export default function NewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/news");
        const result = await response.json();

        if (result.success) {
          setNews(result.data);
        } else {
          throw new Error(result.error || "Failed to load news");
        }
      } catch (error) {
        console.error("Error loading news:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load news",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [toast]);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setNews(news.filter((n) => n.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete news article",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="News"
        subtitle="Manage news articles"
        actions={[{ label: "Add News", onClick: () => router.push("/admin/news/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All News ({filteredNews.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search news..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredNews.length === 0 ? (
            <EmptyState
              title="No news found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first news article"}
              action={
                !searchQuery ? {
                  label: "Add News",
                  onClick: () => router.push("/admin/news/new")
                } : undefined
              }
              icon={Newspaper}
            />
          ) : (
            <ResourceList
              rows={filteredNews}
              getKey={(r) => r.id}
              getName={(r) => r.title}
              icon={Newspaper}
              columns={[
                { header: "Title", cell: (r) => (<div className="flex items-center gap-2 font-medium text-foreground">{r.featured && <FeaturedBadge />}{r.title}</div>) },
                { header: "Slug", cell: (r) => r.slug, className: "text-muted-foreground" },
                { header: "Excerpt", cell: (r) => r.excerpt || "-", className: "max-w-xs truncate text-muted-foreground" },
                { header: "Published", cell: (r) => r.published_at ? formatDate(r.published_at) : "-", className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.title}
              badges={(r) => (<>{r.featured && <FeaturedBadge />}<StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p className="line-clamp-2">{r.excerpt || "-"}</p>
                  <p>{r.published_at ? formatDate(r.published_at) : "Not published"}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/news/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete News Article?"
        description="This action cannot be undone. This will permanently delete the news article from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
