"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Shield, Lock, Mail, Clock, Send } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AdminRole = "super_admin" | "admin" | "editor";
interface Admin { id: string; full_name: string; role: AdminRole; status?: string; active?: boolean; mfa_enabled?: boolean; created_at: string; }
interface InviteRow { id: string; email: string; full_name: string; role: string; expires_at: string; accepted_at: string | null; created_at: string; }
const emptyForm = { email: "", full_name: "", role: "admin" as AdminRole, active: true };
function initialsOf(name: string) { return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase(); }

export default function AdminsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [inviteToDelete, setInviteToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [aRes, iRes] = await Promise.all([fetch("/api/admin/admins").then(r=>r.json()), fetch("/api/admin/admins/invites").then(r=>r.json())]);
      if (aRes.success) setAdmins((aRes.data??[]).map((p:any)=>({ id:p.id, full_name:p.full_name, role:p.role, status:p.status, active:p.status==="active", created_at:p.created_at })));
      else setAdmins([]);
      if (iRes.success) setInvites(iRes.data ?? []);
      else setInvites([]);
    } catch { toast({ variant:"destructive", title:"Failed to load admins"}); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const query = searchQuery.toLowerCase();
  const filteredAdmins = admins.filter(a=> a.full_name.toLowerCase().includes(query));
  const pendingInvites = invites.filter(i=> !i.accepted_at && new Date(i.expires_at).getTime() > Date.now());

  const validateForm = () => {
    const e: Record<string,string> = {};
    if (!formData.email.trim()) e.email="Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email="Invalid email";
    if (!formData.full_name.trim()) e.full_name="Full name is required";
    setErrors(e); return Object.keys(e).length===0;
  };

  const handleInvite = async () => {
    if (!validateForm()) return;
    if (editingAdmin) {
      try { setSending(true);
        const r=await fetch(`/api/admin/admins/${editingAdmin.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ full_name:formData.full_name, role:formData.role, status: formData.active?"active":"inactive"})});
        const j=await r.json(); if(!j.success) throw new Error(j.error);
        toast({ title:"Admin updated", description:`${formData.full_name} was saved.`}); handleCloseDialog(); load();
      } catch(err:any){ toast({ variant:"destructive", title:"Failed", description:err.message}); } finally{ setSending(false); } return;
    }
    try { setSending(true);
      const r=await fetch("/api/admin/admins/invite",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ email:formData.email, full_name:formData.full_name, role:formData.role})});
      const j=await r.json(); if(!j.success) throw new Error(j.error);
      toast({ title:"Invite sent", description:`Zoho email sent to ${formData.email}`}); handleCloseDialog(); load();
    } catch(err:any){ toast({ variant:"destructive", title:"Failed", description:err.message}); } finally{ setSending(false); }
  };

  const handleDelete = async (id:string) => {
    try { const r=await fetch(`/api/admin/admins/${id}`,{method:"DELETE"}); const j=await r.json(); if(!j.success) throw new Error(j.error); toast({ title:"Admin removed"}); setDeleteConfirm(null); load(); } catch { toast({ variant:"destructive", title:"Failed to delete admin"}); }
  };
  const handleCancelInvite = async (id:string) => {
    try { const r=await fetch(`/api/admin/admins/invites/${id}`,{method:"DELETE"}); const j=await r.json(); if(!j.success) throw new Error(j.error); toast({ title:"Invite cancelled"}); setInviteToDelete(null); load(); } catch { toast({ variant:"destructive", title:"Failed to cancel invite"}); }
  };
  const handleToggleActive = async (id:string, active:boolean) => {
    try { const r=await fetch(`/api/admin/admins/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({ status: active?"active":"inactive"})}); const j=await r.json(); if(!j.success) throw new Error(j.error); toast({ title: active?"Admin activated":"Admin deactivated"}); load(); } catch { toast({ variant:"destructive", title:"Failed to update status"}); }
  };
  const handleOpenDialog = (admin?: Admin) => {
    if(admin){ setEditingAdmin(admin); setFormData({ email:"", full_name:admin.full_name, role:admin.role, active: admin.active ?? admin.status==="active" }); }
    else { setEditingAdmin(null); setFormData(emptyForm); }
    setErrors({}); setIsDialogOpen(true);
  };
  const handleCloseDialog = () => { setIsDialogOpen(false); setEditingAdmin(null); setFormData(emptyForm); setErrors({}); };
  const clearError = (f:string)=>{ if(errors[f]) setErrors(prev=>({...prev,[f]:""})); };

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Users" subtitle="Invite-only via Zoho (hello@whisprwords.com until ABF domain is purchased)" actions={[{ label:"Invite Admin", onClick:()=>handleOpenDialog(), variant:"primary"}]} />
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">All Admins ({filteredAdmins.length})</CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search admins..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <ListSkeleton rows={3} /> : filteredAdmins.length===0 ? <EmptyState icon={Shield} title={searchQuery?"No admins match your search":"No admins yet"} description={searchQuery?"Try a different name.":"Invite your first admin — they'll get an email to set their password."} action={!searchQuery?{ label:"Invite Admin", onClick:()=>handleOpenDialog()}:undefined} /> : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredAdmins.map((admin,index)=>(
                  <ListRow key={admin.id} index={index}
                    leading={<div aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-maroon-500 to-maroon-600 text-lg font-bold text-white">{initialsOf(admin.full_name)}</div>}
                    title={admin.full_name}
                    badges={<><RoleBadge role={admin.role} />{admin.status!=="active" && <StatusBadge status="inactive" />}{admin.mfa_enabled && <Badge variant="success" className="gap-1"><Lock className="size-3" />MFA</Badge>}</>}
                    meta={<><p className="truncate">{admin.full_name}</p><p className="text-xs text-muted-foreground/80">Joined {new Date(admin.created_at).toLocaleDateString()}</p></>}
                    actions={<><Switch checked={admin.active ?? admin.status==="active"} onCheckedChange={(c)=>handleToggleActive(admin.id,c)} aria-label={`${admin.active?"Deactivate":"Activate"} ${admin.full_name}`} /><RowActions name={admin.full_name} onEdit={()=>handleOpenDialog(admin)} onDelete={()=>setDeleteConfirm(admin.id)} /></>}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {pendingInvites.length>0 && (
        <Card className="border-gold-200">
          <CardHeader><CardTitle className="text-sm font-semibold flex gap-2 items-center"><Mail className="size-4 text-gold-600" /> Pending invites ({pendingInvites.length}) <span className="ml-auto text-xs font-normal text-muted-foreground flex gap-1 items-center"><Send className="size-3" /> via Zoho</span></CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pendingInvites.map(inv=>(
              <div key={inv.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Mail className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{inv.full_name} <span className="font-normal text-muted-foreground">· {inv.email}</span></div>
                  <div className="text-xs text-muted-foreground flex gap-2 items-center"><Clock className="size-3" /> expires {new Date(inv.expires_at).toLocaleDateString()} · {inv.role.replace("_"," ")}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={()=>setInviteToDelete(inv.id)}>Cancel</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <FormDialog open={isDialogOpen} onOpenChange={(o)=>(o?setIsDialogOpen(true):handleCloseDialog())} title={editingAdmin?"Edit Admin":"Invite Admin"} description={editingAdmin?"Update this admin's details.":"They'll receive a Zoho email from hello@whisprwords.com (temp) to set their password. Expires in 7 days."} submitLabel={editingAdmin?"Update":sending?"Sending...":"Send invite"} onSubmit={handleInvite}>
        <FormField label="Full Name" htmlFor="full_name" required error={errors.full_name}>
          <Input id="full_name" autoComplete="name" value={formData.full_name} onChange={(e)=>{ setFormData(prev=>({...prev, full_name:e.target.value})); clearError("full_name"); }} placeholder="Jane Doe" className={`h-11 ${errors.full_name?"border-destructive":""}`} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errors.email} hint={editingAdmin?"Email cannot be changed.":"Invite link sent via Zoho SMTP."}>
          <Input id="email" type="email" autoComplete="email" value={formData.email} onChange={(e)=>{ setFormData(prev=>({...prev, email:e.target.value})); clearError("email"); }} placeholder="admin@adeyinkabakare.org" className={`h-11 ${errors.email?"border-destructive":""}`} disabled={!!editingAdmin} />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <Select value={formData.role} onValueChange={(v)=>setFormData(prev=>({...prev, role:v as AdminRole}))}>
            <SelectTrigger id="role" className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
          <Switch id="active" checked={formData.active} onCheckedChange={(c)=>setFormData(prev=>({...prev, active:c}))} />
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
        </div>
      </FormDialog>

      <ConfirmDialog open={!!deleteConfirm} onOpenChange={()=>setDeleteConfirm(null)} onConfirm={()=>deleteConfirm && handleDelete(deleteConfirm)} title="Delete Admin?" description="This action cannot be undone." confirmLabel="Delete" cancelLabel="Cancel" destructive />
      <ConfirmDialog open={!!inviteToDelete} onOpenChange={()=>setInviteToDelete(null)} onConfirm={()=>inviteToDelete && handleCancelInvite(inviteToDelete)} title="Cancel invite?" description="The invite link will be invalidated." confirmLabel="Cancel invite" cancelLabel="Keep" destructive />
    </div>
  );
}
