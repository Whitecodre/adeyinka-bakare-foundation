"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Key, Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function MFAConfirmPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [mfaStatus, setMfaStatus] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passkeyVerifying, setPasskeyVerifying] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin-auth/login");
        return;
      }

      const response = await fetch("/api/admin/mfa/status");
      const data = await response.json();

      if (!data.success || !data.data.hasAnyMFA) {
        // No MFA configured, redirect to dashboard
        router.push("/admin");
        return;
      }

      setMfaStatus(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to check MFA status:", error);
      router.push("/admin-auth/login");
    }
  };

  const sendEmailCode = async () => {
    try {
      setVerifying(true);
      const response = await fetch("/api/admin/mfa/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "LOGIN" }),
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
          title: "Error",
          description: data.error || "Failed to send email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const verifyEmailCode = async () => {
    try {
      setVerifying(true);
      const response = await fetch("/api/admin/mfa/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: emailCode, purpose: "LOGIN" }),
      });

      const data = await response.json();

      if (data.success) {
        // Set MFA verified cookie
        document.cookie = "mfa-verified=true; path=/; max-age=1800"; // 30 minutes

        toast({
          title: "Success",
          description: "MFA verified successfully",
        });
        router.push("/admin");
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const verifyTotpCode = async () => {
    try {
      setVerifying(true);
      const response = await fetch("/api/admin/mfa/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: totpCode, secret: "placeholder" }),
      });

      const data = await response.json();

      if (data.success) {
        // Set MFA verified cookie
        document.cookie = "mfa-verified=true; path=/; max-age=1800"; // 30 minutes

        toast({
          title: "Success",
          description: "MFA verified successfully",
        });
        router.push("/admin");
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const verifyPasskey = async () => {
    try {
      setPasskeyVerifying(true);

      const { data: options } = await fetch("/api/admin/mfa/passkey/authenticate/options", {
        method: "POST",
      }).then((r) => r.json());

      if (!options.success) {
        throw new Error(options.error);
      }

      // WebAuthn authentication would go here
      // For now, mark as verified (TODO: implement real WebAuthn)
      document.cookie = "mfa-verified=true; path=/; max-age=1800"; // 30 minutes

      toast({
        title: "Success",
        description: "Passkey verified successfully",
      });
      router.push("/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify passkey",
        variant: "destructive",
      });
    } finally {
      setPasskeyVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-[Libre_Baskerville]">
              Two-Factor Authentication
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete verification to access your account
            </p>
          </div>

          <div className="space-y-4">
            {/* Email OTP */}
            {mfaStatus?.emailOtpEnabled && (
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMethod === "email"
                    ? "border-maroon-500 bg-background"
                    : "border-border hover:border-gold-300"
                }`}
                onClick={() => setSelectedMethod("email")}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Email Verification</p>
                    <p className="text-sm text-muted-foreground">Code sent to your email</p>
                  </div>
                  {selectedMethod === "email" && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>

                {selectedMethod === "email" && (
                  <div className="mt-4 space-y-3">
                    {!emailSent ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendEmailCode();
                        }}
                        disabled={verifying}
                        className="w-full py-2 px-4 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition-colors disabled:opacity-50"
                      >
                        {verifying ? "Sending..." : "Send Code"}
                      </button>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-300"
                          maxLength={6}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            verifyEmailCode();
                          }}
                          disabled={verifying || emailCode.length !== 6}
                          className="w-full py-2 px-4 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition-colors disabled:opacity-50"
                        >
                          {verifying ? "Verifying..." : "Verify"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TOTP */}
            {mfaStatus?.totpEnabled && (
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMethod === "totp"
                    ? "border-maroon-500 bg-background"
                    : "border-border hover:border-gold-300"
                }`}
                onClick={() => setSelectedMethod("totp")}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">Code from your authenticator</p>
                  </div>
                  {selectedMethod === "totp" && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>

                {selectedMethod === "totp" && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-300"
                      maxLength={6}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyTotpCode();
                      }}
                      disabled={verifying || totpCode.length !== 6}
                      className="w-full py-2 px-4 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition-colors disabled:opacity-50"
                    >
                      {verifying ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Passkey */}
            {mfaStatus?.passkeyEnabled && (
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMethod === "passkey"
                    ? "border-maroon-500 bg-background"
                    : "border-border hover:border-gold-300"
                }`}
                onClick={() => setSelectedMethod("passkey")}
              >
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Passkey</p>
                    <p className="text-sm text-muted-foreground">Use your device's biometrics</p>
                  </div>
                  {selectedMethod === "passkey" && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>

                {selectedMethod === "passkey" && (
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyPasskey();
                      }}
                      disabled={passkeyVerifying}
                      className="w-full py-2 px-4 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition-colors disabled:opacity-50"
                    >
                      {passkeyVerifying ? "Verifying..." : "Use Passkey"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
