import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { contentSchema } from "@/lib/validations/contents.schema";
import { 
  getAllContents, 
  getContentByKey, 
  createNewContent, 
  updateContentById, 
  removeContent 
} from "@/lib/services/contents.service";

// GET all contents
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const contents = await getAllContents();
    
    // Filter by status if provided
    const filtered = status 
      ? contents.filter(c => c.status === status)
      : contents;
    
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Get contents error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contents" },
      { status: 500 }
    );
  }
}

// POST create content
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = contentSchema.parse(body);
    
    const content = await createNewContent(validatedData, user.id);
    
    return NextResponse.json(
      { success: true, data: content },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 }
    );
  }
}
