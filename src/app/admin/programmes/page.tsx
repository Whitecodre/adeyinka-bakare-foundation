"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge, FeaturedBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Programme {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  created_at: string;
}

export default function ProgrammesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual Supabase query
    const loadProgrammes = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('programmes').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgrammes([]);
      } catch (error) {
        console.error("Error loading programmes:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load programmes",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProgrammes();
  }, [toast]);

  const filteredProgrammes = programmes.filter((programme) =>
    programme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    programme.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    programme.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('programmes').delete().eq('id', id)
      // if (error) throw error
      
      setProgrammes(programmes.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Programme deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting programme:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete programme",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Programmes"
        subtitle="Manage foundation programmes"
        actions={[{ label: "Add Programme", onClick: () => router.push("/admin/programmes/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Programmes ({filteredProgrammes.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search programmes..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredProgrammes.length === 0 ? (
            <EmptyState
              title="No programmes found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first programme"}
              action={
                !searchQuery ? {
                  label: "Add Programme",
                  onClick: () => router.push("/admin/programmes/new")
                } : undefined
              }
              icon={BookOpen}
            />
          ) : (
            <ResourceList
              rows={filteredProgrammes}
              getKey={(r) => r.id}
              getName={(r) => r.title}
              icon={BookOpen}
              columns={[
                { header: "Title", cell: (r) => (<div className="flex items-center gap-2 font-medium text-foreground">{r.featured && <FeaturedBadge />}{r.title}</div>) },
                { header: "Slug", cell: (r) => r.slug, className: "text-muted-foreground" },
                { header: "Description", cell: (r) => r.description || "-", className: "max-w-xs truncate text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.title}
              badges={(r) => (<>{r.featured && <FeaturedBadge />}<StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p className="line-clamp-2">{r.description || "-"}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/programmes/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Programme?"
        description="This action cannot be undone. This will permanently delete the programme from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
