"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Shield, Search, Plus, Edit, Trash2, Mail, Lock, UserCheck, UserX, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "admin" | "editor";
  active: boolean;
  mfa_enabled: boolean;
  created_at: string;
  last_login?: string;
}

export default function AdminsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "admin" as "super_admin" | "admin" | "editor",
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('admin_users')
        //   .select('*')
        //   .order('created_at', { ascending: false });
        // if (error) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAdmins([]);
      } catch (error) {
        console.error("Error loading admins:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load admins",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, [toast]);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingAdmin) {
        // TODO: Replace with actual Supabase update
        // const { error } = await supabase
        //   .from('admin_users')
        //   .update({
        //     email: formData.email,
        //     full_name: formData.full_name,
        //     role: formData.role,
        //     active: formData.active,
        //   })
        //   .eq('id', editingAdmin.id);
        // if (error) throw error;

        setAdmins(
          admins.map((admin) =>
            admin.id === editingAdmin.id ? { ...admin, ...formData } : admin
          )
        );
        toast({
          title: "Success",
          description: "Admin updated successfully",
        });
      } else {
        // TODO: Replace with actual Supabase insert with auth user creation
        // const { data, error } = await supabase.auth.admin.createUser({
        //   email: formData.email,
        //   email_confirm: true,
        // });
        // if (error) throw error;

        // const { data: adminData, error: adminError } = await supabase
        //   .from('admin_users')
        //   .insert({
        //     id: data.user.id,
        //     email: formData.email,
        //     full_name: formData.full_name,
        //     role: formData.role,
        //     active: formData.active,
        //   })
        //   .select()
        //   .single();
        // if (adminError) throw adminError;

        const newAdmin: Admin = {
          id: Date.now().toString(),
          ...formData,
          mfa_enabled: false,
          created_at: new Date().toISOString(),
        };
        setAdmins([...admins, newAdmin]);
        toast({
          title: "Success",
          description: "Admin added successfully",
        });
      }

      handleCloseDialog();
    } catch (error: any) {
      console.error("Error saving admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save admin",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('admin_users')
      //   .delete()
      //   .eq('id', id);
      // if (error) throw error;

      setAdmins(admins.filter((admin) => admin.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Admin deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete admin",
      });
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      // TODO: Replace with actual Supabase update
      // const { error } = await supabase
      //   .from('admin_users')
      //   .update({ active })
      //   .eq('id', id);
      // if (error) throw error;

      setAdmins(admins.map((admin) => (admin.id === id ? { ...admin, active } : admin)));
      toast({
        title: active ? "Admin activated" : "Admin deactivated",
        description: active ? "Admin has been activated" : "Admin has been deactivated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update admin status",
      });
    }
  };

  const handleOpenDialog = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        active: admin.active,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        email: "",
        full_name: "",
        role: "admin",
        active: true,
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAdmin(null);
    setFormData({
      email: "",
      full_name: "",
      role: "admin",
      active: true,
    });
    setErrors({});
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge className="bg-gradient-to-r from-[#f8c84d] to-[#efb11f] text-[#2d1816] border-[#f8c84d]">
            <Crown className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-[#aa322b]/10 text-[#aa322b] border-[#aa322b]/30">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[#2d1816] border-[#e9ddd3]">
            Editor
          </Badge>
        );
    }
  };

  if (loading) {
    return <LoadingState message="Loading admins..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Users"
        subtitle="Manage admin access and permissions"
        actions={[
          {
            label: "Add Admin",
            onClick: () => handleOpenDialog(),
            variant: "primary",
          },
        ]}
      />

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Admins ({filteredAdmins.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAdmins.length === 0 ? (
            <EmptyState
              title="No admins found"
              description={
                searchQuery
                  ? "Try a different search term"
                  : "Get started by adding your first admin"
              }
              action={
                !searchQuery
                  ? {
                      label: "Add Admin",
                      onClick: () => handleOpenDialog(),
                    }
                  : undefined
              }
              icon={Shield}
            />
          ) : (
            <div className="space-y-3">
              {filteredAdmins.map((admin) => (
                <Card key={admin.id} className="border-[#e9ddd3]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#aa322b] to-[#922821] flex items-center justify-center text-white font-bold text-lg">
                        {admin.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-[#2d1816]">
                            {admin.full_name}
                          </h3>
                          {getRoleBadge(admin.role)}
                          {!admin.active && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                          {admin.mfa_enabled && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              MFA
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#2d1816]/60 mb-1">{admin.email}</p>
                        <div className="flex items-center gap-4 text-xs text-[#2d1816]/40">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            Joined {new Date(admin.created_at).toLocaleDateString()}
                          </span>
                          {admin.last_login && (
                            <span className="flex items-center gap-1">
                              Last login {new Date(admin.last_login).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={admin.active}
                          onCheckedChange={(checked) => handleToggleActive(admin.id, checked)}
                          title={admin.active ? "Deactivate" : "Activate"}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(admin)}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(admin.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">
              {editingAdmin ? "Edit Admin" : "Add New Admin"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-[#2d1816]">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, full_name: e.target.value }));
                  if (errors.full_name) setErrors((prev) => ({ ...prev, full_name: "" }));
                }}
                placeholder="John Doe"
                className={`border-[#e9ddd3] ${errors.full_name ? "border-red-500" : ""}`}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2d1816]">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="admin@example.com"
                className={`border-[#e9ddd3] ${errors.email ? "border-red-500" : ""}`}
                disabled={!!editingAdmin}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              {editingAdmin && (
                <p className="text-xs text-[#2d1816]/60">Email cannot be changed</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#2d1816]">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger id="role" className="border-[#e9ddd3]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#2d1816]/60">
                Super admins have full access, admins can manage content, editors can only edit
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#e9ddd3] rounded-lg bg-[#fffdf8]">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label htmlFor="active" className="text-[#2d1816] cursor-pointer">
                Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              {editingAdmin ? "Update" : "Add Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Admin?"
        description="This action cannot be undone. This will permanently delete this admin user."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
