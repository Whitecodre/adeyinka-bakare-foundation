import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { testimonialSchema } from "@/lib/validations/testimonials.schema";
import {
  getAllTestimonials,
  getTestimonialById,
  createNewTestimonial,
  updateTestimonialById,
  removeTestimonial
} from "@/lib/services/testimonials.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("testimonials", "read");
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const testimonials = await getAllTestimonials();
    
    // Filter by status if provided
    const filtered = status 
      ? testimonials.filter(t => t.status === status)
      : testimonials;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Get testimonials error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST create testimonial
export async function POST(request: NextRequest) {
  try {
    const { user } = await requirePermission("testimonials", "create");

    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await createNewTestimonial(validatedData, user.id);

    // Notify admins about new testimonial
    await notifyAdmins({
      title: "New Testimonial Added",
      message: `A new testimonial has been added.`,
      ctaUrl: "/admin/testimonials",
      ctaLabel: "View Testimonials",
    });

    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create testimonial error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
