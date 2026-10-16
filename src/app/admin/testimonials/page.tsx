"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Play, Image as ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge, FeaturedBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Testimonial {
  id: string;
  beneficiary_id?: string;
  content?: string;
  media_url?: string;
  media_type?: "image" | "video" | "none";
  featured: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/testimonials");
        const result = await response.json();

        if (result.success) {
          setTestimonials(result.data);
        } else {
          throw new Error(result.error || "Failed to load testimonials");
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load testimonials",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [toast]);

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setTestimonials(testimonials.filter((t) => t.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete testimonial",
      });
    }
  };

  const getMediaTypeIcon = (type?: string) => {
    switch (type) {
      case "video":
        return <Play className="w-3 h-3" />;
      case "image":
        return <ImageIcon className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Testimonials"
        subtitle="Manage beneficiary testimonials"
        actions={[{ label: "Add Testimonial", onClick: () => router.push("/admin/testimonials/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Testimonials ({filteredTestimonials.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search testimonials..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredTestimonials.length === 0 ? (
            <EmptyState
              title="No testimonials found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first testimonial"}
              action={
                !searchQuery ? {
                  label: "Add Testimonial",
                  onClick: () => router.push("/admin/testimonials/new")
                } : undefined
              }
              icon={MessageSquare}
            />
          ) : (
            <ResourceList
              rows={filteredTestimonials}
              getKey={(r) => r.id}
              getName={(r) => r.content?.slice(0, 40) || "testimonial"}
              icon={MessageSquare}
              columns={[
                { header: "Content", cell: (r) => (<div className="flex items-center gap-2 font-medium text-foreground">{r.featured && <FeaturedBadge />}<span className="max-w-xs truncate">{r.content || "No content"}</span></div>) },
                { header: "Media Type", cell: (r) => (<div className="flex items-center gap-1.5 text-muted-foreground">{getMediaTypeIcon(r.media_type)}<span className="capitalize">{r.media_type || "none"}</span></div>) },
                { header: "Beneficiary ID", cell: (r) => r.beneficiary_id || "-", className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={() => "Testimonial"}
              badges={(r) => (<>{r.featured && <FeaturedBadge />}<StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p className="line-clamp-2">{r.content || "No content"}</p>
                  <p className="flex items-center gap-1.5">{getMediaTypeIcon(r.media_type)}<span className="capitalize">{r.media_type || "none"}</span></p>
                </>)}
              onEdit={(r) => router.push(`/admin/testimonials/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Testimonial?"
        description="This action cannot be undone. This will permanently delete the testimonial from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
