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
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Fingerprint,
  Clock,
  Globe,
  Trash2,
  Copy,
  Download,
  Plus,
  Check,
  X,
} from "lucide-react";

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
  const [passkeysEnabled, setPasskeysEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [recoveryCodes, setRecoveryCodes] = useState<RecoveryCode[]>([]);

  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const [showPasskeyDialog, setShowPasskeyDialog] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [passkeyToDelete, setPasskeyToDelete] = useState<string | null>(null);

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [newPasskeyName, setNewPasskeyName] = useState("");

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase queries
        // const { data: { user } } = await supabase.auth.getUser();
        // const { data: factors } = await supabase.auth.mfa.listFactors();
        // const { data: sessions } = await supabase.auth.getUser(); // This would need a different approach

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setMfaEnabled(false);
        setPasskeysEnabled(false);
        setSessions([
          {
            id: "1",
            device: "Chrome on Windows",
            browser: "Chrome 120",
            ip_address: "192.168.1.1",
            location: "Lagos, Nigeria",
            current: true,
            last_active: new Date().toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
        setPasskeys([]);
        setRecoveryCodes([]);
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
      // TODO: Replace with actual Supabase password update
      // const { error } = await supabase.auth.updateUser({
      //   password: passwordForm.newPassword,
      // });
      // if (error) throw error;

      toast({
        title: "Password updated",
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
      // TODO: Replace with actual Supabase MFA enrollment
      // const { data, error } = await supabase.auth.mfa.enroll({
      //   factorType: 'totp',
      //   factorName: 'ABF Admin',
      // });
      // if (error) throw error;

      setShowMfaDialog(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to enable MFA",
      });
    }
  };

  const handleDisableMfa = async () => {
    try {
      // TODO: Replace with actual Supabase MFA disable
      // const { error } = await supabase.auth.mfa.disable();
      // if (error) throw error;

      setMfaEnabled(false);
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

  const handleAddPasskey = async () => {
    if (!newPasskeyName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for this passkey",
      });
      return;
    }

    try {
      // TODO: Replace with actual WebAuthn passkey registration
      // const { data, error } = await supabase.auth.mfa.enroll({
      //   factorType: 'webauthn',
      //   factorName: newPasskeyName,
      // });
      // if (error) throw error;

      setPasskeys([
        ...passkeys,
        {
          id: Date.now().toString(),
          name: newPasskeyName,
          added_at: new Date().toISOString(),
          last_used: new Date().toISOString(),
        },
      ]);
      setPasskeysEnabled(true);
      setShowPasskeyDialog(false);
      setNewPasskeyName("");
      toast({
        title: "Passkey added",
        description: "Your passkey has been added successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add passkey",
      });
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase session deletion
      // const { error } = await supabase.auth.signOut({ scope: 'others' });
      // For specific session, you'd need to use the admin API
      // if (error) throw error;

      setSessions(sessions.filter((s) => s.id !== id));
      setSessionToDelete(null);
      toast({
        title: "Session revoked",
        description: "The session has been revoked successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke session",
      });
    }
  };

  const handleDeletePasskey = async (id: string) => {
    try {
      // TODO: Replace with actual Supabase passkey deletion
      // const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
      // if (error) throw error;

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
    }
  };

  const handleGenerateRecoveryCodes = async () => {
    try {
      // TODO: Replace with actual Supabase recovery code generation
      // const codes = Array.from({ length: 10 }, () =>
      //   Math.random().toString(36).substring(2, 12).toUpperCase()
      // );
      // setRecoveryCodes(codes.map(code => ({ code, used: false })));

      const codes = Array.from({ length: 10 }, (_, i) => ({
        code: `ABF-${(i + 1).toString().padStart(4, "0")}-${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`,
        used: false,
      }));
      setRecoveryCodes(codes);
      setShowRecoveryCodes(true);
      toast({
        title: "Recovery codes generated",
        description: "Save these codes in a secure location",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recovery codes",
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
      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#2d1816]">Change your password</p>
              <p className="text-xs text-[#2d1816]/60 mt-1">
                Ensure your password is strong and unique
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#2d1816]">Two-Factor Authentication</p>
                {mfaEnabled && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#2d1816]/60 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            {mfaEnabled ? (
              <Button
                variant="outline"
                onClick={handleDisableMfa}
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                Disable
              </Button>
            ) : (
              <Button
                onClick={handleEnableMfa}
                className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
              >
                Enable
              </Button>
            )}
          </div>

          {mfaEnabled && (
            <div className="pt-4 border-t border-[#e9ddd3]">
              <Button
                variant="outline"
                onClick={handleGenerateRecoveryCodes}
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                <Key className="w-4 h-4 mr-2" />
                Generate Recovery Codes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Passkeys */}
      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Passkeys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#2d1816]">Passkeys</p>
                {passkeysEnabled && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#2d1816]/60 mt-1">
                Use biometric authentication for secure, passwordless login
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasskeyDialog(true)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Passkey
            </Button>
          </div>

          {passkeys.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#e9ddd3]">
              {passkeys.map((passkey) => (
                <div
                  key={passkey.id}
                  className="flex items-center justify-between p-3 bg-[#e9ddd3]/10 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-[#2d1816]">{passkey.name}</p>
                    <p className="text-xs text-[#2d1816]/60">
                      Added {new Date(passkey.added_at).toLocaleDateString()} · Last used{" "}
                      {timeAgo(passkey.last_used)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPasskeyToDelete(passkey.id)}
                    className="hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-[#e9ddd3]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d1816] flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-[#e9ddd3]/10 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e9ddd3]/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#2d1816]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#2d1816]">{session.device}</p>
                    {session.current && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#2d1816]/60">
                    {session.location} · {session.ip_address}
                  </p>
                  <p className="text-xs text-[#2d1816]/40">
                    Last active {timeAgo(session.last_active)}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSessionToDelete(session.id)}
                  className="hover:bg-red-100 hover:text-red-600"
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
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-[#2d1816]">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                className={`border-[#e9ddd3] ${passwordErrors.currentPassword ? "border-red-500" : ""}`}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[#2d1816]">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className={`border-[#e9ddd3] ${passwordErrors.newPassword ? "border-red-500" : ""}`}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#2d1816]">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className={`border-[#e9ddd3] ${passwordErrors.confirmPassword ? "border-red-500" : ""}`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Passkey Dialog */}
      <Dialog open={showPasskeyDialog} onOpenChange={setShowPasskeyDialog}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Add New Passkey</DialogTitle>
            <DialogDescription className="text-[#2d1816]/60">
              Give your passkey a name to identify it easily
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="passkeyName" className="text-[#2d1816]">
                Passkey Name
              </Label>
              <Input
                id="passkeyName"
                value={newPasskeyName}
                onChange={(e) => setNewPasskeyName(e.target.value)}
                placeholder="e.g., My iPhone, Work Laptop"
                className="border-[#e9ddd3]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasskeyDialog(false)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPasskey}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              Add Passkey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recovery Codes Dialog */}
      <Dialog open={showRecoveryCodes} onOpenChange={setShowRecoveryCodes}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Recovery Codes</DialogTitle>
            <DialogDescription className="text-[#2d1816]/60">
              Save these codes in a secure location. You can use them to access your account if you lose your 2FA device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-2 bg-[#e9ddd3]/20 rounded font-mono text-sm text-[#2d1816] border border-[#e9ddd3]"
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
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                <Copy className="w-4 h-4 mr-2" />
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
                className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowRecoveryCodes(false)}
              className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
            >
              I've Saved My Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Delete Confirm */}
      <Dialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Revoke Session?</DialogTitle>
            <DialogDescription className="text-[#2d1816]/60">
              This will sign out the device and require it to sign in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSessionToDelete(null)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
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
        <DialogContent className="bg-[#fffdf8] border-[#e9ddd3]">
          <DialogHeader>
            <DialogTitle className="text-[#2d1816]">Remove Passkey?</DialogTitle>
            <DialogDescription className="text-[#2d1816]/60">
              This will remove the passkey from your account. You can add it again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasskeyToDelete(null)}
              className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
            >
              Cancel
            </Button>
            <Button
              onClick={() => passkeyToDelete && handleDeletePasskey(passkeyToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
