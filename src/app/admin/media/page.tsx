"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, File, Image as ImageIcon, Video, FileText, Download } from "lucide-react";
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
    // TODO: Replace with actual Supabase query
    const loadMedia = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('media').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMedia([]);
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
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('media').delete().eq('id', id)
      // if (error) throw error
      
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "video":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "document":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (loading) {
    return <LoadingState message="Loading media..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Media</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage media files</p>
        </div>
        <Button onClick={() => router.push("/admin/media/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Media ({filteredMedia.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMedia.length === 0 ? (
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e9ddd3]">
                      <TableHead className="text-[#2d1816] font-semibold">Filename</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Type</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">MIME Type</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Size</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Uploaded By</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedia.map((item) => (
                      <TableRow key={item.id} className="border-[#e9ddd3] hover:bg-[#e9ddd3]/30">
                        <TableCell className="font-medium text-[#2d1816]">
                          {item.filename}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(item.type)} variant="outline">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">{item.mime_type || "-"}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{formatFileSize(item.size_bytes)}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{item.uploaded_by || "-"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(item.storage_path, '_blank')}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/media/${item.id}`)}>
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
                {filteredMedia.map((item) => (
                  <Card key={item.id} className="border-[#e9ddd3]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#f8c84d]/20 flex items-center justify-center">
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2d1816] truncate max-w-[150px]">{item.filename}</h3>
                              <Badge className={getTypeColor(item.type)} variant="outline">
                                <div className="flex items-center gap-1 text-xs">
                                  {getTypeIcon(item.type)}
                                  <span className="capitalize">{item.type}</span>
                                </div>
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Size:</span>
                              <span className="text-[#2d1816]">{formatFileSize(item.size_bytes)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">MIME:</span>
                              <span className="text-[#2d1816] truncate max-w-[100px]">{item.mime_type || "-"}</span>
                            </div>
                            {item.uploaded_by && (
                              <div className="text-[#2d1816]/60 text-xs">
                                By: {item.uploaded_by}
                              </div>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(item.storage_path, '_blank')}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/media/${item.id}`)}>
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
        title="Delete Media File?"
        description="This action cannot be undone. This will permanently delete the media file from the database and storage."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
