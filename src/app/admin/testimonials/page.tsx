"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Edit, Trash2, MessageSquare, Play, Image as ImageIcon } from "lucide-react";
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
        return "bg-success-soft text-green-800 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "archived":
        return "bg-destructive/10 text-red-800 border-destructive/30";
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
      <PageHeader
        title="Testimonials"
        subtitle="Manage beneficiary testimonials"
        actions={[{ label: "Add Testimonial", onClick: () => router.push("/admin/testimonials/new"), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Testimonials ({filteredTestimonials.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <Input
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
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
                    <TableRow className="border-border">
                      <TableHead className="text-foreground font-semibold">Content</TableHead>
                      <TableHead className="text-foreground font-semibold">Media Type</TableHead>
                      <TableHead className="text-foreground font-semibold">Beneficiary ID</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestimonials.map((testimonial) => (
                      <TableRow key={testimonial.id} className="border-border hover:bg-muted">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {testimonial.featured && (
                              <Badge className="bg-gold-300 text-foreground border-gold-300">Featured</Badge>
                            )}
                            <span className="max-w-xs truncate">
                              {testimonial.content || "No content"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getMediaTypeIcon(testimonial.media_type)}
                            <span className="capitalize">{testimonial.media_type || "none"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{testimonial.beneficiary_id || "-"}</TableCell>
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
                                <Edit className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(testimonial.id)}
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
                {filteredTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gold-300/20 flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-gold-300" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">Testimonial</h3>
                              {testimonial.featured && (
                                <Badge className="bg-gold-300 text-foreground border-gold-300 text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {getMediaTypeIcon(testimonial.media_type)}
                              <span className="capitalize">{testimonial.media_type || "text only"}</span>
                            </div>
                            <div className="text-muted-foreground truncate">
                              {testimonial.content || "No content"}
                            </div>
                            {testimonial.beneficiary_id && (
                              <div className="text-muted-foreground text-xs">
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
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(testimonial.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
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
