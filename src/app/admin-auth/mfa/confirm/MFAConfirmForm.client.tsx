"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Key, Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MFAConfirmForm() {
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

      // console.log("MFA status data:", data);

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
    const code = totpCode.trim();
    if (!/^\d{6}$/.test(code)) {
      toast({ title: "Error", description: "Enter the 6-digit code from your authenticator app", variant: "destructive" });
      return;
    }
    try {
      setVerifying(true);
      const response = await fetch("/api/admin/mfa/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, token: code }),
      });

      const data = await response.json();

      if (data.success) {
        document.cookie = "mfa-verified=true; path=/; max-age=1800";
        toast({ title: "Success", description: "MFA verified successfully" });
        const redirect = new URLSearchParams(window.location.search).get("redirect") || "/admin";
        router.push(redirect);
      } else {
        toast({ title: "Error", description: data.error || "Invalid code", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to verify code", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const verifyPasskey = async () => {
    setPasskeyVerifying(true);
    try {
      console.log("Starting passkey verification...");
      const optsRes = await fetch("/api/admin/mfa/passkey/authenticate/options", { method: "POST" });
      const optsJson = await optsRes.json();
      if (!optsJson.success) throw new Error(optsJson.error || "No passkeys registered or failed to start authentication");

      // This is what triggers Windows Hello / Touch ID / phone prompt
      const { startAuthentication } = await import("@simplewebauthn/browser");
      let authResp: unknown;
      try {
        authResp = await startAuthentication({ optionsJSON: optsJson.data } as any);
      } catch (e: any) {
        if (e?.name === "NotAllowedError") throw new Error("Passkey prompt was cancelled or timed out. Please try again and approve Windows Hello / your device.");
        throw new Error(e?.message || "Passkey was not completed");
      }

      console.log("Passkey authentication response received, verifying...");
      const verifyRes = await fetch("/api/admin/mfa/passkey/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: authResp }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) throw new Error(verifyJson.error || "Passkey verification failed");

      // console.log("Passkey verification successful, setting cookie...");
      document.cookie = "mfa-verified=true; path=/; max-age=1800";
      // console.log("Cookie set:", document.cookie);

      toast({ title: "Success", description: "Passkey verified successfully" });

      // Small delay to ensure cookie is set before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      const redirect = new URLSearchParams(window.location.search).get("redirect") || "/admin";
      console.log("Redirecting to:", redirect);
      router.push(redirect);
    } catch (error: any) {
      console.error("Passkey verification error:", error);
      toast({ title: "Error", description: error.message || "Failed to verify passkey", variant: "destructive" });
    } finally {
      setPasskeyVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="mx-auto mt-8 flex w-full max-w-md flex-1 flex-col justify-center lg:mt-0">
        <div className="abf-fade-up space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Two-Factor Authentication
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete verification to access your account
            </p>
          </div>

          <div className="space-y-4">
            {/* Email OTP */}
            {mfaStatus?.emailOtpEnabled && (
              <div
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  selectedMethod === "email"
                    ? "border-primary bg-primary/5"
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
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendEmailCode();
                        }}
                        disabled={verifying}
                        className="h-11 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 font-semibold text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700"
                      >
                        {verifying ? "Sending..." : "Send Code"}
                      </Button>
                    ) : (
                      <>
                        <Input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          className="h-11 tracking-widest"
                          maxLength={6}
                          disabled={verifying}
                        />
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            verifyEmailCode();
                          }}
                          disabled={verifying || emailCode.length !== 6}
                          className="h-11 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 font-semibold text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700"
                        >
                          {verifying ? "Verifying..." : "Verify"}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TOTP */}
            {mfaStatus?.totpEnabled && (
              <div
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  selectedMethod === "totp"
                    ? "border-primary bg-primary/5"
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
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="h-11 tracking-widest"
                      maxLength={6}
                    />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyTotpCode();
                      }}
                      disabled={verifying || totpCode.length !== 6}
                      className="h-11 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 font-semibold text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700"
                    >
                      {verifying ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Passkey */}
            {mfaStatus?.passkeyEnabled && (
              <div
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  selectedMethod === "passkey"
                    ? "border-primary bg-primary/5"
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
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyPasskey();
                      }}
                      disabled={passkeyVerifying}
                      className="h-11 w-full bg-gradient-to-r from-maroon-500 to-maroon-600 font-semibold text-white shadow-lg shadow-primary/30 hover:from-maroon-600 hover:to-maroon-700"
                    >
                      {passkeyVerifying ? "Verifying..." : "Use Passkey"}
                    </Button>
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
