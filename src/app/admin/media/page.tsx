"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { File, Video, FileText, Download, Image as ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ResourceList } from "@/components/admin/resource-list";

import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Media {
  id: string;
  filename: string;
  storage_path: string;
  type: "image" | "video" | "document" | "other";
  mime_type?: string;
  size_bytes: number;
  uploaded_by?: string;
  created_at: string;
}

export default function MediaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/media");
        const result = await response.json();

        if (result.success) {
          setMedia(result.data);
        } else {
          throw new Error(result.error || "Failed to load media");
        }
      } catch (error) {
        console.error("Error loading media:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load media",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [toast]);

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.storage_path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setMedia(media.filter((m) => m.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Media file deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete media file",
      });
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-3 h-3" />;
      case "video":
        return <Video className="w-3 h-3" />;
      case "document":
        return <FileText className="w-3 h-3" />;
      default:
        return <File className="w-3 h-3" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Media"
        subtitle="Manage media files"
        actions={[{ label: "Upload Media", onClick: () => router.push("/admin/media/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Media ({filteredMedia.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search media..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredMedia.length === 0 ? (
            <EmptyState
              title="No media found"
              description={searchQuery ? "Try a different search term" : "Get started by uploading your first media file"}
              action={
                !searchQuery ? {
                  label: "Upload Media",
                  onClick: () => router.push("/admin/media/new")
                } : undefined
              }
              icon={File}
            />
          ) : (
            <ResourceList
              rows={filteredMedia}
              getKey={(r) => r.id}
              getName={(r) => r.filename}
              icon={File}
              leading={(r) => (<div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">{getTypeIcon(r.type)}</div>)}
              columns={[
                { header: "Filename", cell: (r) => <span className="font-medium text-foreground">{r.filename}</span> },
                { header: "Type", cell: (r) => (<Badge variant="outline" className="gap-1 capitalize">{getTypeIcon(r.type)}{r.type}</Badge>) },
                { header: "MIME Type", cell: (r) => r.mime_type || "-", className: "text-muted-foreground" },
                { header: "Size", cell: (r) => formatFileSize(r.size_bytes), className: "text-muted-foreground" },
                { header: "Uploaded By", cell: (r) => r.uploaded_by || "-", className: "text-muted-foreground" },
              ]}
              title={(r) => r.filename}
              badges={(r) => (<><Badge variant="outline" className="gap-1 capitalize">{getTypeIcon(r.type)}{r.type}</Badge></>)}
              meta={(r) => (<>
                  <p>{formatFileSize(r.size_bytes)} · {r.mime_type || "-"}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/media/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
              extra={(r) => [{ label: "Download", icon: Download, onSelect: () => window.open(r.storage_path, "_blank") }]}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Media File?"
        description="This action cannot be undone. This will permanently delete the media file from the database and storage."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
