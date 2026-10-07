"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Save,
  Eye,
  X,
  Plus,
  Loader2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
  Link as LinkIcon,
  Heading,
  MousePointer2,
  Type,
  Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  featured: boolean;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  authorName: string;
  coverImage: string;
  schemaType: "Article" | "BlogPosting" | "NewsArticle" | "None";
}

export default function NewNewsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    status: "draft",
    featured: false,
    tags: [],
    seoTitle: "",
    seoDescription: "",
    authorName: "",
    coverImage: "",
    schemaType: "Article",
  });

  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showCtaDialog, setShowCtaDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [imageSizeOption, setImageSizeOption] = useState<"small" | "medium" | "large" | "full">("medium");
  const [selectedImageForInsert, setSelectedImageForInsert] = useState<string | null>(null);
  const [selectedFontFamily, setSelectedFontFamily] = useState<string>("default");
  const [selectedFontSize, setSelectedFontSize] = useState<string>("default");
  const [selectedTextColor, setSelectedTextColor] = useState<string>("#2d1816");

  const contentRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const contentIsEmpty = !formData.content || formData.content === "<p><br></p>" || formData.content === "";

  // Rich text editor commands
  const exec = (command: string, value?: string) => {
    contentRef.current?.focus();
    try {
      document.execCommand(command, false, value || undefined);
    } catch (e) {
      console.error("Command failed:", command, e);
    }
    updateContent();
  };

  // Apply font family
  const applyFontFamily = (fontFamily: string) => {
    contentRef.current?.focus();
    restoreSelection();

    const fontMap: { [key: string]: string } = {
      "default": "inherit",
      "sans-serif": "Arial, Helvetica, sans-serif",
      "serif": "Georgia, Times New Roman, serif",
      "monospace": "Courier New, monospace",
      "georgia": "Georgia, serif",
      "times": "Times New Roman, serif",
      "arial": "Arial, sans-serif",
      "verdana": "Verdana, sans-serif",
      "courier": "Courier New, monospace",
    };

    const font = fontMap[fontFamily] || fontFamily;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (range.toString().length > 0) {
        const span = document.createElement("span");
        span.style.fontFamily = font;
        range.surroundContents(span);
      } else {
        document.execCommand("fontName", false, font);
      }
    } else {
      document.execCommand("fontName", false, font);
    }

    setSelectedFontFamily(fontFamily);
    updateContent();
  };

  // Apply font size
  const applyFontSize = (size: string) => {
    contentRef.current?.focus();
    restoreSelection();

    const sizeMap: { [key: string]: { size: string; css: string } } = {
      "default": { size: "3", css: "inherit" },
      "small": { size: "2", css: "0.875rem" },
      "normal": { size: "3", css: "1rem" },
      "large": { size: "4", css: "1.25rem" },
      "xlarge": { size: "5", css: "1.5rem" },
      "xxlarge": { size: "6", css: "2rem" },
    };

    const fontSize = sizeMap[size] || { size: "3", css: "1rem" };

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (range.toString().length > 0) {
        const span = document.createElement("span");
        span.style.fontSize = fontSize.css;
        range.surroundContents(span);
      } else {
        document.execCommand("fontSize", false, fontSize.size);
      }
    } else {
      document.execCommand("fontSize", false, fontSize.size);
    }

    setSelectedFontSize(size);
    updateContent();
  };

  // Apply text color
  const applyTextColor = (color: string) => {
    contentRef.current?.focus();
    restoreSelection();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (range.toString().length > 0) {
        const span = document.createElement("span");
        span.style.color = color;
        range.surroundContents(span);
      } else {
        document.execCommand("foreColor", false, color);
      }
    } else {
      document.execCommand("foreColor", false, color);
    }

    setSelectedTextColor(color);
    updateContent();
  };

  const updateContent = () => {
    const html = contentRef.current?.innerHTML || "";
    setFormData((prev) => ({ ...prev, content: html }));
  };

  // Save/restore selection for dialogs
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (!sel || !savedSelectionRef.current) return;
    sel.removeAllRanges();
    sel.addRange(savedSelectionRef.current);
  };

  // Insert HTML at cursor position
  const insertAtCursor = (html: string) => {
    const el = contentRef.current;
    if (!el) return;

    el.focus();
    restoreSelection();

    try {
      document.execCommand("insertHTML", false, html);
    } catch (e) {
      el.innerHTML += html;
    }

    savedSelectionRef.current = null;
    updateContent();
  };

  // Image insertion
  const handleImageInsert = () => {
    if (!selectedImageForInsert) return;

    const sizeClasses = {
      small: "max-w-[25%]",
      medium: "max-w-[50%]",
      large: "max-w-[75%]",
      full: "max-w-full",
    };
    const sizeClass = sizeClasses[imageSizeOption];

    const html = `<img src="${selectedImageForInsert}" alt="${imageAltText || "Image"}" class="${sizeClass} h-auto rounded mx-auto" style="width: 100%" />`;
    insertAtCursor(html);

    setShowImageDialog(false);
    setSelectedImageForInsert(null);
    setImageAltText("");
    setImageSizeOption("medium");
  };

  // Link insertion
  const handleLinkInsert = () => {
    const html = linkText
      ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#aa322b] underline hover:text-[#922821]">${linkText}</a>`
      : `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#aa322b] underline hover:text-[#922821]">${linkUrl}</a>`;

    insertAtCursor(html);
    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkText("");
  };

  // CTA button insertion
  const handleCtaInsert = () => {
    const html = `<a href="${ctaUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#aa322b] to-[#922821] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-[#922821] hover:to-[#73201c]">${ctaText}</a>`;
    insertAtCursor(html);
    setShowCtaDialog(false);
    setCtaText("");
    setCtaUrl("");
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  // Calculate reading time (approx 200 words per minute)
  const calculateReadingTime = () => {
    const words = formData.content.split(/\s+/).filter((word) => word.length > 0).length;
    return Math.ceil(words / 200);
  };

  // Form submission
  const handleSubmit = async (status: "draft" | "published") => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase save
      // const { data, error } = await supabase.from('news').insert({
      //   ...formData,
      //   status,
      //   reading_time: calculateReadingTime(),
      // }).select().single();
      // if (error) throw error;

      toast({
        title: status === "published" ? "News published" : "Draft saved",
        description: `Successfully ${status === "published" ? "published" : "saved as draft"}.`,
      });
      router.push("/admin/news");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save news article",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Paste cleanup function to strip inline styles and neutralize formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    updateContent();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contentRef.current || document.activeElement !== contentRef.current) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        exec("bold");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        exec("italic");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        exec("underline");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        saveSelection();
        setShowLinkDialog(true);
        setLinkUrl("");
        setLinkText("");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        exec("formatBlock", "H1");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        e.preventDefault();
        exec("formatBlock", "H2");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "3") {
        e.preventDefault();
        exec("formatBlock", "H3");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create News Article"
        subtitle="Write and publish a news article"
        backHref="/admin/news"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-[#fffdf8] border-[#e9ddd3]">
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                    }))
                  }
                  placeholder="Enter news article title..."
                  className="text-lg font-['Libre_Baskerville'] border-[#e9ddd3]"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-+|-+$/g, ""),
                    }))
                  }
                  placeholder="clean-url-slug"
                  className="border-[#e9ddd3]"
                />
                <p className="text-xs text-[#2d1816]/60 mt-1">
                  Auto-generated from title. Edit for keywords if needed.
                </p>
              </div>

              {/* Author Name */}
              <div>
                <Label htmlFor="authorName">Author Name (optional)</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Author name if different from admin"
                  className="border-[#e9ddd3]"
                />
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 border border-[#e9ddd3] rounded-lg bg-[#f8f2e8]/30 overflow-x-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("bold")}
                  title="Bold (Ctrl+B)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("italic")}
                  title="Italic (Ctrl+I)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("underline")}
                  title="Underline (Ctrl+U)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <span className="w-px h-6 bg-[#e9ddd3] mx-1 flex-shrink-0" />

                {/* Font Family Selector */}
                <div className="relative flex-shrink-0">
                  <Select value={selectedFontFamily} onValueChange={applyFontFamily}>
                    <SelectTrigger className="h-8 w-[100px] sm:w-[140px] text-xs border-[#e9ddd3]">
                      <Type className="h-3 w-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="sans-serif">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                      <SelectItem value="georgia">Georgia</SelectItem>
                      <SelectItem value="times">Times New Roman</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="verdana">Verdana</SelectItem>
                      <SelectItem value="courier">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size Selector */}
                <div className="relative flex-shrink-0">
                  <Select value={selectedFontSize} onValueChange={applyFontSize}>
                    <SelectTrigger className="h-8 w-[80px] sm:w-[100px] text-xs border-[#e9ddd3]">
                      <span className="text-xs">Size</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xlarge">X-Large</SelectItem>
                      <SelectItem value="xxlarge">XX-Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Color Picker */}
                <div className="relative flex items-center flex-shrink-0">
                  <input
                    type="color"
                    value={selectedTextColor}
                    onChange={(e) => applyTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    title="Text Color"
                  />
                  <Palette className="h-4 w-4 absolute pointer-events-none text-[#2d1816]" />
                </div>

                <span className="w-px h-6 bg-[#e9ddd3] mx-1 flex-shrink-0" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveSelection();
                    setShowImageDialog(true);
                  }}
                  title="Insert Image"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveSelection();
                    setShowLinkDialog(true);
                    setLinkUrl("");
                    setLinkText("");
                  }}
                  title="Insert Link (Ctrl+K)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveSelection();
                    setShowCtaDialog(true);
                    setCtaText("");
                    setCtaUrl("");
                  }}
                  title="Insert CTA Button"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <MousePointer2 className="h-4 w-4" />
                </Button>
                <span className="w-px h-6 bg-[#e9ddd3] mx-1 flex-shrink-0" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("formatBlock", "H1")}
                  title="Heading 1 (Ctrl+1)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Heading className="h-4 w-4" />
                  <span className="text-[10px]">1</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("formatBlock", "H2")}
                  title="Heading 2 (Ctrl+2)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Heading className="h-4 w-4" />
                  <span className="text-[10px]">2</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("formatBlock", "H3")}
                  title="Heading 3 (Ctrl+3)"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <Heading className="h-4 w-4" />
                  <span className="text-[10px]">3</span>
                </Button>
                <span className="w-px h-6 bg-[#e9ddd3] mx-1 flex-shrink-0" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("justifyLeft")}
                  title="Align Left"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("justifyCenter")}
                  title="Align Center"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("justifyRight")}
                  title="Align Right"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => exec("justifyFull")}
                  title="Justify"
                  className="flex-shrink-0 hover:bg-[#e9ddd3]/30"
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>

              {/* Content Editor */}
              <div>
                <Label>Content</Label>
                <div className="relative border border-[#e9ddd3] rounded-md overflow-hidden">
                  <div
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={updateContent}
                    onKeyUp={updateContent}
                    onPaste={handlePaste}
                    className="min-h-[400px] p-4 text-[#2d1816] max-w-none focus:outline-none focus:ring-1 focus:ring-[#aa322b] text-base bg-[#fffdf8]"
                  />
                  {contentIsEmpty && (
                    <div className="absolute top-4 left-4 text-[#2d1816]/40 pointer-events-none select-none text-sm">
                      Write your news article content here...
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description for preview..."
                  className="min-h-[100px] resize-none border-[#e9ddd3]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* News Settings */}
          <Card className="bg-[#fffdf8] border-[#e9ddd3]">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d1816]">Publish Settings</h3>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger id="status" className="border-[#e9ddd3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-xs text-[#2d1816]/60">Show on homepage</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
              </div>

              {/* Schema Type */}
              <div>
                <Label htmlFor="schemaType">Schema Type</Label>
                <Select
                  value={formData.schemaType}
                  onValueChange={(value: "Article" | "BlogPosting" | "NewsArticle" | "None") =>
                    setFormData((prev) => ({ ...prev, schemaType: value }))
                  }
                >
                  <SelectTrigger id="schemaType" className="border-[#e9ddd3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                    <SelectItem value="NewsArticle">News Article</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cover Image */}
              <ImageUpload
                value={formData.coverImage}
                onChange={(value) => setFormData((prev) => ({ ...prev, coverImage: value }))}
                label="Cover Image URL"
                bucket="public-images"
                folder="news"
                maxSize={10 * 1024 * 1024}
                accept="image/*"
              />
            </div>
          </Card>

          {/* Tags */}
          <Card className="bg-[#fffdf8] border-[#e9ddd3]">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d1816]">Tags</h3>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="border-[#e9ddd3]"
                />
                <Button type="button" onClick={addTag} variant="outline" className="border-[#e9ddd3]">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-[#e9ddd3]/30 text-[#2d1816] border-[#e9ddd3]">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-[#aa322b]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card className="bg-[#fffdf8] border-[#e9ddd3]">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d1816]">SEO</h3>
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="SEO meta title"
                  className="border-[#e9ddd3]"
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="SEO meta description"
                  rows={3}
                  className="resize-none border-[#e9ddd3]"
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={isLoading}
              className="flex-1 border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("published")}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={selectedImageForInsert || ""}
                onChange={(e) => setSelectedImageForInsert(e.target.value)}
                placeholder="https://..."
                className="border-[#e9ddd3]"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={imageAltText}
                onChange={(e) => setImageAltText(e.target.value)}
                placeholder="Image description"
                className="border-[#e9ddd3]"
              />
            </div>
            <div>
              <Label htmlFor="imageSize">Size</Label>
              <Select value={imageSizeOption} onValueChange={(value: any) => setImageSizeOption(value)}>
                <SelectTrigger id="imageSize" className="border-[#e9ddd3]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (25%)</SelectItem>
                  <SelectItem value="medium">Medium (50%)</SelectItem>
                  <SelectItem value="large">Large (75%)</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowImageDialog(false)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleImageInsert}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="border-[#e9ddd3]"
              />
            </div>
            <div>
              <Label htmlFor="linkText">Link Text (optional)</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Leave empty to use URL as text"
                className="border-[#e9ddd3]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLinkDialog(false)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleLinkInsert}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CTA Dialog */}
      <Dialog open={showCtaDialog} onOpenChange={setShowCtaDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Insert CTA Button</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g., Learn More"
                className="border-[#e9ddd3]"
              />
            </div>
            <div>
              <Label htmlFor="ctaUrl">Button URL</Label>
              <Input
                id="ctaUrl"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://..."
                className="border-[#e9ddd3]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCtaDialog(false)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCtaInsert}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
