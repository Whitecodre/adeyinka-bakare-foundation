"use client";

import { useState, useEffect } from "react";
import { Plus, ExternalLink, ArrowUp, ArrowDown, ChevronDown, ChevronRight, FolderOpen, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Footer Management"
        subtitle="Manage footer sections and links"
        actions={[{ label: "Add Section", onClick: () => handleOpenSectionDialog(), variant: "primary" }]}
      />

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Footer Sections ({filteredSections.length})
            </CardTitle>
            <Toolbar search={searchQuery} onSearchChange={setSearchQuery} placeholder="Search sections..." className="w-full sm:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListSkeleton rows={3} />
          ) : filteredSections.length === 0 ? (
            <EmptyState
              title="No footer sections found"
              description={searchQuery ? "Try a different search term" : "Get started by adding your first footer section"}
              action={!searchQuery ? { label: "Add Section", onClick: () => handleOpenSectionDialog() } : undefined}
              icon={FolderOpen}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredSections.map((section, sectionIndex) => {
                  const expanded = expandedSections.has(section.id);
                  return (
                    <ListRow
                      key={section.id}
                      index={sectionIndex}
                      leading={
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSection(section.id)}
                            aria-expanded={expanded}
                            aria-label={`${expanded ? "Collapse" : "Expand"} ${section.title}`}
                          >
                            {expanded ? <ChevronDown /> : <ChevronRight />}
                          </Button>
                          <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                            <FolderOpen className="size-5" />
                          </div>
                        </div>
                      }
                      title={section.title}
                      badges={
                        <>
                          {!section.active && <StatusBadge status="inactive" />}
                          <Badge variant="muted">{section.links.length} links</Badge>
                        </>
                      }
                      actions={
                        <RowActions
                          name={section.title}
                          onEdit={() => handleOpenSectionDialog(section)}
                          onDelete={() => setDeleteConfirm({ type: "section", id: section.id })}
                          extra={[
                            { label: "Add link", icon: Plus, onSelect: () => handleOpenLinkDialog(section.id) },
                            { label: "Move up", icon: ArrowUp, onSelect: () => handleMoveSection(sectionIndex, "up"), disabled: sectionIndex === 0 },
                            { label: "Move down", icon: ArrowDown, onSelect: () => handleMoveSection(sectionIndex, "down"), disabled: sectionIndex === filteredSections.length - 1 },
                          ]}
                        />
                      }
                    >
                      {expanded && (
                        <div className="mt-4 space-y-2 border-t border-border pt-4 sm:ml-14">
                          {section.links.length === 0 ? (
                            <p className="py-3 text-center text-sm text-muted-foreground">No links in this section</p>
                          ) : (
                            section.links.map((link, linkIndex) => (
                              <div key={link.id} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-muted-foreground">
                                  <LinkIcon className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{link.label}</span>
                                    {!link.active && <StatusBadge status="inactive" />}
                                  </div>
                                  <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                                </div>
                                <RowActions
                                  name={link.label}
                                  onEdit={() => handleOpenLinkDialog(section.id, link)}
                                  onDelete={() => setDeleteConfirm({ type: "link", id: link.id })}
                                  extra={[
                                    { label: "Move up", icon: ArrowUp, onSelect: () => handleMoveLink(section.id, linkIndex, "up"), disabled: linkIndex === 0 },
                                    { label: "Move down", icon: ArrowDown, onSelect: () => handleMoveLink(section.id, linkIndex, "down"), disabled: linkIndex === section.links.length - 1 },
                                    { label: "Open link", icon: ExternalLink, onSelect: () => window.open(link.url, "_blank") },
                                  ]}
                                />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </ListRow>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <FormDialog
        open={isSectionDialogOpen}
        onOpenChange={(open) => (open ? undefined : handleCloseSectionDialog())}
        title={editingSection ? "Edit Footer Section" : "Add Footer Section"}
        description="A group of links shown together in the site footer."
        submitLabel={editingSection ? "Update" : "Add"}
        submitting={saving}
        onSubmit={handleSaveSection}
      >
        <FormField label="Section Title" htmlFor="title" required error={errors.title}>
          <Input
            id="title"
            value={sectionFormData.title}
            onChange={(e) => {
              setSectionFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="e.g., Quick Links"
            aria-invalid={!!errors.title}
          />
        </FormField>
        <FormField label="Sort Order" htmlFor="sort_order" hint="Lower numbers appear first.">
          <Input
            id="sort_order"
            type="number"
            value={sectionFormData.sort_order}
            onChange={(e) => setSectionFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />
        </FormField>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
          <Switch
            id="active"
            checked={sectionFormData.active}
            onCheckedChange={(checked) => setSectionFormData((prev) => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active
          </Label>
        </div>
      </FormDialog>

      <FormDialog
        open={isLinkDialogOpen}
        onOpenChange={(open) => (open ? undefined : handleCloseLinkDialog())}
        title={editingLink?.link.id ? "Edit Footer Link" : "Add Footer Link"}
        description="Where this link goes and how it is labelled."
        submitLabel={editingLink?.link.id ? "Update" : "Add"}
        submitting={saving}
        onSubmit={handleSaveLink}
      >
        <FormField label="Link Label" htmlFor="label" required error={errors.label}>
          <Input
            id="label"
            value={linkFormData.label}
            onChange={(e) => {
              setLinkFormData((prev) => ({ ...prev, label: e.target.value }));
              if (errors.label) setErrors((prev) => ({ ...prev, label: "" }));
            }}
            placeholder="e.g., About Us"
            aria-invalid={!!errors.label}
          />
        </FormField>
        <FormField label="URL" htmlFor="url" required error={errors.url}>
          <Input
            id="url"
            inputMode="url"
            value={linkFormData.url}
            onChange={(e) => {
              setLinkFormData((prev) => ({ ...prev, url: e.target.value }));
              if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
            }}
            placeholder="https://example.com/about"
            aria-invalid={!!errors.url}
          />
        </FormField>
        <FormField label="Sort Order" htmlFor="link_sort_order" hint="Lower numbers appear first.">
          <Input
            id="link_sort_order"
            type="number"
            value={linkFormData.sort_order}
            onChange={(e) => setLinkFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />
        </FormField>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
          <Switch
            id="link_active"
            checked={linkFormData.active}
            onCheckedChange={(checked) => setLinkFormData((prev) => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="link_active" className="cursor-pointer">
            Active
          </Label>
        </div>
      </FormDialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title={deleteConfirm?.type === "section" ? "Delete Footer Section?" : "Delete Footer Link?"}
        description={
          deleteConfirm?.type === "section"
            ? "This action cannot be undone. This will permanently delete the section and all its links."
            : "This action cannot be undone. This will permanently delete the footer link."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </div>
  );
}
