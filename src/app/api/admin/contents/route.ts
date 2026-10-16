import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/require-permission";
import { authErrorResponse } from "@/lib/auth/auth-error";
import { contentSchema } from "@/lib/validations/content.schema";
import { createNewContent, getAllContents } from "@/lib/services/content.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

// GET all contents
export async function GET(request: NextRequest) {
  try {
    const { user } = await requirePermission("contents", "read");

    const contents = await getAllContents();

    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
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
    const { user } = await requirePermission("contents", "create");

    const body = await request.json();
    const validatedData = contentSchema.parse(body);

    const content = await createNewContent(validatedData, user.id);

    // Notify admins about content creation
    await notifyAdmins({
      title: "Content Created",
      message: `Content "${validatedData.title}" has been created.`,
      ctaUrl: "/admin/contents",
      ctaLabel: "View Contents",
    });

    return NextResponse.json(
      { success: true, data: content },
      { status: 201 }
    );
  } catch (error) {
    const denied = authErrorResponse(error);
    if (denied) return denied;
    console.error("Create content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 }
    );
  }
}
