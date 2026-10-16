import { createAdminClient } from "../supabase/admin";
import { sendEmail } from "./send";
import { adminNotifyEmail } from "./templates";

/**
 * Get all active admin users (super_admin, admin, editor) for email notifications
 */
export async function getAdminEmails() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("role", ["super_admin", "admin", "editor"])
    .eq("status", "active");

  if (error) throw error;

  // Get emails from auth.users for each profile
  const adminsWithEmails = await Promise.all(
    (data || []).map(async (profile) => {
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id);
      if (authError || !authUser.user) {
        console.error(`Failed to get auth user for profile ${profile.id}:`, authError);
        return null;
      }
      return {
        email: authUser.user.email,
        full_name: profile.full_name,
      };
    })
  );

  // Filter out nulls
  return adminsWithEmails.filter((admin): admin is { email: string; full_name: string } => admin !== null);
}

/**
 * Send email notification to all active admins
 */
export async function notifyAdmins(params: {
  title: string;
  message: string;
  ctaUrl?: string;
  ctaLabel?: string;
}) {
  try {
    const admins = await getAdminEmails();

    if (admins.length === 0) {
      console.log("No active admins to notify");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
    const { subject, html, text } = adminNotifyEmail({ ...params, baseUrl });

    // Send to all admins in parallel
    const emailPromises = admins.map((admin) =>
      sendEmail({
        to: admin.email,
        subject,
        html,
        text,
      })
    );

    await Promise.allSettled(emailPromises);

    console.log(`Sent notification to ${admins.length} admins`);
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}
