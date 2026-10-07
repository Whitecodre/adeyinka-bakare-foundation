import { NextRequest, NextResponse } from "next/server";
import { getAllTestimonials } from "@/lib/services/testimonials.service";

export async function GET(request: NextRequest) {
  try {
    const testimonials = await getAllTestimonials();

    // Filter to only show published testimonials
    const published = testimonials.filter((t: any) => t.status === "published");

    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    console.error("Get testimonials error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
