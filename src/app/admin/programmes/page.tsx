"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, BookOpen } from "lucide-react";
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
    return <LoadingState message="Loading programmes..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Programmes</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage foundation programmes</p>
        </div>
        <Button onClick={() => router.push("/admin/programmes/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Programme
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Programmes ({filteredProgrammes.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search programmes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProgrammes.length === 0 ? (
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e9ddd3]">
                      <TableHead className="text-[#2d1816] font-semibold">Title</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Slug</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Description</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Status</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.map((programme) => (
                      <TableRow key={programme.id} className="border-[#e9ddd3] hover:bg-[#e9ddd3]/30">
                        <TableCell className="font-medium text-[#2d1816]">
                          <div className="flex items-center gap-2">
                            {programme.featured && (
                              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Featured</Badge>
                            )}
                            {programme.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">{programme.slug}</TableCell>
                        <TableCell className="text-[#2d1816]/60 max-w-xs truncate">
                          {programme.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(programme.status)} variant="outline">
                            {programme.status}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/programmes/${programme.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(programme.id)}
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
                {filteredProgrammes.map((programme) => (
                  <Card key={programme.id} className="border-[#e9ddd3]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#f8c84d]/20 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-[#f8c84d]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2d1816]">{programme.title}</h3>
                              {programme.featured && (
                                <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d] text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Slug:</span>
                              <span className="text-[#2d1816]">{programme.slug}</span>
                            </div>
                            <div className="text-[#2d1816]/60 truncate">
                              {programme.description || "No description"}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/programmes/${programme.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(programme.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Badge className={getStatusColor(programme.status)} variant="outline">
                          {programme.status}
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
        title="Delete Programme?"
        description="This action cannot be undone. This will permanently delete the programme from the database."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
