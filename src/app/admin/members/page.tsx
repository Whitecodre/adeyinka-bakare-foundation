"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Member {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  level?: string;
  session?: string;
  status: "active" | "inactive" | "graduated" | "archived";
  joined_at?: string;
  created_at: string;
}

export default function MembersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/members");
        const result = await response.json();

        if (result.success) {
          setMembers(result.data);
        } else {
          throw new Error(result.error || "Failed to load members");
        }
      } catch (error) {
        console.error("Error loading members:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load members",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [toast]);

  const filteredMembers = members.filter((member) =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setMembers(members.filter((m) => m.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete member",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Members"
        subtitle="Manage fellowship members"
        actions={[{ label: "Add Member", onClick: () => router.push("/admin/members/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Members ({filteredMembers.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search members..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              title="No members found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first member"}
              action={
                !searchQuery ? {
                  label: "Add Member",
                  onClick: () => router.push("/admin/members/new")
                } : undefined
              }
            />
          ) : (
            <ResourceList
              rows={filteredMembers}
              getKey={(r) => r.id}
              getName={(r) => r.full_name}
              icon={Users}
              columns={[
                { header: "Name", cell: (r) => <span className="font-medium text-foreground">{r.full_name}</span> },
                { header: "Email", cell: (r) => r.email || "-", className: "text-muted-foreground" },
                { header: "Department", cell: (r) => r.department || "-", className: "text-muted-foreground" },
                { header: "Level", cell: (r) => r.level || "-", className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.full_name}
              badges={(r) => (<><StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p className="truncate">{r.email || "-"}</p>
                  <p>{[r.department, r.level].filter(Boolean).join(" · ") || "-"}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/members/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Member?"
        description="This action cannot be undone. This will permanently delete the member from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
