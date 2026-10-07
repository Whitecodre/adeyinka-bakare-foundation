"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, MessageSquare, Play, Image as ImageIcon } from "lucide-react";
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

interface Testimonial {
  id: string;
  beneficiary_id?: string;
  content?: string;
  media_url?: string;
  media_type?: "image" | "video" | "none";
  featured: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual Supabase query
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('testimonials').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTestimonials([]);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load testimonials",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [toast]);

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('testimonials').delete().eq('id', id)
      // if (error) throw error
      
      setTestimonials(testimonials.filter((t) => t.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete testimonial",
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

  const getMediaTypeIcon = (type?: string) => {
    switch (type) {
      case "video":
        return <Play className="w-3 h-3" />;
      case "image":
        return <ImageIcon className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  if (loading) {
    return <LoadingState message="Loading testimonials..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Testimonials</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage beneficiary testimonials</p>
        </div>
        <Button onClick={() => router.push("/admin/testimonials/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Testimonials ({filteredTestimonials.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTestimonials.length === 0 ? (
            <EmptyState
              title="No testimonials found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first testimonial"}
              action={
                !searchQuery ? {
                  label: "Add Testimonial",
                  onClick: () => router.push("/admin/testimonials/new")
                } : undefined
              }
              icon={MessageSquare}
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e9ddd3]">
                      <TableHead className="text-[#2d1816] font-semibold">Content</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Media Type</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Beneficiary ID</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Status</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestimonials.map((testimonial) => (
                      <TableRow key={testimonial.id} className="border-[#e9ddd3] hover:bg-[#e9ddd3]/30">
                        <TableCell className="font-medium text-[#2d1816]">
                          <div className="flex items-center gap-2">
                            {testimonial.featured && (
                              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Featured</Badge>
                            )}
                            <span className="max-w-xs truncate">
                              {testimonial.content || "No content"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">
                          <div className="flex items-center gap-1">
                            {getMediaTypeIcon(testimonial.media_type)}
                            <span className="capitalize">{testimonial.media_type || "none"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">{testimonial.beneficiary_id || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(testimonial.status)} variant="outline">
                            {testimonial.status}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/${testimonial.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(testimonial.id)}
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
                {filteredTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-[#e9ddd3]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#f8c84d]/20 flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-[#f8c84d]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2d1816]">Testimonial</h3>
                              {testimonial.featured && (
                                <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d] text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-[#2d1816]/60">
                              {getMediaTypeIcon(testimonial.media_type)}
                              <span className="capitalize">{testimonial.media_type || "text only"}</span>
                            </div>
                            <div className="text-[#2d1816]/60 truncate">
                              {testimonial.content || "No content"}
                            </div>
                            {testimonial.beneficiary_id && (
                              <div className="text-[#2d1816]/60 text-xs">
                                Beneficiary ID: {testimonial.beneficiary_id}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/${testimonial.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(testimonial.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Badge className={getStatusColor(testimonial.status)} variant="outline">
                          {testimonial.status}
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
        title="Delete Testimonial?"
        description="This action cannot be undone. This will permanently delete the testimonial from the database."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
