"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { LoadingState } from "@/components/admin/loading-state";
import { ImageUpload } from "@/components/admin/image-upload";
import { PageHeader } from "@/components/admin/page-header";

interface Beneficiary {
  id: string;
  full_name: string;
  department?: string;
  level?: string;
  session?: string;
  programme?: string;
  photo?: string;
  bio?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
}

export default function EditBeneficiaryPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);

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

  useEffect(() => {
    const loadBeneficiary = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('beneficiaries')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single();
        // if (error) throw error;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual data from Supabase
        const mockBeneficiary: Beneficiary = {
          id: params.id as string,
          full_name: "Jane Smith",
          department: "Computer Science",
          level: "400 Level",
          session: "2024/2025",
          programme: "Scholarship Programme",
          photo: "https://example.com/photo.jpg",
          bio: "A dedicated student pursuing excellence in computer science.",
          status: "published",
          featured: true,
        };

        setBeneficiary(mockBeneficiary);
        setFormData({
          full_name: mockBeneficiary.full_name,
          department: mockBeneficiary.department || "",
          level: mockBeneficiary.level || "",
          session: mockBeneficiary.session || "",
          programme: mockBeneficiary.programme || "",
          photo: mockBeneficiary.photo || "",
          bio: mockBeneficiary.bio || "",
          status: mockBeneficiary.status,
          featured: mockBeneficiary.featured,
        });
      } catch (error) {
        console.error("Error loading beneficiary:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load beneficiary",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiary();
  }, [params.id, toast]);

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
      setSubmitting(true);

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('beneficiaries')
      //   .update({
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
      //   .eq('id', params.id)
      //   .select()
      //   .single();
      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Beneficiary updated successfully",
      });

      router.push("/admin/beneficiaries");
    } catch (error) {
      console.error("Error updating beneficiary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update beneficiary",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return <LoadingState message="Loading beneficiary..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Edit Beneficiary" subtitle="Update beneficiary information" backHref="/admin/beneficiaries" />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Beneficiary Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  className={`border-border ${errors.full_name ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.full_name && (
                  <p className="text-xs text-destructive" role="alert">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="e.g., Computer Science"
                  className={`border-border ${errors.department ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.department && (
                  <p className="text-xs text-destructive" role="alert">{errors.department}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="level">
                  Level <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  placeholder="e.g., 400 Level"
                  className={`border-border ${errors.level ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.level && (
                  <p className="text-xs text-destructive" role="alert">{errors.level}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="session">
                  Session <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="session"
                  value={formData.session}
                  onChange={(e) => handleInputChange("session", e.target.value)}
                  placeholder="e.g., 2024/2025"
                  className={`border-border ${errors.session ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.session && (
                  <p className="text-xs text-destructive" role="alert">{errors.session}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="programme">
                  Programme <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="programme"
                  value={formData.programme}
                  onChange={(e) => handleInputChange("programme", e.target.value)}
                  placeholder="e.g., Scholarship Programme"
                  className={`border-border ${errors.programme ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.programme && (
                  <p className="text-xs text-destructive" role="alert">{errors.programme}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={submitting}
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

            <div className="space-y-1.5">
              <Label htmlFor="bio">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Enter beneficiary bio..."
                rows={4}
                className="border-border resize-none"
                disabled={submitting}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
                disabled={submitting}
              />
              <Label htmlFor="featured" className="text-foreground cursor-pointer">
                Featured Beneficiary
              </Label>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                Cancel
              </Button>
              <Button variant="brand"
                type="submit"
                disabled={submitting}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Beneficiary"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
