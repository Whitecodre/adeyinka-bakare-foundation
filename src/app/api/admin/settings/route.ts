import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { settingsSchema } from "@/lib/validations/settings.schema";
import { 
  getSettings, 
  updateSettings 
} from "@/lib/services/settings.service";

// GET site settings
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const settings = await getSettings();
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH update site settings
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = settingsSchema.parse(body);
    
    const settings = await updateSettings(validatedData, user.id);
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
