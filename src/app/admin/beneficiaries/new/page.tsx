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
          className="hover:bg-[#e9ddd3]/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Add New Beneficiary</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Create a new fellowship beneficiary</p>
        </div>
      </div>

      <Card className="border-[#e9ddd3] bg-[#fffdf8]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816]">
            Beneficiary Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-[#2d1816]">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  className={`border-[#e9ddd3] ${errors.full_name ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-[#2d1816]">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="e.g., Computer Science"
                  className={`border-[#e9ddd3] ${errors.department ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-[#2d1816]">
                  Level <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  placeholder="e.g., 400 Level"
                  className={`border-[#e9ddd3] ${errors.level ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="session" className="text-[#2d1816]">
                  Session <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="session"
                  value={formData.session}
                  onChange={(e) => handleInputChange("session", e.target.value)}
                  placeholder="e.g., 2024/2025"
                  className={`border-[#e9ddd3] ${errors.session ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.session && (
                  <p className="text-sm text-red-500">{errors.session}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="programme" className="text-[#2d1816]">
                  Programme <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="programme"
                  value={formData.programme}
                  onChange={(e) => handleInputChange("programme", e.target.value)}
                  placeholder="e.g., Scholarship Programme"
                  className={`border-[#e9ddd3] ${errors.programme ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.programme && (
                  <p className="text-sm text-red-500">{errors.programme}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#2d1816]">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="border-[#e9ddd3]">
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
              <Label htmlFor="bio" className="text-[#2d1816]">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Enter beneficiary bio..."
                rows={4}
                className="border-[#e9ddd3] resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3 p-4 border border-[#e9ddd3] rounded-lg bg-[#fffdf8]">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={loading}
              />
              <Label htmlFor="featured" className="text-[#2d1816] cursor-pointer">
                Featured Beneficiary
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#e9ddd3]">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#aa322b] to-[#922821] text-white hover:from-[#922821] hover:to-[#7a221b]"
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
