"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  });

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('members')
        //   .select('*')
        //   .eq('id', params.id)
        //   .single();
        // if (error) throw error;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual data from Supabase
        const mockMember: Member = {
          id: params.id as string,
          full_name: "John Doe",
          email: "john@example.com",
          phone: "+234 800 000 0000",
          department: "Computer Science",
          level: "400 Level",
          session: "2024/2025",
          status: "active",
          joined_at: "2024-01-15",
        };

        setMember(mockMember);
        setFormData({
          full_name: mockMember.full_name,
          email: mockMember.email || "",
          phone: mockMember.phone || "",
          department: mockMember.department || "",
          level: mockMember.level || "",
          session: mockMember.session || "",
          status: mockMember.status,
          joined_at: mockMember.joined_at || "",
        });
      } catch (error) {
        console.error("Error loading member:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load member",
        });
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

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.level.trim()) {
      newErrors.level = "Level is required";
    }

    if (!formData.session.trim()) {
      newErrors.session = "Session is required";
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
      //   .from('members')
      //   .update({
      //     full_name: formData.full_name,
      //     email: formData.email,
      //     phone: formData.phone,
      //     department: formData.department,
      //     level: formData.level,
      //     session: formData.session,
      //     status: formData.status,
      //     joined_at: formData.joined_at,
      //   })
      //   .eq('id', params.id)
      //   .select()
      //   .single();
      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Member updated successfully",
      });

      router.push("/admin/members");
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member",
      });
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
