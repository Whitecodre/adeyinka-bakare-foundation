import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { settingsSchema } from "@/lib/validations/settings.schema";
import {
  getSettings,
  updateSettings
} from "@/lib/services/settings.service";
import { notifyAdmins } from "@/lib/email/admin-notifications";

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

// PUT update site settings
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    console.log("PUT settings received body:", body);

    const validatedData = settingsSchema.parse(body);
    console.log("PUT settings validated data:", validatedData);

    const settings = await updateSettings(validatedData, user.id);
    console.log("PUT settings result:", settings);

    // Notify admins about settings update
    await notifyAdmins({
      title: "Site Settings Updated",
      message: "Site settings have been updated.",
      ctaUrl: "/admin/settings",
      ctaLabel: "View Settings",
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
