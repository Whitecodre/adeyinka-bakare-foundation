"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Edit, Trash2, User } from "lucide-react";
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
    // TODO: Replace with actual Supabase query
    const loadMembers = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('members').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMembers([]);
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
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('members').delete().eq('id', id)
      // if (error) throw error
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success-soft text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "graduated":
        return "bg-info-soft text-blue-800 border-blue-200";
      case "archived":
        return "bg-destructive/10 text-red-800 border-destructive/30";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <LoadingState message="Loading members..." />;
  }

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
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground font-semibold">Name</TableHead>
                      <TableHead className="text-foreground font-semibold">Email</TableHead>
                      <TableHead className="text-foreground font-semibold">Department</TableHead>
                      <TableHead className="text-foreground font-semibold">Level</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id} className="border-border hover:bg-muted">
                        <TableCell className="font-medium text-foreground">
                          {member.full_name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.email || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{member.department || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{member.level || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.status)} variant="outline">
                            {member.status}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/members/${member.id}`)}>
                                <Edit className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(member.id)}
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
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gold-300/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-gold-300" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                              <p className="text-xs text-muted-foreground">{member.email || "No email"}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Department:</span>
                              <span className="text-foreground">{member.department || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Level:</span>
                              <span className="text-foreground">{member.level || "-"}</span>
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/members/${member.id}`)}>
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(member.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Badge className={getStatusColor(member.status)} variant="outline">
                          {member.status}
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
        title="Delete Member?"
        description="This action cannot be undone. This will permanently delete the member from the database."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
