"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Content {
  id: string;
  key: string;
  title: string;
  content?: string;
  image?: string;
  status: "draft" | "published" | "archived";
  created_at: string;
}

export default function ContentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual Supabase query
    const loadContents = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('contents').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setContents([]);
      } catch (error) {
        console.error("Error loading contents:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load contents",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContents();
  }, [toast]);

  const filteredContents = contents.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('contents').delete().eq('id', id)
      // if (error) throw error
      
      setContents(contents.filter((c) => c.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete content",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Contents"
        subtitle="Manage website content"
        actions={[{ label: "Add Content", onClick: () => router.push("/admin/contents/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Contents ({filteredContents.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search contents..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredContents.length === 0 ? (
            <EmptyState
              title="No contents found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first content"}
              action={
                !searchQuery ? {
                  label: "Add Content",
                  onClick: () => router.push("/admin/contents/new")
                } : undefined
              }
              icon={FileText}
            />
          ) : (
            <ResourceList
              rows={filteredContents}
              getKey={(r) => r.id}
              getName={(r) => r.title}
              icon={FileText}
              columns={[
                { header: "Title", cell: (r) => <span className="font-medium text-foreground">{r.title}</span> },
                { header: "Key", cell: (r) => (<code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{r.key}</code>) },
                { header: "Content", cell: (r) => r.content || "-", className: "max-w-xs truncate text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.title}
              badges={(r) => (<><StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.key}</code></p>
                  <p className="line-clamp-2">{r.content || "-"}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/contents/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Content?"
        description="This action cannot be undone. This will permanently delete the content from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
