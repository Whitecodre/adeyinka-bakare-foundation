"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/admin/loading-state";
import { PageHeader } from "@/components/admin/page-header";

interface Member {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  level?: string;
  session?: string;
  status: "active" | "inactive" | "graduated" | "archived";
  joined_at?: string;
  photo?: string;
}

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [member, setMember] = useState<Member | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    level: "",
    session: "",
    status: "active",
    joined_at: "",
    photo: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/members/${params.id}`);
        const j = await res.json();
        if (!j.success) throw new Error(j.error || "Failed to load member");
        const data: Member = j.data;
        setMember(data);
        setFormData({
          full_name: data.full_name,
          email: data.email || "",
          phone: data.phone || "",
          department: data.department || "",
          level: data.level || "",
          session: data.session || "",
          status: data.status,
          joined_at: data.joined_at ? data.joined_at.slice(0,10) : "",
          photo: data.photo || "",
        });
        if (data.photo) {
          setImagePreview(data.photo);
        }
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message || "Failed to load member" });
      } finally {
        setLoading(false);
      }
    };
    loadMember();
  }, [params.id, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.level) {
      newErrors.level = "Level is required";
    }

    if (!formData.session) {
      newErrors.session = "Session is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Error", description: "Image must be less than 5MB" });
      return;
    }

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, type: "image" }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      // Upload to Supabase Storage
      const uploadRes = await fetch(data.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");

      setFormData(prev => ({ ...prev, photo: data.data.storagePath }));
      setImagePreview(URL.createObjectURL(file));
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, photo: "" }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/admin/members/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          level: formData.level,
          session: formData.session,
          status: formData.status,
          joined_at: formData.joined_at || null,
          photo: formData.photo || null,
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Failed to update member");
      toast({ title: "Success", description: "Member updated successfully" });
      router.push("/admin/members");
      router.refresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update member" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return <LoadingState message="Loading member..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Edit Member" subtitle="Update member information" backHref="/admin/members" />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Member Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-1.5">
              <Label htmlFor="photo">Photo</Label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={submitting || uploadingImage}
                    className="border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a photo (max 5MB)
                  </p>
                </div>
              </div>
            </div>

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
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="member@example.com"
                  className={`border-border ${errors.email ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.email && (
                  <p className="text-xs text-destructive" role="alert">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                  className={`border-border ${errors.phone ? "border-destructive" : ""}`}
                  disabled={submitting}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive" role="alert">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                    <SelectItem value="Network Engineering">Network Engineering</SelectItem>
                    <SelectItem value="Information Systems">Information Systems</SelectItem>
                    <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Electronics Engineering">Electronics Engineering</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Statistics">Statistics</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Accounting">Accounting</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Mass Communication">Mass Communication</SelectItem>
                    <SelectItem value="Library Science">Library Science</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-xs text-destructive" role="alert">{errors.department}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="level">
                  Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                    <SelectItem value="500">500 Level</SelectItem>
                    <SelectItem value="600">600 Level</SelectItem>
                    <SelectItem value="700">700 Level</SelectItem>
                    <SelectItem value="800">800 Level</SelectItem>
                    <SelectItem value="PGD">Postgraduate Diploma</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-xs text-destructive" role="alert">{errors.level}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="session">
                  Session <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.session}
                  onValueChange={(value) => handleInputChange("session", value)}
                  disabled={submitting}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                    <SelectItem value="2026/2027">2026/2027</SelectItem>
                    <SelectItem value="2027/2028">2027/2028</SelectItem>
                    <SelectItem value="2028/2029">2028/2029</SelectItem>
                    <SelectItem value="2029/2030">2029/2030</SelectItem>
                    <SelectItem value="2030/2031">2030/2031</SelectItem>
                    <SelectItem value="2031/2032">2031/2032</SelectItem>
                    <SelectItem value="2032/2033">2032/2033</SelectItem>
                    <SelectItem value="2033/2034">2033/2034</SelectItem>
                    <SelectItem value="2034/2035">2034/2035</SelectItem>
                  </SelectContent>
                </Select>
                {errors.session && (
                  <p className="text-xs text-destructive" role="alert">{errors.session}</p>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="joined_at">
                  Joined Date
                </Label>
                <Input
                  id="joined_at"
                  type="date"
                  value={formData.joined_at}
                  onChange={(e) => handleInputChange("joined_at", e.target.value)}
                  className="border-border"
                  disabled={submitting}
                />
              </div>
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
                  "Update Member"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
