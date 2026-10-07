"use client";

import { useState, useEffect } from "react";
import { Search, Save, Loader2, Globe, Mail, Phone, MapPin, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/admin/loading-state";
import { useToast } from "@/hooks/use-toast";

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
    // TODO: Replace with actual Supabase query
    const loadSettings = async () => {
      try {
        setLoading(true);
        // const { data, error } = await supabase.from('settings').select('*').single()
        // if (error) throw error
        // if (data) setSettings(data)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSettings({
          site_name: "Adeyinka Bakare Foundation",
          tagline: "Empowering Futures, Transforming Lives",
          email: "info@abf.org",
          phone: "+234 800 000 0000",
          address: "123 Foundation Road, Lagos, Nigeria",
          whatsapp: "+234 800 000 0000",
        });
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
      // TODO: Replace with actual Supabase upsert
      // const { error } = await supabase.from('settings').upsert(settings)
      // if (error) throw error
      
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Settings</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Manage site configuration</p>
        </div>
        <Button onClick={handleSave} size="lg" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* General Settings */}
        <Card className="border-[#e9ddd3] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-[#2d1816]">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  placeholder="Enter site name"
                  className="border-[#e9ddd3]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-[#2d1816]">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="Enter site tagline"
                  className="border-[#e9ddd3]"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-[#2d1816] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  value={settings.logo || ""}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  placeholder="Enter logo URL"
                  className="border-[#e9ddd3]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon" className="text-[#2d1816] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Favicon URL
                </Label>
                <Input
                  id="favicon"
                  value={settings.favicon || ""}
                  onChange={(e) => handleChange("favicon", e.target.value)}
                  placeholder="Enter favicon URL"
                  className="border-[#e9ddd3]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-[#e9ddd3]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2d1816]">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email address"
                className="border-[#e9ddd3]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#2d1816] flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="border-[#e9ddd3]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-[#2d1816] flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp || ""}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="Enter WhatsApp number"
                className="border-[#e9ddd3]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-[#e9ddd3]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#2d1816]">Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter physical address"
                className="border-[#e9ddd3] min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Card */}
      <Card className="border-[#e9ddd3] bg-[#faf7f2]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816]">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Site Name</Badge>
              <span className="text-[#2d1816]">{settings.site_name || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Tagline</Badge>
              <span className="text-[#2d1816]">{settings.tagline || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Email</Badge>
              <span className="text-[#2d1816]">{settings.email || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Phone</Badge>
              <span className="text-[#2d1816]">{settings.phone || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">WhatsApp</Badge>
              <span className="text-[#2d1816]">{settings.whatsapp || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f8c84d] text-[#2d1816] border-[#f8c84d]">Address</Badge>
              <span className="text-[#2d1816]">{settings.address || "Not set"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
