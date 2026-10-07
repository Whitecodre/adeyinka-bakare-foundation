"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, FileText } from "lucide-react";
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
    return <LoadingState message="Loading contents..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Contents</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage website content</p>
        </div>
        <Button onClick={() => router.push("/admin/contents/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Contents ({filteredContents.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search contents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContents.length === 0 ? (
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e9ddd3]">
                      <TableHead className="text-[#2d1816] font-semibold">Title</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Key</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Content</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Status</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContents.map((item) => (
                      <TableRow key={item.id} className="border-[#e9ddd3] hover:bg-[#e9ddd3]/30">
                        <TableCell className="font-medium text-[#2d1816]">
                          {item.title}
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">
                          <code className="text-xs bg-[#e9ddd3] px-2 py-1 rounded">{item.key}</code>
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60 max-w-xs truncate">
                          {item.content || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)} variant="outline">
                            {item.status}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/contents/${item.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(item.id)}
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
                {filteredContents.map((item) => (
                  <Card key={item.id} className="border-[#e9ddd3]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#f8c84d]/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#f8c84d]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2d1816]">{item.title}</h3>
                              <code className="text-xs bg-[#e9ddd3] px-2 py-1 rounded text-[#2d1816]/60">{item.key}</code>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="text-[#2d1816]/60 truncate">
                              {item.content || "No content"}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/contents/${item.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Badge className={getStatusColor(item.status)} variant="outline">
                          {item.status}
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
        title="Delete Content?"
        description="This action cannot be undone. This will permanently delete the content from the database."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
