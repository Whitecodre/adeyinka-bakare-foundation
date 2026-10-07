"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Edit, Trash2, UserPlus, Mail, Phone } from "lucide-react";
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

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  level?: string;
  interest?: string;
  message?: string;
  status: "new" | "contacted" | "accepted" | "rejected" | "archived";
  created_at: string;
}

export default function VolunteersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual Supabase query
    const loadVolunteers = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('volunteers').select('*')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVolunteers([]);
      } catch (error) {
        console.error("Error loading volunteers:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load volunteers",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVolunteers();
  }, [toast]);

  const filteredVolunteers = volunteers.filter((volunteer) =>
    volunteer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.interest?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('volunteers').delete().eq('id', id)
      // if (error) throw error
      
      setVolunteers(volunteers.filter((v) => v.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Volunteer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete volunteer",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return <LoadingState message="Loading volunteers..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Volunteers</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage volunteer applications</p>
        </div>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Volunteers ({filteredVolunteers.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search volunteers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVolunteers.length === 0 ? (
            <EmptyState
              title="No volunteers found"
              description={searchQuery ? "Try a different search term" : "Volunteer applications will appear here"}
              icon={UserPlus}
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e9ddd3]">
                      <TableHead className="text-[#2d1816] font-semibold">Name</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Email</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Phone</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Department</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Interest</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold">Status</TableHead>
                      <TableHead className="text-[#2d1816] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id} className="border-[#e9ddd3] hover:bg-[#e9ddd3]/30">
                        <TableCell className="font-medium text-[#2d1816]">
                          {volunteer.full_name}
                        </TableCell>
                        <TableCell className="text-[#2d1816]/60">{volunteer.email}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{volunteer.phone || "-"}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{volunteer.department || "-"}</TableCell>
                        <TableCell className="text-[#2d1816]/60">{volunteer.interest || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(volunteer.status)} variant="outline">
                            {volunteer.status}
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/volunteers/${volunteer.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(volunteer.id)}
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
                {filteredVolunteers.map((volunteer) => (
                  <Card key={volunteer.id} className="border-[#e9ddd3]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#f8c84d]/20 flex items-center justify-center">
                              <UserPlus className="w-5 h-5 text-[#f8c84d]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#2d1816]">{volunteer.full_name}</h3>
                              <p className="text-xs text-[#2d1816]/60 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {volunteer.email}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            {volunteer.phone && (
                              <div className="flex items-center gap-2 text-[#2d1816]/60">
                                <Phone className="w-3 h-3" />
                                {volunteer.phone}
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Department:</span>
                              <span className="text-[#2d1816]">{volunteer.department || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#2d1816]/60">Interest:</span>
                              <span className="text-[#2d1816]">{volunteer.interest || "-"}</span>
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/volunteers/${volunteer.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(volunteer.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Badge className={getStatusColor(volunteer.status)} variant="outline">
                          {volunteer.status}
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
        title="Delete Volunteer?"
        description="This action cannot be undone. This will permanently delete the volunteer application from the database."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
