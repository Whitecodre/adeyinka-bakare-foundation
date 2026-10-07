import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { testimonialSchema } from "@/lib/validations/testimonials.schema";
import { 
  getAllTestimonials, 
  getTestimonialById, 
  createNewTestimonial, 
  updateTestimonialById, 
  removeTestimonial 
} from "@/lib/services/testimonials.service";

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const testimonials = await getAllTestimonials();
    
    // Filter by status if provided
    const filtered = status 
      ? testimonials.filter(t => t.status === status)
      : testimonials;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
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
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);
    
    const testimonial = await createNewTestimonial(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
