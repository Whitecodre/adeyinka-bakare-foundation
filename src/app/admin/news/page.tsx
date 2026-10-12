"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, Newspaper, Eye } from "lucide-react";
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

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author_id?: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  featured: boolean;
  created_at: string;
}

export default function NewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual Supabase query
    const loadNews = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('news').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews([]);
      } catch (error) {
        console.error("Error loading news:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load news",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [toast]);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('news').delete().eq('id', id)
      // if (error) throw error
      
      setNews(news.filter((n) => n.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete news article",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingState message="Loading news..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground m-0">News</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage news articles</p>
        </div>
        <Button onClick={() => router.push("/admin/news/new")} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All News ({filteredNews.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNews.length === 0 ? (
            <EmptyState
              title="No news found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first news article"}
              action={
                !searchQuery ? {
                  label: "Add News",
                  onClick: () => router.push("/admin/news/new")
                } : undefined
              }
              icon={Newspaper}
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
                      <TableHead className="text-foreground font-semibold">Excerpt</TableHead>
                      <TableHead className="text-foreground font-semibold">Published</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNews.map((item) => (
                      <TableRow key={item.id} className="border-border hover:bg-muted">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {item.featured && (
                              <Badge className="bg-gold-300 text-foreground border-gold-300">Featured</Badge>
                            )}
                            {item.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {item.excerpt || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.published_at ? formatDate(item.published_at) : "-"}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/news/${item.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/news/${item.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(item.id)}
                                className="text-destructive"
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
                {filteredNews.map((item) => (
                  <Card key={item.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gold-300/20 flex items-center justify-center">
                              <Newspaper className="w-5 h-5 text-gold-300" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{item.title}</h3>
                              {item.featured && (
                                <Badge className="bg-gold-300 text-foreground border-gold-300 text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Slug:</span>
                              <span className="text-foreground">{item.slug}</span>
                            </div>
                            <div className="text-muted-foreground truncate">
                              {item.excerpt || "No excerpt"}
                            </div>
                            {item.published_at && (
                              <div className="text-muted-foreground text-xs">
                                Published: {formatDate(item.published_at)}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/news/${item.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/news/${item.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(item.id)}
                              className="text-destructive"
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
        title="Delete News Article?"
        description="This action cannot be undone. This will permanently delete the news article from the database."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
