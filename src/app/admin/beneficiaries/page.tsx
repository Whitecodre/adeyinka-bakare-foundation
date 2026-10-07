"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, GraduationCap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";

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
    // TODO: Replace with actual Supabase query
    const loadBeneficiaries = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('beneficiaries').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBeneficiaries([]);
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
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('beneficiaries').delete().eq('id', id)
      // if (error) throw error
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "archived":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <LoadingState message="Loading beneficiaries..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Beneficiaries</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage fellowship beneficiaries</p>
        </div>
        <Button onClick={() => router.push("/admin/beneficiaries/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Beneficiary
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Beneficiaries ({filteredBeneficiaries.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search beneficiaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBeneficiaries.length === 0 ? (
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e9ddd3]">
                      <TableHead className="text-[#2d1816] font-semibold">Name</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Department</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Level</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Session</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Programme</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Status</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id} className="border-[#e9ddd3] hover:bg-[#e9ddd3]/30">
                        <TableCell className="font-medium text-[#2d1816]">
                          <div className="flex items-center gap-2">
                            {beneficiary.featured && (
                              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Featured</Badge>
                            )}
                            {beneficiary.full_name}
                          </div>
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">{beneficiary.department || "-"}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{beneficiary.level || "-"}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{beneficiary.session || "-"}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{beneficiary.programme || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(beneficiary.status)} variant="outline">
                            {beneficiary.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin/beneficiaries/${beneficiary.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/beneficiaries/${beneficiary.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(beneficiary.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredBeneficiaries.map((beneficiary) => (
                  <Card key={beneficiary.id} className="border-[#e9ddd3]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#f8c84d]/20 flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-[#f8c84d]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2d1816]">{beneficiary.full_name}</h3>
                              {beneficiary.featured && (
                                <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d] text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Department:</span>
                              <span className="text-[#2d1816]">{beneficiary.department || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Level:</span>
                              <span className="text-[#2d1816]">{beneficiary.level || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Programme:</span>
                              <span className="text-[#2d1816]">{beneficiary.programme || "-"}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/beneficiaries/${beneficiary.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/beneficiaries/${beneficiary.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(beneficiary.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Badge className={getStatusColor(beneficiary.status)} variant="outline">
                          {beneficiary.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
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
        cancelLabel="Cancel"
      />
    </div>
  );
}
