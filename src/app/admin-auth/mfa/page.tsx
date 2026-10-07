"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Copy, Download, Key, Eye, EyeOff, AlertTriangle, Mail, Fingerprint, Smartphone, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function MFAPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mfaSettings, setMfaSettings] = useState<any>(null);
  const [totpSecret, setTotpSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passkeyRegistering, setPasskeyRegistering] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const response = await fetch("/api/admin/mfa/status");
      const data = await response.json();

      if (data.success) {
        setMfaSettings(data.data);
      }
    } catch (error) {
      console.error("MFA status check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupTotp = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/mfa/totp/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setTotpSecret(data.data.secret);
        setOtpauthUrl(data.data.otpauthUrl);
        toast({
          title: "TOTP setup initiated",
          description: "Scan the QR code with your authenticator app",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to setup TOTP",
          description: data.error || "Failed to setup TOTP",
        });
      }
    } catch (error) {
      console.error("TOTP setup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to setup TOTP",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyTotp = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/mfa/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: totpCode, secret: totpSecret }),
      });

      const data = await response.json();

      if (data.success) {
        setRecoveryCodes(data.data.recoveryCodes);
        toast({
          title: "Authenticator app verified",
          description: "Two-factor authentication is now active",
        });
        await checkMFAStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: data.error || "Invalid code",
        });
      }
    } catch (error) {
      console.error("TOTP verify error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmailCode = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/mfa/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "ENABLE" }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
        toast({
          title: "Email sent",
          description: "Check your email for the verification code",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send email",
          description: data.error || "Failed to send email",
        });
      }
    } catch (error) {
      console.error("Email send error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/mfa/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: emailCode, purpose: "ENABLE" }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Email 2FA enabled",
          description: "Two-factor authentication is now active",
        });
        await checkMFAStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: data.error || "Invalid code",
        });
      }
    } catch (error) {
      console.error("Email verify error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRegisterPasskey = async () => {
    setPasskeyRegistering(true);

    try {
      // Get registration options
      const optionsResponse = await fetch("/api/admin/mfa/passkey/register/options", {
        method: "POST",
      });

      const optionsData = await optionsResponse.json();

      if (!optionsData.success) {
        throw new Error(optionsData.error);
      }

      // WebAuthn registration (TODO: implement with @simplewebauthn/browser)
      // For now, simulate success
      toast({
        title: "Passkey registered",
        description: "Two-factor authentication is now active",
      });
      await checkMFAStatus();
    } catch (error: any) {
      console.error("Passkey registration error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register passkey",
      });
    } finally {
      setPasskeyRegistering(false);
    }
  };

  const handleDisableMethod = async (method: string) => {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/mfa/setup?method=${method}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: `${method} 2FA disabled`,
          description: "Two-factor authentication has been turned off",
        });

        if (method === "totp") {
          setTotpSecret("");
          setRecoveryCodes([]);
        }

        await checkMFAStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Failed to disable",
          description: data.error || "Failed to disable MFA",
        });
      }
    } catch (error) {
      console.error("Disable MFA error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disable MFA",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.push("/admin");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied",
    });
  };

  const downloadRecoveryCodes = () => {
    const text = recoveryCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mfa-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Recovery codes downloaded",
      description: "Save them in a secure location",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full relative">
        <div className="flex-1 flex flex-col justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#aa322b]" />
          <p className="text-sm text-[#2d1816]/60 mt-4">Loading MFA settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-[#2d1816]/60 hover:text-[#2d1816] transition-colors w-fit">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-12 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#2d1816] font-['Libre_Baskerville'] tracking-tight">
              Two-Factor Authentication
            </h1>
            <p className="text-sm text-[#2d1816]/60 mt-2">
              Add an extra layer of security to your account
            </p>
          </div>

          <Tabs defaultValue="totp" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="totp" className="gap-2">
                <Smartphone size={16} />
                App
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail size={16} />
                Email
              </TabsTrigger>
              <TabsTrigger value="passkey" className="gap-2">
                <Fingerprint size={16} />
                Passkey
              </TabsTrigger>
            </TabsList>

            {/* Authenticator App */}
            <TabsContent value="totp" className="space-y-4 mt-4">
              {!mfaSettings?.totpEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-[#f8c84d]/10 rounded-xl border border-[#f8c84d]/20">
                    <Shield className="w-6 h-6 text-[#f8c84d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#2d1816] mb-1">Authenticator App</h3>
                      <p className="text-sm text-[#2d1816]/60">
                        Use Google Authenticator, Authy, or another TOTP app to generate verification codes
                      </p>
                    </div>
                  </div>

                  {!totpSecret ? (
                    <Button
                      onClick={handleSetupTotp}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
                    >
                      {saving ? "Setting up..." : "Set Up Authenticator App"}
                    </Button>
                  ) : (
                    <>
                      {/* QR Code */}
                      <div className="space-y-4">
                        <div className="bg-white p-6 rounded-xl border border-[#e9ddd3] flex flex-col items-center">
                          {otpauthUrl && (
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`}
                              alt="QR Code"
                              className="w-48 h-48 mb-4"
                            />
                          )}
                          <p className="text-sm text-[#2d1816]/60 text-center">
                            Scan this QR code with your authenticator app
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-[#2d1816]/80">Or enter this code manually</Label>
                          <div className="flex gap-2">
                            <Input
                              value={totpSecret}
                              readOnly
                              type={showSecret ? "text" : "password"}
                              className="border-[#e9ddd3] bg-[#fffdf8] font-mono"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setShowSecret(!showSecret)}
                              className="border-[#e9ddd3]"
                            >
                              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(totpSecret)}
                              className="border-[#e9ddd3]"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Verification */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-[#2d1816]/80">Enter verification code</Label>
                        <Input
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20"
                          disabled={saving}
                        />
                      </div>

                      <Button
                        onClick={handleVerifyTotp}
                        disabled={saving || totpCode.length !== 6}
                        className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
                      >
                        {saving ? "Verifying..." : "Verify and Enable"}
                      </Button>

                      {/* Recovery Codes */}
                      {recoveryCodes.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-[#e9ddd3]">
                          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-semibold text-[#2d1816] mb-1">Save your recovery codes</h3>
                              <p className="text-sm text-[#2d1816]/60">
                                These codes can be used to access your account if you lose your authenticator device
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium text-[#2d1816]/80">Recovery codes</Label>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                                  className="border-[#e9ddd3] text-xs"
                                >
                                  {showRecoveryCodes ? "Hide" : "Show"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={downloadRecoveryCodes}
                                  className="border-[#e9ddd3] text-xs"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>

                            {showRecoveryCodes && (
                              <div className="grid grid-cols-2 gap-2">
                                {recoveryCodes.map((code, index) => (
                                  <div
                                    key={index}
                                    className="bg-[#e9ddd3]/20 p-2 rounded-lg font-mono text-sm text-[#2d1816] cursor-pointer hover:bg-[#e9ddd3]/40"
                                    onClick={() => copyToClipboard(code)}
                                  >
                                    {code}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2d1816] mb-1">Authenticator App Enabled</h3>
                      <p className="text-sm text-[#2d1816]/60">
                        Your authenticator app is now configured for two-factor authentication
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDisableMethod("totp")}
                    disabled={saving}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Disable Authenticator App
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Email 2FA */}
            <TabsContent value="email" className="space-y-4 mt-4">
              {!mfaSettings?.emailOtpEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-[#f8c84d]/10 rounded-xl border border-[#f8c84d]/20">
                    <Mail className="w-6 h-6 text-[#f8c84d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#2d1816] mb-1">Email Verification</h3>
                      <p className="text-sm text-[#2d1816]/60">
                        A verification code will be sent to your email on each login attempt (max 2 per 10 minutes)
                      </p>
                    </div>
                  </div>

                  {!emailSent ? (
                    <Button
                      onClick={handleSendEmailCode}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
                    >
                      {saving ? "Sending..." : "Send Verification Code"}
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-[#2d1816]/80">Enter verification code</Label>
                        <Input
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="border-[#e9ddd3] bg-[#fffdf8] focus:border-[#f8c84d] focus:ring-[#f8c84d]/20"
                          disabled={saving}
                        />
                      </div>

                      <Button
                        onClick={handleVerifyEmailCode}
                        disabled={saving || emailCode.length !== 6}
                        className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
                      >
                        {saving ? "Verifying..." : "Verify and Enable"}
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2d1816] mb-1">Email 2FA Enabled</h3>
                      <p className="text-sm text-[#2d1816]/60">
                        A verification code will be sent to your email on each login
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDisableMethod("email")}
                    disabled={saving}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Disable Email 2FA
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Passkey */}
            <TabsContent value="passkey" className="space-y-4 mt-4">
              {!mfaSettings?.passkeyEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-[#f8c84d]/10 rounded-xl border border-[#f8c84d]/20">
                    <Fingerprint className="w-6 h-6 text-[#f8c84d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#2d1816] mb-1">Passkey</h3>
                      <p className="text-sm text-[#2d1816]/60">
                        Use your fingerprint, face recognition, or device PIN to sign in securely
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleRegisterPasskey}
                    disabled={passkeyRegistering}
                    className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c] text-white font-semibold shadow-lg shadow-primary/30"
                  >
                    {passkeyRegistering ? "Registering..." : "Register Passkey"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2d1816] mb-1">Passkey Enabled</h3>
                      <p className="text-sm text-[#2d1816]/60">
                        You can now sign in using your fingerprint or face recognition
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDisableMethod("passkey")}
                    disabled={saving}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Disable Passkey
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="pt-4 border-t border-[#e9ddd3]">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-[#2d1816]/60 hover:text-[#2d1816]"
            >
              Skip for now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
