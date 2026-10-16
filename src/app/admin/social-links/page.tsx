"use client";

import { useState, useEffect } from "react";
import { ExternalLink, X, ArrowUp, ArrowDown, Globe, Share2, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";
import { AnimatePresence } from "framer-motion";
import { ListRow } from "@/components/admin/list-row";
import { RowActions } from "@/components/admin/row-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { FormField } from "@/components/admin/form-field";
import { FormDialog } from "@/components/admin/form-dialog";
import { Toolbar } from "@/components/admin/toolbar";
import { ListSkeleton } from "@/components/admin/loading-state";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const PLATFORMS = [
  { value: "facebook", label: "Facebook", icon: Globe },
  { value: "twitter", label: "Twitter / X", icon: X },
  { value: "instagram", label: "Instagram", icon: Globe },
  { value: "linkedin", label: "LinkedIn", icon: Globe },
  { value: "youtube", label: "YouTube", icon: Globe },
  { value: "tiktok", label: "TikTok", icon: Share2 },
  { value: "email", label: "Email", icon: Mail },
  { value: "other", label: "Other", icon: ExternalLink },
];

export default function SocialLinksPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    is_active: true as boolean,
    sort_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/social-links");
        const result = await response.json();

        if (result.success) {
          setSocialLinks(result.data);
        } else {
          throw new Error(result.error || "Failed to load social links");
        }
      } catch (error) {
        console.error("Error loading social links:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load social links",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSocialLinks();
  }, [toast]);

  const filteredLinks = socialLinks.filter((item) =>
    item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.platform.trim()) {
      newErrors.platform = "Platform is required";
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!formData.url.startsWith("http://") && !formData.url.startsWith("https://")) {
      newErrors.url = "URL must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editingLink) {
        const response = await fetch(`/api/admin/social-links/${editingLink.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setSocialLinks(socialLinks.map(link =>
          link.id === editingLink.id
            ? result.data
            : link
        ));
        toast({
          title: "Success",
          description: "Social link updated successfully",
        });
      } else {
        const response = await fetch("/api/admin/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setSocialLinks([...socialLinks, result.data]);
        toast({
          title: "Success",
          description: "Social link added successfully",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving social link:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save social link",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setSocialLinks(socialLinks.filter((link) => link.id !== id));
      setDeleteConfirm(null);
      toast({
        title: "Success",
        description: "Social link deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete social link",
      });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newLinks = [...socialLinks];
    [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    setSocialLinks(newLinks);
  };

  const handleMoveDown = (index: number) => {
    if (index === socialLinks.length - 1) return;
    const newLinks = [...socialLinks];
    [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    setSocialLinks(newLinks);
  };

  const handleOpenDialog = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        url: link.url,
        is_active: link.is_active,
        sort_order: link.sort_order,
      });
    } else {
      setEditingLink(null);
      setFormData({
        platform: "",
        url: "",
        is_active: true,
        sort_order: socialLinks.length,
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLink(null);
    setFormData({
      platform: "",
      url: "",
      is_active: true,
      sort_order: 0,
    });
    setErrors({});
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = PLATFORMS.find(p => p.value === platform);
    const Icon = platformData?.icon || ExternalLink;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Social Links"
        subtitle="Manage social media links"
        actions={[{ label: "Add Social Link", onClick: () => handleOpenDialog(), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              All Social Links ({filteredLinks.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search links..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : filteredLinks.length === 0 ? (
            <EmptyState
              title="No social links found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first social link"}
              action={!searchQuery ? { label: "Add Social Link", onClick: () => handleOpenDialog() } : undefined}
              icon={ExternalLink}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredLinks.map((link, index) => (
                  <ListRow
                    key={link.id}
                    index={index}
                    leading={
                      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        {getPlatformIcon(link.platform)}
                      </div>
                    }
                    title={<span className="capitalize">{link.platform}</span>}
                    badges={!link.is_active && <StatusBadge status="inactive" />}
                    meta={<p className="truncate">{link.url}</p>}
                    actions={
                      <RowActions
                        name={link.platform}
                        onEdit={() => handleOpenDialog(link)}
                        onDelete={() => setDeleteConfirm(link.id)}
                        extra={[
                          { label: "Move up", icon: ArrowUp, onSelect: () => handleMoveUp(index), disabled: index === 0 },
                          { label: "Move down", icon: ArrowDown, onSelect: () => handleMoveDown(index), disabled: index === filteredLinks.length - 1 },
                          { label: "Open link", icon: ExternalLink, onSelect: () => window.open(link.url, "_blank") },
                        ]}
                      />
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
        onOpenChange={(open) => (open ? undefined : handleCloseDialog())}
        title={editingLink ? "Edit Social Link" : "Add Social Link"}
        description="Shown in the site footer and on the contact page."
        submitLabel={editingLink ? "Update" : "Add"}
        submitting={saving}
        onSubmit={handleSave}
      >
        <FormField label="Platform" htmlFor="platform" required error={errors.platform}>
          <Select
            value={formData.platform}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, platform: value }));
              if (errors.platform) setErrors((prev) => ({ ...prev, platform: "" }));
            }}
          >
            <SelectTrigger id="platform" aria-invalid={!!errors.platform} className={errors.platform ? "border-destructive" : ""}>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  <div className="flex items-center gap-2">
                    <platform.icon className="w-4 h-4" />
                    {platform.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="URL" htmlFor="url" required error={errors.url}>
          <Input
            id="url"
            type="url"
            inputMode="url"
            value={formData.url}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, url: e.target.value }));
              if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
            }}
            placeholder="https://facebook.com/yourpage"
            aria-invalid={!!errors.url}
          />
        </FormField>

        <FormField label="Sort Order" htmlFor="sort_order" hint="Lower numbers appear first.">
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />
        </FormField>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
          <Switch
            id="active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
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
        title="Delete Social Link?"
        description="This action cannot be undone. This will permanently delete the social link."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </div>
  );
}
