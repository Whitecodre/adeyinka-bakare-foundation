import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { testimonialSchema } from "@/lib/validations/testimonials.schema";
import {
  getTestimonialById,
  updateTestimonialById,
  removeTestimonial
} from "@/lib/services/testimonials.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET testimonial by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("testimonials", "read");
    const { id } = await params;
    
    const testimonial = await getTestimonialById(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get testimonial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PATCH update testimonial
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("testimonials", "update");
    const { id } = await params;

    const body = await request.json();
    const validatedData = testimonialSchema.partial().parse(body);

    const testimonial = await updateTestimonialById(id, validatedData, user.id);

    // Notify admins about testimonial update
    await notifyAdmins({
      title: "Testimonial Updated",
      message: `A testimonial has been updated.`,
      ctaUrl: `/admin/testimonials/${id}`,
      ctaLabel: "View Testimonial",
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Update testimonial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requirePermission("testimonials", "delete");
    const { id } = await params;

    await removeTestimonial(id, user.id);

    // Notify admins about testimonial deletion
    await notifyAdmins({
      title: "Testimonial Deleted",
      message: `A testimonial has been deleted.`,
      ctaUrl: "/admin/testimonials",
      ctaLabel: "View Testimonials",
    });

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Delete testimonial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
