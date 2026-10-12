"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Shield, Lock } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Toolbar } from "@/components/admin/toolbar";
import { ListRow } from "@/components/admin/list-row";
import { RowActions } from "@/components/admin/row-actions";
import { RoleBadge, StatusBadge } from "@/components/admin/status-badge";
import { FormField } from "@/components/admin/form-field";
import { FormDialog } from "@/components/admin/form-dialog";
import { ListSkeleton } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type AdminRole = "super_admin" | "admin" | "editor";

interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  active: boolean;
  mfa_enabled: boolean;
  created_at: string;
  last_login?: string;
}

const emptyForm = {
  email: "",
  full_name: "",
  role: "admin" as AdminRole,
  active: true,
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        await new Promise((resolve) => setTimeout(resolve, 600));
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

  const query = searchQuery.toLowerCase();
  const filteredAdmins = admins.filter(
    (admin) => admin.email.toLowerCase().includes(query) || admin.full_name.toLowerCase().includes(query),
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
    if (!validateForm()) return;

    try {
      if (editingAdmin) {
        // TODO: Replace with actual Supabase update
        setAdmins(admins.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...formData } : admin)));
        toast({ title: "Admin updated", description: `${formData.full_name} was saved.` });
      } else {
        // TODO: Replace with actual Supabase insert with auth user creation
        const newAdmin: Admin = {
          id: crypto.randomUUID(),
          ...formData,
          mfa_enabled: false,
          created_at: new Date().toISOString(),
        };
        setAdmins([...admins, newAdmin]);
        toast({ title: "Admin added", description: `${formData.full_name} now has ${formData.role.replace("_", " ")} access.` });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save admin",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const target = admins.find((a) => a.id === id);
    try {
      // TODO: Replace with actual Supabase delete
      setAdmins(admins.filter((admin) => admin.id !== id));
      setDeleteConfirm(null);
      toast({ title: "Admin removed", description: target ? `${target.full_name} no longer has access.` : undefined });
    } catch {
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
      setAdmins(admins.map((admin) => (admin.id === id ? { ...admin, active } : admin)));
      toast({
        title: active ? "Admin activated" : "Admin deactivated",
        description: active ? "They can sign in again." : "They can no longer sign in.",
      });
    } catch {
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
      setFormData(emptyForm);
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAdmin(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Users"
        subtitle="Manage admin access and permissions"
        actions={[{ label: "Add Admin", onClick: () => handleOpenDialog(), variant: "primary" }]}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">All Admins ({filteredAdmins.length})</CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search admins..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={3} />
          ) : filteredAdmins.length === 0 ? (
            <EmptyState
              icon={Shield}
              title={searchQuery ? "No admins match your search" : "No admins yet"}
              description={searchQuery ? "Try a different name or email." : "Add your first admin to share the workload."}
              action={!searchQuery ? { label: "Add Admin", onClick: () => handleOpenDialog() } : undefined}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredAdmins.map((admin, index) => (
                  <ListRow
                    key={admin.id}
                    index={index}
                    leading={
                      <div
                        aria-hidden="true"
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-maroon-500 to-maroon-600 text-lg font-bold text-white"
                      >
                        {initialsOf(admin.full_name)}
                      </div>
                    }
                    title={admin.full_name}
                    badges={
                      <>
                        <RoleBadge role={admin.role} />
                        {!admin.active && <StatusBadge status="inactive" />}
                        {admin.mfa_enabled && (
                          <Badge variant="success" className="gap-1">
                            <Lock className="size-3" />
                            MFA
                          </Badge>
                        )}
                      </>
                    }
                    meta={
                      <>
                        <p className="truncate">{admin.email}</p>
                        <p className="text-xs text-muted-foreground/80">
                          Joined {new Date(admin.created_at).toLocaleDateString()}
                          {admin.last_login && ` · Last login ${new Date(admin.last_login).toLocaleDateString()}`}
                        </p>
                      </>
                    }
                    actions={
                      <>
                        <Switch
                          checked={admin.active}
                          onCheckedChange={(checked) => handleToggleActive(admin.id, checked)}
                          aria-label={`${admin.active ? "Deactivate" : "Activate"} ${admin.full_name}`}
                        />
                        <RowActions
                          name={admin.full_name}
                          onEdit={() => handleOpenDialog(admin)}
                          onDelete={() => setDeleteConfirm(admin.id)}
                        />
                      </>
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <FormDialog
        open={isDialogOpen}
        onOpenChange={(open) => (open ? setIsDialogOpen(true) : handleCloseDialog())}
        title={editingAdmin ? "Edit Admin" : "Add New Admin"}
        description={editingAdmin ? "Update this admin's details and access." : "They will be able to sign in to the dashboard."}
        submitLabel={editingAdmin ? "Update" : "Add Admin"}
        onSubmit={handleSave}
      >
        <FormField label="Full Name" htmlFor="full_name" required error={errors.full_name}>
          <Input
            id="full_name"
            autoComplete="name"
            value={formData.full_name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, full_name: e.target.value }));
              clearError("full_name");
            }}
            placeholder="John Doe"
            aria-invalid={!!errors.full_name}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
            className={`h-11 ${errors.full_name ? "border-destructive" : ""}`}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          required
          error={errors.email}
          hint={editingAdmin ? "Email cannot be changed." : undefined}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }));
              clearError("email");
            }}
            placeholder="admin@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : editingAdmin ? "email-hint" : undefined}
            className={`h-11 ${errors.email ? "border-destructive" : ""}`}
            disabled={!!editingAdmin}
          />
        </FormField>

        <FormField
          label="Role"
          htmlFor="role"
          hint="Super admins have full access, admins can manage content, editors can only edit."
        >
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as AdminRole }))}
          >
            <SelectTrigger id="role" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active
          </Label>
        </div>
      </FormDialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Admin?"
        description="This action cannot be undone. This will permanently delete this admin user."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </div>
  );
}
