"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
          setSettings(result.data);
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
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await response.json();

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
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  placeholder="Enter site name"
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-foreground">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="Enter site tagline"
                  className="border-border"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  value={settings.logo || ""}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  placeholder="Enter logo URL"
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon" className="text-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Favicon URL
                </Label>
                <Input
                  id="favicon"
                  value={settings.favicon || ""}
                  onChange={(e) => handleChange("favicon", e.target.value)}
                  placeholder="Enter favicon URL"
                  className="border-border"
                />
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
                onChange={(e) => handleChange("email", e.target.value)}
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
                onChange={(e) => handleChange("phone", e.target.value)}
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
                value={settings.whatsapp || ""}
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
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter physical address"
                className="border-border min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Card */}
      <Card className="border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-gold-300 text-foreground border-gold-300">Site Name</Badge>
              <span className="text-foreground">{settings.site_name || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gold-300 text-foreground border-gold-300">Tagline</Badge>
              <span className="text-foreground">{settings.tagline || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gold-300 text-foreground border-gold-300">Email</Badge>
              <span className="text-foreground">{settings.email || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gold-300 text-foreground border-gold-300">Phone</Badge>
              <span className="text-foreground">{settings.phone || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gold-300 text-foreground border-gold-300">WhatsApp</Badge>
              <span className="text-foreground">{settings.whatsapp || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gold-300 text-foreground border-gold-300">Address</Badge>
              <span className="text-foreground">{settings.address || "Not set"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
