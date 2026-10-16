import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import {
  totpEnabledEmail,
  totpDisabledEmail,
  passkeyAddedEmail,
  passkeyRemovedEmail,
  recoveryCodesGeneratedEmail,
  recoveryCodesLowWarningEmail,
} from "@/lib/email/templates";

/**
 * Security Notification Service
 * Sends email notifications for MFA and security events
 */

export async function sendTotpEnabledNotification(userId: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (!profile?.email) return;

    const { subject, html, text } = totpEnabledEmail({
      fullName: profile.full_name || "Admin",
      loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin-auth/login`,
    });

    await sendEmail({
      to: profile.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send TOTP enabled notification:", error);
    // Don't throw - notification failures shouldn't block the main operation
  }
}

export async function sendTotpDisabledNotification(userId: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (!profile?.email) return;

    const { subject, html, text } = totpDisabledEmail({
      fullName: profile.full_name || "Admin",
      loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin-auth/login`,
    });

    await sendEmail({
      to: profile.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send TOTP disabled notification:", error);
  }
}

export async function sendPasskeyAddedNotification(userId: string, deviceName: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (!profile?.email) return;

    const { subject, html, text } = passkeyAddedEmail({
      fullName: profile.full_name || "Admin",
      deviceName,
      loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin-auth/login`,
    });

    await sendEmail({
      to: profile.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send passkey added notification:", error);
  }
}

export async function sendPasskeyRemovedNotification(userId: string, deviceName: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (!profile?.email) return;

    const { subject, html, text } = passkeyRemovedEmail({
      fullName: profile.full_name || "Admin",
      deviceName,
      loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin-auth/login`,
    });

    await sendEmail({
      to: profile.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send passkey removed notification:", error);
  }
}

export async function sendRecoveryCodesGeneratedNotification(userId: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (!profile?.email) return;

    const { subject, html, text } = recoveryCodesGeneratedEmail({
      fullName: profile.full_name || "Admin",
      loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/security`,
    });

    await sendEmail({
      to: profile.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send recovery codes generated notification:", error);
  }
}

export async function sendRecoveryCodesLowWarning(userId: string, remaining: number) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (!profile?.email) return;

    const { subject, html, text } = recoveryCodesLowWarningEmail({
      fullName: profile.full_name || "Admin",
      remaining,
      loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/security`,
    });

    await sendEmail({
      to: profile.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Failed to send recovery codes low warning:", error);
  }
}
