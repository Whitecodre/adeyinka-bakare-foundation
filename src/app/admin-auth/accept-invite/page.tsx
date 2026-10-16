"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { metadata } from "./metadata";

function AcceptInviteInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<{ email: string; full_name: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setError("Missing invite token"); setLoading(false); return; }
    fetch(`/api/auth/accept-invite?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) setInvite(j.data);
        else setError(j.error || "Invalid invite");
      })
      .catch(() => setError("Failed to validate invite"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast({ variant: "destructive", title: "Password must be at least 8 characters" }); return; }
    if (password !== confirm) { toast({ variant: "destructive", title: "Passwords do not match" }); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/accept-invite", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ token, password, confirmPassword: confirm }) });
      const j = await res.json();
      if (!j.success) throw new Error(j.error);
      toast({ title: "Account created", description: "You can now sign in." });
      router.push("/admin-auth/login");
    } catch (err:any) {
      toast({ variant:"destructive", title:"Failed", description: err.message });
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><Loader2 className="animate-spin" /></div>;
  if (error) return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col justify-center py-8">
      <Card className="mx-auto max-w-md">
        <CardHeader><CardTitle className="flex gap-2 items-center"><AlertTriangle className="text-destructive" /> Invite error</CardTitle><CardDescription>{error}</CardDescription></CardHeader>
        <CardContent><Link href="/admin-auth/login" className="text-sm text-primary underline">Back to login</Link></CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col justify-center py-8">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><ShieldCheck className="text-maroon-600" /> Accept invite</CardTitle>
          <CardDescription>Welcome {invite?.full_name} ({invite?.email}) — set your password to activate your {invite?.role?.replace("_"," ")} account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
            </div>
            <Button type="submit" disabled={submitting} variant="brand" className="w-full">
              {submitting ? <><Loader2 className="mr-2 size-4 animate-spin" /> Creating account</> : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] grid place-items-center"><Loader2 className="animate-spin" /></div>}>
      <AcceptInviteInner />
    </Suspense>
  );
}
