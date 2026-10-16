"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/admin/loading-state";
import { useToast } from "@/hooks/use-toast";
import { Lock, Key, Smartphone, Fingerprint, Globe, Trash2, Copy, Download, Plus, Check, Mail } from "lucide-react";

interface Session {
  id: string;
  device: string;
  browser: string;
  ip_address: string;
  location: string;
  current: boolean;
  last_active: string;
  created_at: string;
}

interface Passkey {
  id: string;
  name: string;
  added_at: string;
  last_used: string;
}

interface RecoveryCode {
  code: string;
  used: boolean;
}

export default function SecurityPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [passkeysEnabled, setPasskeysEnabled] = useState(false);
  const [emailOtpEnabled, setEmailOtpEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [recoveryCodes, setRecoveryCodes] = useState<RecoveryCode[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [mfaDialogOpen, setMfaDialogOpen] = useState(false);
  const [showPasskeyDialog, setShowPasskeyDialog] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [passkeyToDelete, setPasskeyToDelete] = useState<string | null>(null);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState(false);

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [newPasskeyName, setNewPasskeyName] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setLoading(true);
        // Fetch MFA status
        const mfaRes = await fetch("/api/admin/mfa/status");
        const mfaResult = await mfaRes.json();

        if (mfaRes.ok && mfaResult.success) {
          setMfaEnabled(!!mfaResult.data.hasAnyMFA);
          setTotpEnabled(!!mfaResult.data.totpEnabled);
          setPasskeysEnabled(!!mfaResult.data.passkeyEnabled);
          setEmailOtpEnabled(!!mfaResult.data.emailOtpEnabled);
          // Try to load real passkeys, fall back to count placeholder if endpoint missing
          try {
            const pkRes = await fetch("/api/admin/security/passkeys");
            const pkJson = await pkRes.json().catch(() => null);
            if (pkRes.ok && pkJson?.success && Array.isArray(pkJson.data)) {
              setPasskeys(pkJson.data.map((p: any) => ({
                id: p.id,
                name: p.device_name || p.deviceName || "Passkey",
                added_at: p.created_at,
                last_used: p.last_used_at || p.created_at,
              })));
            } else if (mfaResult.data.passkeyCount > 0) {
              setPasskeys(Array(mfaResult.data.passkeyCount).fill(null).map((_, i) => ({
                id: `passkey-${i}`,
                name: `Passkey ${i + 1}`,
                added_at: new Date().toISOString(),
                last_used: new Date().toISOString(),
              })));
            } else {
              setPasskeys([]);
            }
          } catch {
            setPasskeys(mfaResult.data.passkeyCount > 0 ? Array(mfaResult.data.passkeyCount).fill(null).map((_, i) => ({
              id: `passkey-${i}`,
              name: `Passkey ${i + 1}`,
              added_at: new Date().toISOString(),
              last_used: new Date().toISOString(),
            })) : []);
          }
          setRecoveryCodes(mfaResult.data.recoveryCodesCount > 0 ? Array(mfaResult.data.recoveryCodesCount).fill("****") : []);
        } else {
          throw new Error(mfaResult.error || "Failed to load MFA status");
        }

        // Fetch sessions
        try {
          const sessionsRes = await fetch("/api/admin/security/sessions");
          const sessionsResult = await sessionsRes.json();

          if (sessionsRes.ok && sessionsResult.success && Array.isArray(sessionsResult.data)) {
            setSessions(sessionsResult.data.map((s: any) => {
              // Build device name from type, browser, and OS
              const deviceType = s.device_type || s.deviceType || "Unknown";
              const browser = s.browser || "Unknown Browser";
              const os = s.os || "Unknown OS";
              const deviceName = `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} - ${browser} on ${os}`;

              // Build location from country and city
              const country = s.location_country || s.locationCountry;
              const city = s.location_city || s.locationCity;
              const location = country && city ? `${city}, ${country}` : country || city || "Unknown Location";

              return {
                id: s.id,
                device: deviceName,
                browser: browser,
                ip_address: s.ip_address || s.ipAddress || "Unknown IP",
                location: location,
                current: s.is_current || s.isCurrent || false,
                last_active: s.last_activity || s.lastActivity || s.created_at,
                created_at: s.created_at,
              };
            }));
          } else {
            setSessions([]);
          }
        } catch (error) {
          console.error("Error loading sessions:", error);
          setSessions([]);
        }
      } catch (error) {
        console.error("Error loading security data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load security settings",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSecurityData();
  }, [toast]);

  const handlePasswordChange = async () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch("/api/admin/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Your password has been changed successfully",
      });
      setShowPasswordDialog(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update password",
      });
    }
  };

  const handleEnableMfa = async () => {
    try {
      const response = await fetch("/api/admin/mfa/totp/setup", {
        method: "POST",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setQrCodeUrl(result.data.qrCodeUrl || result.data.qrCode || "");
      setTotpSecret(result.data.secret || "");
      setOtpauthUrl(result.data.otpauthUrl || result.data.otpauth || "");
      setTotpCode("");
      setMfaDialogOpen(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to enable MFA",
      });
    }
  };

  const handleVerifyMfa = async () => {
    const code = totpCode.trim();
    if (!/^\d{6}$/.test(code)) {
      toast({ variant: "destructive", title: "Enter the 6-digit code" });
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch("/api/admin/mfa/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, token: code }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Invalid code");
      setTotpEnabled(true);
      setMfaEnabled(true);
      setMfaDialogOpen(false);
      setTotpCode("");
      if (j.data?.recoveryCodes?.length) {
        setRecoveryCodes(j.data.recoveryCodes.map((c: string) => ({ code: c, used: false })));
        setShowRecoveryCodes(true);
      }
      toast({ title: "Two-factor enabled", description: "Your authenticator app is now linked." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Verification failed", description: e.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisableMfa = async () => {
    try {
      const response = await fetch("/api/admin/mfa/totp/disable", {
        method: "POST",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setMfaEnabled(false);
      setTotpEnabled(false);
      setPasskeysEnabled(false);
      setEmailOtpEnabled(false);
      setPasskeys([]);
      setRecoveryCodes([]);
      toast({
        title: "MFA disabled",
        description: "Two-factor authentication has been disabled",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to disable MFA",
      });
    }
  };

  const handleSendEmailOtp = async () => {
    setIsSendingEmailOtp(true);
    try {
      const response = await fetch("/api/admin/mfa/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "ENABLE" }),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setEmailOtpSent(true);
      toast({
        title: "Email sent",
        description: "Check your email for the verification code",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send email",
      });
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const code = emailOtpCode.trim();
    if (!/^\d{6}$/.test(code)) {
      toast({ variant: "destructive", title: "Enter the 6-digit code" });
      return;
    }
    setIsVerifyingEmailOtp(true);
    try {
      const response = await fetch("/api/admin/mfa/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, purpose: "ENABLE" }),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setEmailOtpEnabled(true);
      setMfaEnabled(true);
      setEmailOtpCode("");
      setEmailOtpSent(false);
      toast({
        title: "Email OTP enabled",
        description: "Email verification has been enabled for your account",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify code",
      });
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  const handleDisableEmailOtp = async () => {
    try {
      const response = await fetch("/api/admin/mfa/email/disable", {
        method: "POST",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setEmailOtpEnabled(false);
      setEmailOtpSent(false);
      setEmailOtpCode("");
      setMfaEnabled(totpEnabled || passkeysEnabled);
      toast({
        title: "Email OTP disabled",
        description: "Email verification has been disabled",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to disable email OTP",
      });
    }
  };

  const handleAddPasskey = async () => {
    if (!newPasskeyName.trim()) {
      toast({ variant: "destructive", title: "Please enter a name for this passkey" });
      return;
    }
    setIsRegisteringPasskey(true);
    try {
      const optsRes = await fetch("/api/admin/mfa/passkey/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const optsJson = await optsRes.json();
      if (!optsJson.success) throw new Error(optsJson.error || "Failed to start passkey registration");

      const { startRegistration } = await import("@simplewebauthn/browser");
      let attResp: unknown;
      try {
        attResp = await startRegistration({ optionsJSON: optsJson.data } as any);
      } catch (e: any) {
        if (e?.name === "NotAllowedError") throw new Error("Passkey creation was cancelled or timed out. Please try again and approve Windows Hello / Touch ID.");
        throw e;
      }

      const verifyRes = await fetch("/api/admin/mfa/passkey/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attResp, deviceName: newPasskeyName.trim() }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) throw new Error(verifyJson.error || "Verification failed");

      toast({ title: "Passkey added", description: "Your device can now be used for passwordless login." });
      setShowPasskeyDialog(false);
      setNewPasskeyName("");
      const sRes = await fetch("/api/admin/mfa/status");
      const sJson = await sRes.json();
      if (sJson.success) {
        setPasskeysEnabled(!!sJson.data.passkeyEnabled);
        setMfaEnabled(!!sJson.data.totpEnabled || !!sJson.data.passkeyEnabled);
        // refresh passkey list via security passkeys endpoint
        try {
          const listRes = await fetch("/api/admin/security/passkeys");
          const listJson = await listRes.json().catch(() => null);
          if (listRes.ok && listJson?.success && Array.isArray(listJson.data) && listJson.data.length) {
            setPasskeys(listJson.data.map((p: any) => ({ id: p.id, name: p.device_name || p.deviceName || "Passkey", added_at: p.created_at, last_used: p.last_used_at || p.created_at })));
          } else {
            setPasskeys((prev) => [...prev, { id: Date.now().toString(), name: newPasskeyName.trim(), added_at: new Date().toISOString(), last_used: new Date().toISOString() }]);
          }
        } catch {
          setPasskeys((prev) => [...prev, { id: Date.now().toString(), name: newPasskeyName.trim(), added_at: new Date().toISOString(), last_used: new Date().toISOString() }]);
        }
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed to add passkey", description: error.message || "Try again and approve the browser prompt." });
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/security/sessions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Session revoked",
        description: "The session has been revoked successfully",
      });
      setSessions(sessions.filter((s) => s.id !== id));
      setSessionToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke session",
      });
    }
  };

  const handleDeletePasskey = async (id: string) => {
    setIsDeletingPasskey(true);
    try {
      const response = await fetch(`/api/admin/security/passkeys/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setPasskeys(passkeys.filter((p) => p.id !== id));
      setPasskeyToDelete(null);
      toast({
        title: "Passkey removed",
        description: "Your passkey has been removed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove passkey",
      });
    } finally {
      setIsDeletingPasskey(false);
    }
  };

  const handleGenerateRecoveryCodes = async () => {
    try {
      const response = await fetch("/api/admin/security/recovery-codes/generate", {
        method: "POST",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setRecoveryCodes(result.data.codes.map((code: string) => ({ code, used: false })));
      setShowRecoveryCodes(true);
      toast({
        title: "Recovery codes generated",
        description: "Save these codes in a secure location",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate recovery codes",
      });
    }
  };

  const timeAgo = (iso: string): string => {
    const then = new Date(iso).getTime();
    if (!then) return "";
    const s = Math.floor((Date.now() - then) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  if (loading) {
    return <LoadingState message="Loading security settings..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Settings"
        subtitle="Manage your account security and authentication"
      />

      {/* Password Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Change your password</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Ensure your password is strong and unique
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
              className="w-full sm:w-auto"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Authenticator App (TOTP)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Authenticator App</p>
                {totpEnabled && (
                  <Badge className="bg-success-soft text-success border-success/20">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Use Google Authenticator, Authy, or 1Password for 2FA
              </p>
            </div>
            {totpEnabled ? (
              <Button
                variant="outline"
                onClick={handleDisableMfa}
              className="w-full sm:w-auto"
            >
                Disable
              </Button>
            ) : (
              <Button variant="brand"
                onClick={handleEnableMfa}
              className="w-full sm:w-auto"
            >
                Enable
              </Button>
            )}
          </div>

          {totpEnabled && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleGenerateRecoveryCodes}
>
                <Key className="w-4 h-4" />
                Generate Recovery Codes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Passkeys */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Passkeys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Passkeys</p>
                {passkeysEnabled && (
                  <Badge className="bg-success-soft text-success border-success/20">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Use biometric authentication for secure, passwordless login
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasskeyDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Passkey
            </Button>
          </div>

          {passkeys.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              {passkeys.map((passkey) => (
                <div
                  key={passkey.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{passkey.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(passkey.added_at).toLocaleDateString()} · Last used{" "}
                      {timeAgo(passkey.last_used)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPasskeyToDelete(passkey.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email OTP */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Email OTP</p>
                {emailOtpEnabled && (
                  <Badge className="bg-success-soft text-success border-success/20">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Receive verification codes via email
              </p>
            </div>
            {emailOtpEnabled ? (
              <Button
                variant="outline"
                onClick={handleDisableEmailOtp}
                className="w-full sm:w-auto"
              >
                Disable
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleSendEmailOtp}
                disabled={isSendingEmailOtp}
                className="w-full sm:w-auto"
              >
                {isSendingEmailOtp ? "Sending..." : "Enable"}
              </Button>
            )}
          </div>

          {emailOtpSent && (
            <div className="pt-4 border-t border-border space-y-3">
              <div className="space-y-2">
                <Label htmlFor="emailOtpCode">6-digit code</Label>
                <Input
                  id="emailOtpCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={6}
                  value={emailOtpCode}
                  onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="border-border text-center font-mono text-lg tracking-widest"
                />
              </div>
              <Button
                variant="brand"
                onClick={handleVerifyEmailOtp}
                disabled={isVerifyingEmailOtp || emailOtpCode.length !== 6}
                className="w-full"
              >
                {isVerifyingEmailOtp ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{session.device}</p>
                    {session.current && (
                      <Badge className="bg-success-soft text-success border-success/20 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.location} · {session.ip_address}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Last active {timeAgo(session.last_active)}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSessionToDelete(session.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                className={`border-border ${passwordErrors.currentPassword ? "border-destructive" : ""}`}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className={`border-border ${passwordErrors.newPassword ? "border-destructive" : ""}`}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className={`border-border ${passwordErrors.confirmPassword ? "border-destructive" : ""}`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
>
              Cancel
            </Button>
            <Button variant="brand"
              onClick={handlePasswordChange}
>
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TOTP Setup Dialog */}
      <Dialog open={mfaDialogOpen} onOpenChange={setMfaDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2"><Smartphone className="w-5 h-5" /> Set up authenticator</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Scan the QR code with Google Authenticator, Authy, or 1Password, then enter the 6-digit code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {qrCodeUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-xl border border-border bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeUrl} alt="TOTP QR code" width={200} height={200} className="h-[200px] w-[200px] object-contain" />
                </div>
                <p className="text-xs text-muted-foreground text-center">If you cannot scan, manually enter this secret</p>
                <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
                  <code className="flex-1 break-all font-mono text-xs text-foreground">{totpSecret || "—"}</code>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { if (totpSecret) { navigator.clipboard.writeText(totpSecret); toast({ title: "Secret copied" }); } }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {otpauthUrl && (
                  <p className="w-full break-all text-[11px] text-muted-foreground/70">{otpauthUrl}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-maroon-600" />
                Generating QR code...
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="totpCode" className="text-foreground">6-digit code</Label>
              <Input
                id="totpCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="border-border text-center font-mono text-lg tracking-widest"
                onKeyDown={(e) => { if (e.key === "Enter") handleVerifyMfa(); }}
              />
              <p className="text-xs text-muted-foreground">Enter the code from your authenticator app. It refreshes every 30 seconds.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMfaDialogOpen(false)}>Cancel</Button>
            <Button variant="brand" onClick={handleVerifyMfa} disabled={isVerifying || !/^\d{6}$/.test(totpCode)}>{isVerifying ? "Verifying..." : "Verify & enable"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Passkey Dialog */}
      <Dialog open={showPasskeyDialog} onOpenChange={setShowPasskeyDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Passkey</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Give your passkey a name to identify it easily
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="passkeyName" className="text-foreground">
                Passkey Name
              </Label>
              <Input
                id="passkeyName"
                value={newPasskeyName}
                onChange={(e) => setNewPasskeyName(e.target.value)}
                placeholder="e.g., My iPhone, Work Laptop"
                className="border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasskeyDialog(false)}
              disabled={isRegisteringPasskey}
>
              Cancel
            </Button>
            <Button variant="brand"
              onClick={handleAddPasskey}
              disabled={isRegisteringPasskey || !newPasskeyName.trim()}
>
              {isRegisteringPasskey ? "Waiting for device..." : "Add Passkey"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recovery Codes Dialog */}
      <Dialog open={showRecoveryCodes} onOpenChange={setShowRecoveryCodes}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Recovery Codes</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Save these codes in a secure location. You can use them to access your account if you lose your 2FA device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted rounded font-mono text-sm text-foreground border border-border"
                >
                  {code.code}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    recoveryCodes.map((c) => c.code).join("\n")
                  );
                  toast({
                    title: "Copied",
                    description: "Recovery codes copied to clipboard",
                  });
                }}
>
                <Copy className="w-4 h-4" />
                Copy All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob(
                    [recoveryCodes.map((c) => c.code).join("\n")],
                    { type: "text/plain" }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "abf-recovery-codes.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
>
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="brand"
              onClick={() => setShowRecoveryCodes(false)}
>
              I've Saved My Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Delete Confirm */}
      <Dialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Revoke Session?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will sign out the device and require it to sign in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSessionToDelete(null)}
>
              Cancel
            </Button>
            <Button
              onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Passkey Delete Confirm */}
      <Dialog open={!!passkeyToDelete} onOpenChange={() => setPasskeyToDelete(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Remove Passkey?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will remove the passkey from your account. You can add it again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasskeyToDelete(null)}
              disabled={isDeletingPasskey}
            >
              Cancel
            </Button>
            <Button
              onClick={() => passkeyToDelete && handleDeletePasskey(passkeyToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeletingPasskey}
            >
              {isDeletingPasskey ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
