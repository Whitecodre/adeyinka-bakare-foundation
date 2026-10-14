"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();

  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      // Ends the Supabase session and clears its cookies.
      await createClient().auth.signOut();
      // Also drop the client-set MFA flag so the next login starts clean.
      document.cookie = "mfa-verified=; path=/; max-age=0";
    } finally {
      setSigningOut(false);
      onOpenChange(false);
      router.push("/admin-auth/login");
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Sign out?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You will be returned to the login page and will need to sign in again to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" className="h-11 sm:h-10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="brand" className="h-11 sm:h-10" loading={signingOut} onClick={handleLogout}>
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
