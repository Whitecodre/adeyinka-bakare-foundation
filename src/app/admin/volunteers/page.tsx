"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  level?: string;
  interest?: string;
  message?: string;
  status: "new" | "contacted" | "accepted" | "rejected" | "archived";
  created_at: string;
}

export default function VolunteersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/volunteers");
        const result = await response.json();

        if (result.success) {
          setVolunteers(result.data);
        } else {
          throw new Error(result.error || "Failed to load volunteers");
        }
      } catch (error) {
        console.error("Error loading volunteers:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load volunteers",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVolunteers();
  }, [toast]);

  const filteredVolunteers = volunteers.filter((volunteer) =>
    volunteer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.interest?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/volunteers/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setVolunteers(volunteers.filter((v) => v.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Volunteer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete volunteer",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Volunteers" subtitle="Manage volunteer applications" />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Volunteers ({filteredVolunteers.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search volunteers..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredVolunteers.length === 0 ? (
            <EmptyState
              title="No volunteers found"
              description={searchQuery ? "Try a different search term" : "Volunteer applications will appear here"}
              icon={UserPlus}
            />
          ) : (
            <ResourceList
              rows={filteredVolunteers}
              getKey={(r) => r.id}
              getName={(r) => r.full_name}
              icon={UserPlus}
              columns={[
                { header: "Name", cell: (r) => <span className="font-medium text-foreground">{r.full_name}</span> },
                { header: "Email", cell: (r) => r.email, className: "text-muted-foreground" },
                { header: "Phone", cell: (r) => r.phone || "-", className: "text-muted-foreground" },
                { header: "Department", cell: (r) => r.department || "-", className: "text-muted-foreground" },
                { header: "Interest", cell: (r) => r.interest || "-", className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.full_name}
              badges={(r) => (<><StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p className="truncate">{r.email}</p>
                  <p>{r.phone || "-"}</p>
                </>)}
              onDelete={(r) => setDeleteConfirm(r.id)}
              extra={(r) => [{ label: "View details", icon: Eye, onSelect: () => router.push(`/admin/volunteers/${r.id}`) }]}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Volunteer?"
        description="This action cannot be undone. This will permanently delete the volunteer application from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
