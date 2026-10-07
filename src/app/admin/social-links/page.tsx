"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, Edit, Trash2, ExternalLink, X, ArrowUp, ArrowDown, Loader2, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const PLATFORMS = [
  { value: "facebook", label: "Facebook", icon: Globe },
  { value: "twitter", label: "Twitter / X", icon: X },
  { value: "instagram", label: "Instagram", icon: Share2 },
  { value: "linkedin", label: "LinkedIn", icon: Globe },
  { value: "youtube", label: "YouTube", icon: Globe },
  { value: "tiktok", label: "TikTok", icon: Share2 },
  { value: "other", label: "Other", icon: ExternalLink },
];

export default function SocialLinksPage() {
  const router = useRouter();
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
    active: true,
    sort_order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase.from('social_links').select('*').order('sort_order')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSocialLinks([]);
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
        // TODO: Replace with actual Supabase update
        // const { error } = await supabase
        //   .from('social_links')
        //   .update({
        //     platform: formData.platform,
        //     url: formData.url,
        //     active: formData.active,
        //     sort_order: formData.sort_order,
        //   })
        //   .eq('id', editingLink.id);
        // if (error) throw error;

        setSocialLinks(socialLinks.map(link =>
          link.id === editingLink.id
            ? { ...link, ...formData }
            : link
        ));
        toast({
          title: "Success",
          description: "Social link updated successfully",
        });
      } else {
        // TODO: Replace with actual Supabase insert
        // const { data, error } = await supabase
        //   .from('social_links')
        //   .insert({
        //     platform: formData.platform,
        //     url: formData.url,
        //     active: formData.active,
        //     sort_order: formData.sort_order,
        //   })
        //   .select()
        //   .single();
        // if (error) throw error;

        const newLink: SocialLink = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
        };
        setSocialLinks([...socialLinks, newLink]);
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
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase.from('social_links').delete().eq('id', id)
      // if (error) throw error

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
        active: link.active,
        sort_order: link.sort_order,
      });
    } else {
      setEditingLink(null);
      setFormData({
        platform: "",
        url: "",
        active: true,
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
      active: true,
      sort_order: 0,
    });
    setErrors({});
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = PLATFORMS.find(p => p.value === platform);
    const Icon = platformData?.icon || ExternalLink;
    return <Icon className="w-4 h-4" />;
  };

  if (loading) {
    return <LoadingState message="Loading social links..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Social Links</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage social media links</p>
        </div>
        <Button onClick={() => handleOpenDialog()} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              All Social Links ({filteredLinks.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLinks.length === 0 ? (
            <EmptyState
              title="No social links found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first social link"}
              action={
                !searchQuery ? {
                  label: "Add Social Link",
                  onClick: () => handleOpenDialog()
                } : undefined
              }
              icon={ExternalLink}
            />
          ) : (
            <div className="space-y-3">
              {filteredLinks.map((link, index) => (
                <Card key={link.id} className="border-[#e9ddd3]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === filteredLinks.length - 1}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-[#e9ddd3]/30 flex items-center justify-center">
                        {getPlatformIcon(link.platform)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#2d1816] capitalize">
                            {link.platform}
                          </h3>
                          {!link.active && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#2d1816]/60 truncate">
                          {link.url}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(link.url, '_blank')}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(link)}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(link.id)}
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
              {editingLink ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-[#2d1816]">
                Platform <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, platform: value }));
                  if (errors.platform) setErrors(prev => ({ ...prev, platform: "" }));
                }}
              >
                <SelectTrigger className={`border-[#e9ddd3] ${errors.platform ? "border-red-500" : ""}`}>
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
              {errors.platform && (
                <p className="text-sm text-red-500">{errors.platform}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-[#2d1816]">
                URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, url: e.target.value }));
                  if (errors.url) setErrors(prev => ({ ...prev, url: "" }));
                }}
                placeholder="https://facebook.com/yourpage"
                className={`border-[#e9ddd3] ${errors.url ? "border-red-500" : ""}`}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[#2d1816]">
                Sort Order
              </Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="border-[#e9ddd3]"
              />
              <p className="text-xs text-[#2d1816]/60">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#e9ddd3] rounded-lg bg-[#fffdf8]">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
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
              disabled={saving}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] text-white hover:from-[#922821] hover:to-[#7a221b]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingLink ? "Update" : "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Social Link?"
        description="This action cannot be undone. This will permanently delete the social link."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
