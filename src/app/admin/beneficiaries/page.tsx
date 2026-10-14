"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ResourceList } from "@/components/admin/resource-list";
import { StatusBadge, FeaturedBadge } from "@/components/admin/status-badge";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Beneficiary {
  id: string;
  full_name: string;
  department?: string;
  level?: string;
  session?: string;
  programme?: string;
  photo?: string;
  bio?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  created_at: string;
}

export default function AdminBeneficiariesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/beneficiaries");
        const result = await response.json();

        if (result.success) {
          setBeneficiaries(result.data);
        } else {
          throw new Error(result.error || "Failed to load beneficiaries");
        }
      } catch (error) {
        console.error("Error loading beneficiaries:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load beneficiaries",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, [toast]);

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiary.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiary.programme?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/beneficiaries/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Beneficiary deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete beneficiary",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Beneficiaries"
        subtitle="Manage fellowship beneficiaries"
        actions={[{ label: "Add Beneficiary", onClick: () => router.push("/admin/beneficiaries/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Beneficiaries ({filteredBeneficiaries.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search beneficiaries..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredBeneficiaries.length === 0 ? (
            <EmptyState
              title="No beneficiaries found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first beneficiary"}
              action={
                !searchQuery ? {
                  label: "Add Beneficiary",
                  onClick: () => router.push("/admin/beneficiaries/new")
                } : undefined
              }
              icon={GraduationCap}
            />
          ) : (
            <ResourceList
              rows={filteredBeneficiaries}
              getKey={(r) => r.id}
              getName={(r) => r.full_name}
              icon={GraduationCap}
              columns={[
                { header: "Name", cell: (r) => (<div className="flex items-center gap-2 font-medium text-foreground">{r.featured && <FeaturedBadge />}{r.full_name}</div>) },
                { header: "Department", cell: (r) => r.department || "-", className: "text-muted-foreground" },
                { header: "Level", cell: (r) => r.level || "-", className: "text-muted-foreground" },
                { header: "Session", cell: (r) => r.session || "-", className: "text-muted-foreground" },
                { header: "Programme", cell: (r) => r.programme || "-", className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
              title={(r) => r.full_name}
              badges={(r) => (<>{r.featured && <FeaturedBadge />}<StatusBadge status={r.status} /></>)}
              meta={(r) => (<>
                  <p>{[r.department, r.level].filter(Boolean).join(" · ") || "-"}</p>
                  <p>{[r.programme, r.session].filter(Boolean).join(" · ") || "-"}</p>
                </>)}
              onEdit={(r) => router.push(`/admin/beneficiaries/${r.id}/edit`)}
              onDelete={(r) => setDeleteConfirm(r.id)}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Beneficiary?"
        description="This action cannot be undone. This will permanently delete the beneficiary from the database."
        confirmLabel="Delete"
        destructive
        cancelLabel="Cancel"
      />
    </div>
  );
}
