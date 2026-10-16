"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BellOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function UnsubscribeForm({ email }: { email: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to unsubscribe");
      }
      toast({
        title: "Unsubscribed",
        description: "You won't receive the monthly digest anymore.",
      });
      router.push(`/unsubscribe?email=${encodeURIComponent(email)}&confirmed=1`);
      router.refresh();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Couldn't unsubscribe",
        description: err?.message || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="brand"
        onClick={handleConfirm}
        disabled={submitting}
        className="h-12 px-7 shadow-lg shadow-primary/30"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Unsubscribing…
          </>
        ) : (
          <>
            <BellOff className="size-4" />
            Yes, unsubscribe me
          </>
        )}
      </Button>
    </div>
  );
}
