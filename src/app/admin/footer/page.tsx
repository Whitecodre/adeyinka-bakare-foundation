"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, ExternalLink, ArrowUp, ArrowDown, ChevronDown, ChevronRight, Loader2, FolderOpen, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface FooterLink {
  id: string;
  label: string;
  url: string;
  sort_order: number;
  active: boolean;
}

interface FooterSection {
  id: string;
  title: string;
  sort_order: number;
  active: boolean;
  links: FooterLink[];
}

export default function FooterPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "section" | "link", id: string } | null>(null);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null);
  const [editingLink, setEditingLink] = useState<{ sectionId: string, link: FooterLink } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const [sectionFormData, setSectionFormData] = useState({
    title: "",
    sort_order: 0,
    active: true,
  });

  const [linkFormData, setLinkFormData] = useState({
    label: "",
    url: "",
    sort_order: 0,
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadFooterSections = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase.from('footer_sections').select('*, footer_links(*)').order('sort_order')
        // if (error) throw error
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFooterSections([]);
      } catch (error) {
        console.error("Error loading footer sections:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load footer sections",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFooterSections();
  }, [toast]);

  const filteredSections = footerSections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.links.some(link =>
      link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const validateSectionForm = () => {
    const newErrors: Record<string, string> = {};

    if (!sectionFormData.title.trim()) {
      newErrors.title = "Section title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLinkForm = () => {
    const newErrors: Record<string, string> = {};

    if (!linkFormData.label.trim()) {
      newErrors.label = "Link label is required";
    }

    if (!linkFormData.url.trim()) {
      newErrors.url = "URL is required";
    } else if (!linkFormData.url.startsWith("http://") && !linkFormData.url.startsWith("https://") && !linkFormData.url.startsWith("/")) {
      newErrors.url = "URL must start with http://, https://, or /";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSection = async () => {
    if (!validateSectionForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editingSection) {
        // TODO: Replace with actual Supabase update
        // const { error } = await supabase
        //   .from('footer_sections')
        //   .update({
        //     title: sectionFormData.title,
        //     sort_order: sectionFormData.sort_order,
        //     active: sectionFormData.active,
        //   })
        //   .eq('id', editingSection.id);
        // if (error) throw error;

        setFooterSections(footerSections.map(section =>
          section.id === editingSection.id
            ? { ...section, ...sectionFormData }
            : section
        ));
        toast({
          title: "Success",
          description: "Footer section updated successfully",
        });
      } else {
        // TODO: Replace with actual Supabase insert
        // const { data, error } = await supabase
        //   .from('footer_sections')
        //   .insert({
        //     title: sectionFormData.title,
        //     sort_order: sectionFormData.sort_order,
        //     active: sectionFormData.active,
        //   })
        //   .select()
        //   .single();
        // if (error) throw error;

        const newSection: FooterSection = {
          id: Date.now().toString(),
          ...sectionFormData,
          links: [],
        };
        setFooterSections([...footerSections, newSection]);
        toast({
          title: "Success",
          description: "Footer section added successfully",
        });
      }

      handleCloseSectionDialog();
    } catch (error) {
      console.error("Error saving footer section:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save footer section",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLink = async () => {
    if (!validateLinkForm()) {
      return;
    }

    if (!editingLink) return;

    try {
      setSaving(true);

      if (editingLink.link.id) {
        // Update existing link
        setFooterSections(footerSections.map(section =>
          section.id === editingLink.sectionId
            ? {
                ...section,
                links: section.links.map(link =>
                  link.id === editingLink.link.id
                    ? { ...link, ...linkFormData }
                    : link
                ),
              }
            : section
        ));
        toast({
          title: "Success",
          description: "Footer link updated successfully",
        });
      } else {
        // Add new link
        const newLink: FooterLink = {
          id: Date.now().toString(),
          ...linkFormData,
        };
        setFooterSections(footerSections.map(section =>
          section.id === editingLink.sectionId
            ? { ...section, links: [...section.links, newLink] }
            : section
        ));
        toast({
          title: "Success",
          description: "Footer link added successfully",
        });
      }

      handleCloseLinkDialog();
    } catch (error) {
      console.error("Error saving footer link:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save footer link",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === "section") {
        // TODO: Replace with actual Supabase delete
        // const { error } = await supabase.from('footer_sections').delete().eq('id', deleteConfirm.id)
        // if (error) throw error

        setFooterSections(footerSections.filter((section) => section.id !== deleteConfirm.id));
        toast({
          title: "Success",
          description: "Footer section deleted successfully",
        });
      } else {
        // Delete link
        setFooterSections(footerSections.map(section => ({
          ...section,
          links: section.links.filter((link) => link.id !== deleteConfirm.id),
        })));
        toast({
          title: "Success",
          description: "Footer link deleted successfully",
        });
      }

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete",
      });
    }
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === footerSections.length - 1) return;

    const newSections = [...footerSections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setFooterSections(newSections);
  };

  const handleMoveLink = (sectionId: string, linkIndex: number, direction: "up" | "down") => {
    setFooterSections(footerSections.map(section => {
      if (section.id !== sectionId) return section;

      const links = [...section.links];
      if (direction === "up" && linkIndex === 0) return section;
      if (direction === "down" && linkIndex === links.length - 1) return section;

      const targetIndex = direction === "up" ? linkIndex - 1 : linkIndex + 1;
      [links[linkIndex], links[targetIndex]] = [links[targetIndex], links[linkIndex]];

      return { ...section, links };
    }));
  };

  const handleOpenSectionDialog = (section?: FooterSection) => {
    if (section) {
      setEditingSection(section);
      setSectionFormData({
        title: section.title,
        sort_order: section.sort_order,
        active: section.active,
      });
    } else {
      setEditingSection(null);
      setSectionFormData({
        title: "",
        sort_order: footerSections.length,
        active: true,
      });
    }
    setErrors({});
    setIsSectionDialogOpen(true);
  };

  const handleCloseSectionDialog = () => {
    setIsSectionDialogOpen(false);
    setEditingSection(null);
    setSectionFormData({
      title: "",
      sort_order: 0,
      active: true,
    });
    setErrors({});
  };

  const handleOpenLinkDialog = (sectionId: string, link?: FooterLink) => {
    if (link) {
      setEditingLink({ sectionId, link });
      setLinkFormData({
        label: link.label,
        url: link.url,
        sort_order: link.sort_order,
        active: link.active,
      });
    } else {
      const section = footerSections.find(s => s.id === sectionId);
      setEditingLink({
        sectionId,
        link: {
          id: "",
          label: "",
          url: "",
          sort_order: section?.links.length || 0,
          active: true,
        },
      });
      setLinkFormData({
        label: "",
        url: "",
        sort_order: section?.links.length || 0,
        active: true,
      });
    }
    setErrors({});
    setIsLinkDialogOpen(true);
  };

  const handleCloseLinkDialog = () => {
    setIsLinkDialogOpen(false);
    setEditingLink(null);
    setLinkFormData({
      label: "",
      url: "",
      sort_order: 0,
      active: true,
    });
    setErrors({});
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <LoadingState message="Loading footer sections..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Footer Management</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage footer sections and links</p>
        </div>
        <Button onClick={() => handleOpenSectionDialog()} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#2d1816]">
              Footer Sections ({filteredSections.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1816]/40" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#e9ddd3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSections.length === 0 ? (
            <EmptyState
              title="No footer sections found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first footer section"}
              action={
                !searchQuery ? {
                  label: "Add Section",
                  onClick: () => handleOpenSectionDialog()
                } : undefined
              }
              icon={FolderOpen}
            />
          ) : (
            <div className="space-y-3">
              {filteredSections.map((section, sectionIndex) => (
                <Card key={section.id} className="border-[#e9ddd3]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSection(sectionIndex, "up")}
                          disabled={sectionIndex === 0}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSection(sectionIndex, "down")}
                          disabled={sectionIndex === filteredSections.length - 1}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSection(section.id)}
                        className="hover:bg-[#e9ddd3]/30"
                      >
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>

                      <div className="w-10 h-10 rounded-full bg-[#e9ddd3]/30 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-[#2d1816]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#2d1816]">
                            {section.title}
                          </h3>
                          {!section.active && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {section.links.length} links
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenLinkDialog(section.id)}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenSectionDialog(section)}
                          className="hover:bg-[#e9ddd3]/30"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm({ type: "section", id: section.id })}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedSections.has(section.id) && (
                      <div className="mt-4 ml-16 space-y-2">
                        {section.links.length === 0 ? (
                          <div className="text-center py-4 text-sm text-[#2d1816]/60">
                            No links in this section
                          </div>
                        ) : (
                          section.links.map((link, linkIndex) => (
                            <div
                              key={link.id}
                              className="flex items-center gap-3 p-3 bg-[#e9ddd3]/10 rounded-lg"
                            >
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveLink(section.id, linkIndex, "up")}
                                  disabled={linkIndex === 0}
                                  className="h-6 w-6 hover:bg-[#e9ddd3]/30"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveLink(section.id, linkIndex, "down")}
                                  disabled={linkIndex === section.links.length - 1}
                                  className="h-6 w-6 hover:bg-[#e9ddd3]/30"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                              </div>

                              <div className="w-8 h-8 rounded-full bg-[#fffdf8] flex items-center justify-center">
                                <LinkIcon className="w-4 h-4 text-[#2d1816]/60" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-[#2d1816] text-sm">
                                    {link.label}
                                  </span>
                                  {!link.active && (
                                    <Badge variant="outline" className="text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-[#2d1816]/60 truncate">
                                  {link.url}
                                </p>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.open(link.url, '_blank')}
                                  className="h-8 w-8 hover:bg-[#e9ddd3]/30"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenLinkDialog(section.id, link)}
                                  className="h-8 w-8 hover:bg-[#e9ddd3]/30"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteConfirm({ type: "link", id: link.id })}
                                  className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Dialog */}
      <Dialog open={isSectionDialogOpen} onOpenChange={handleCloseSectionDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">
              {editingSection ? "Edit Footer Section" : "Add Footer Section"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#2d1816]">
                Section Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={sectionFormData.title}
                onChange={(e) => {
                  setSectionFormData(prev => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                }}
                placeholder="e.g., Quick Links"
                className={`border-[#e9ddd3] ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-[#2d1816]">
                Sort Order
              </Label>
              <Input
                id="sort_order"
                type="number"
                value={sectionFormData.sort_order}
                onChange={(e) => setSectionFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="border-[#e9ddd3]"
              />
              <p className="text-xs text-[#2d1816]/60">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#e9ddd3] rounded-lg bg-[#fffdf8]">
              <Switch
                id="active"
                checked={sectionFormData.active}
                onCheckedChange={(checked) => setSectionFormData(prev => ({ ...prev, active: checked }))}
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
              onClick={handleCloseSectionDialog}
              disabled={saving}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveSection}
              disabled={saving}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] text-white hover:from-[#922821] hover:to-[#7a221b]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingSection ? "Update" : "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={handleCloseLinkDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">
              {editingLink?.link.id ? "Edit Footer Link" : "Add Footer Link"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-[#2d1816]">
                Link Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="label"
                value={linkFormData.label}
                onChange={(e) => {
                  setLinkFormData(prev => ({ ...prev, label: e.target.value }));
                  if (errors.label) setErrors(prev => ({ ...prev, label: "" }));
                }}
                placeholder="e.g., About Us"
                className={`border-[#e9ddd3] ${errors.label ? "border-red-500" : ""}`}
              />
              {errors.label && (
                <p className="text-sm text-red-500">{errors.label}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-[#2d1816]">
                URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                value={linkFormData.url}
                onChange={(e) => {
                  setLinkFormData(prev => ({ ...prev, url: e.target.value }));
                  if (errors.url) setErrors(prev => ({ ...prev, url: "" }));
                }}
                placeholder="https://example.com/about"
                className={`border-[#e9ddd3] ${errors.url ? "border-red-500" : ""}`}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_sort_order" className="text-[#2d1816]">
                Sort Order
              </Label>
              <Input
                id="link_sort_order"
                type="number"
                value={linkFormData.sort_order}
                onChange={(e) => setLinkFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="border-[#e9ddd3]"
              />
              <p className="text-xs text-[#2d1816]/60">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#e9ddd3] rounded-lg bg-[#fffdf8]">
              <Switch
                id="link_active"
                checked={linkFormData.active}
                onCheckedChange={(checked) => setLinkFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="link_active" className="text-[#2d1816] cursor-pointer">
                Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseLinkDialog}
              disabled={saving}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveLink}
              disabled={saving}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] text-white hover:from-[#922821] hover:to-[#7a221b]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingLink?.link.id ? "Update" : "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title={deleteConfirm?.type === "section" ? "Delete Footer Section?" : "Delete Footer Link?"}
        description={deleteConfirm?.type === "section" 
          ? "This action cannot be undone. This will permanently delete the section and all its links."
          : "This action cannot be undone. This will permanently delete the footer link."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
