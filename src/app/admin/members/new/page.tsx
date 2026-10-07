"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export default function NewMemberPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setLoading(true);

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('members')
      //   .insert({
      //     full_name: formData.full_name,
      //     email: formData.email,
      //     phone: formData.phone,
      //     department: formData.department,
      //     level: formData.level,
      //     session: formData.session,
      //     status: formData.status,
      //     joined_at: formData.joined_at || new Date().toISOString(),
      //   })
      //   .select()
      //   .single();

      // if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Member created successfully",
      });

      router.push("/admin/members");
    } catch (error) {
      console.error("Error creating member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create member",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Add New Member</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Create a new fellowship member</p>
        </div>
      </div>

      <Card className="border-[#e9ddd3] bg-[#fffdf8]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816]">
            Member Information
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
                <Label htmlFor="email" className="text-[#2d1816]">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="member@example.com"
                  className={`border-[#e9ddd3] ${errors.email ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#2d1816]">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                  className={`border-[#e9ddd3] ${errors.phone ? "border-red-500" : ""}`}
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joined_at" className="text-[#2d1816]">
                  Joined Date
                </Label>
                <Input
                  id="joined_at"
                  type="date"
                  value={formData.joined_at}
                  onChange={(e) => handleInputChange("joined_at", e.target.value)}
                  className="border-[#e9ddd3]"
                  disabled={loading}
                />
              </div>
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
                  "Create Member"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
