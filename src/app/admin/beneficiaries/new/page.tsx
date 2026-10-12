"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/image-upload";

export default function NewBeneficiaryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    level: "",
    session: "",
    programme: "",
    photo: "",
    bio: "",
    status: "draft",
    featured: false,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.level.trim()) {
      newErrors.level = "Level is required";
    }

    if (!formData.session.trim()) {
      newErrors.session = "Session is required";
    }

    if (!formData.programme.trim()) {
      newErrors.programme = "Programme is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('beneficiaries')
      //   .insert({
      //     full_name: formData.full_name,
      //     department: formData.department,
      //     level: formData.level,
      //     session: formData.session,
      //     programme: formData.programme,
      //     photo: formData.photo,
      //     bio: formData.bio,
      //     status: formData.status,
      //     featured: formData.featured,
      //   })
      //   .select()
      //   .single();

      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Beneficiary created successfully",
      });

      router.push("/admin/beneficiaries");
    } catch (error) {
      console.error("Error creating beneficiary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create beneficiary",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground m-0">Add New Beneficiary</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create a new fellowship beneficiary</p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Beneficiary Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  className={`border-border ${errors.full_name ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-foreground">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="e.g., Computer Science"
                  className={`border-border ${errors.department ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-foreground">
                  Level <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  placeholder="e.g., 400 Level"
                  className={`border-border ${errors.level ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.level && (
                  <p className="text-sm text-destructive">{errors.level}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="session" className="text-foreground">
                  Session <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="session"
                  value={formData.session}
                  onChange={(e) => handleInputChange("session", e.target.value)}
                  placeholder="e.g., 2024/2025"
                  className={`border-border ${errors.session ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.session && (
                  <p className="text-sm text-destructive">{errors.session}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="programme" className="text-foreground">
                  Programme <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="programme"
                  value={formData.programme}
                  onChange={(e) => handleInputChange("programme", e.target.value)}
                  placeholder="e.g., Scholarship Programme"
                  className={`border-border ${errors.programme ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {errors.programme && (
                  <p className="text-sm text-destructive">{errors.programme}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload
              value={formData.photo}
              onChange={(value) => handleInputChange("photo", value)}
              label="Photo"
              bucket="public-images"
              folder="beneficiaries"
              maxSize={5 * 1024 * 1024}
              accept="image/*"
            />

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Enter beneficiary bio..."
                rows={4}
                className="border-border resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={loading}
              />
              <Label htmlFor="featured" className="text-foreground cursor-pointer">
                Featured Beneficiary
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-linear-to-r from-maroon-500 to-maroon-600 text-white hover:from-maroon-600 hover:to-maroon-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Beneficiary"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
