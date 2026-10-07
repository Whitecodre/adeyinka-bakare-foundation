import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { testimonialSchema } from "@/lib/validations/testimonials.schema";
import { 
  getTestimonialById, 
  updateTestimonialById, 
  removeTestimonial 
} from "@/lib/services/testimonials.service";

// GET testimonial by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
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
    const user = await requireAuth();
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = testimonialSchema.partial().parse(body);
    
    const testimonial = await updateTestimonialById(id, validatedData, user.id);
    
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
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
    const user = await requireAuth();
    const { id } = await params;
    
    await removeTestimonial(id, user.id);
    
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
