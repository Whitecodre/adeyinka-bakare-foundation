"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Edit, Trash2, BookOpen } from "lucide-react";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-success-soft text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "archived":
        return "bg-destructive/10 text-red-800 border-destructive/30";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <LoadingState message="Loading programmes..." />;
  }

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
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <Input
                placeholder="Search programmes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
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
                    <TableRow className="border-border">
                      <TableHead className="text-foreground font-semibold">Title</TableHead>
                      <TableHead className="text-foreground font-semibold">Slug</TableHead>
                      <TableHead className="text-foreground font-semibold">Description</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.map((programme) => (
                      <TableRow key={programme.id} className="border-border hover:bg-muted">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {programme.featured && (
                              <Badge className="bg-gold-300 text-foreground border-gold-300">Featured</Badge>
                            )}
                            {programme.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{programme.slug}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
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
                                <Edit className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(programme.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
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
                  <Card key={programme.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gold-300/20 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-gold-300" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{programme.title}</h3>
                              {programme.featured && (
                                <Badge className="bg-gold-300 text-foreground border-gold-300 text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Slug:</span>
                              <span className="text-foreground">{programme.slug}</span>
                            </div>
                            <div className="text-muted-foreground truncate">
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
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(programme.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
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
