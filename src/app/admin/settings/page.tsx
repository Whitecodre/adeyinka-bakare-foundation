"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, MessageSquare, Image as ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/admin/loading-state";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/admin/page-header";

interface Settings {
  id?: string;
  site_name: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  updated_at?: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    site_name: "",
    tagline: "",
    logo: "",
    favicon: "",
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/settings");
        const result = await response.json();

        if (result.success) {
          // Convert null values to empty strings for controlled inputs
          const loadedSettings = {
            site_name: result.data.site_name || "",
            tagline: result.data.tagline || "",
            logo: result.data.logo || "",
            favicon: result.data.favicon || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
            address: result.data.address || "",
            whatsapp: result.data.whatsapp || "",
          };
          setSettings(loadedSettings);
          if (loadedSettings.logo) setLogoPreview(loadedSettings.logo);
          if (loadedSettings.favicon) setFaviconPreview(loadedSettings.favicon);
        } else {
          throw new Error(result.error || "Failed to load settings");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);

      console.log("Current settings state before save:", settings);

      // Only send the fields that should be updated, not database metadata
      const payload = {
        site_name: settings.site_name,
        tagline: settings.tagline || undefined,
        logo: settings.logo || undefined,
        favicon: settings.favicon || undefined,
        email: settings.email || undefined,
        phone: settings.phone || undefined,
        address: settings.address || undefined,
        whatsapp: settings.whatsapp || undefined,
      };

      console.log("Saving settings payload:", payload);

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      console.log("Save settings response:", result);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'favicon') => {
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Only PNG, JPG, and WEBP images are supported",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Error", description: "Image must be less than 5MB" });
      return;
    }

    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingFavicon;
    const setPreview = type === 'logo' ? setLogoPreview : setFaviconPreview;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "image");
      formDataUpload.append("bucket", "logo-assets");

      console.log(`Uploading ${type}...`);

      const res = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();

      console.log(`${type} upload response:`, data);

      if (!data.success) throw new Error(data.error);

      const storageUrl = data.data.url;
      console.log(`Setting ${type} to:`, storageUrl);

      setSettings(prev => {
        const updated = { ...prev, [type]: storageUrl };
        console.log("Updated settings state:", updated);
        return updated;
      });
      setPreview(URL.createObjectURL(file));
      toast({ title: "Success", description: `${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully` });
    } catch (error: any) {
      console.error(`${type} upload error:`, error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to upload image" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (type: 'logo' | 'favicon') => {
    setSettings(prev => ({ ...prev, [type]: undefined }));
    if (type === 'logo') setLogoPreview(null);
    else setFaviconPreview(null);
  };

  if (loading) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Settings"
        subtitle="Manage site configuration"
        actions={[{ label: saving ? "Saving..." : "Save Changes", icon: Save, onClick: handleSave, loading: saving, variant: "primary" }]}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {/* General Settings */}
        <Card className="border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-foreground">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleInputChange("site_name", e.target.value)}
                  placeholder="Enter site name"
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-foreground">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  placeholder="Enter site tagline"
                  className="border-border"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Logo
                </Label>
                <div className="flex items-start gap-3">
                  {logoPreview ? (
                    <div className="relative h-16 w-16 shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-16 w-16 rounded-lg object-cover border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleRemoveImage('logo')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                      disabled={uploadingLogo}
                      className="border-border"
                    />
                    {/* {settings.logo && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {settings.logo}
                      </p>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon" className="text-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Favicon
                </Label>
                <div className="flex items-start gap-3">
                  {faviconPreview ? (
                    <div className="relative h-16 w-16 shrink-0">
                      <img
                        src={faviconPreview}
                        alt="Favicon preview"
                        className="h-16 w-16 rounded-lg object-cover border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleRemoveImage('favicon')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'favicon')}
                      disabled={uploadingFavicon}
                      className="border-border"
                    />
                    {/* {settings.favicon && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {settings.favicon}
                      </p> */}
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp ?? ""}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="Enter WhatsApp number"
                className="border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter physical address"
                className="border-border min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
