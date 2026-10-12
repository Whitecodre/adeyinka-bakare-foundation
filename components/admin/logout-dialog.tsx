"use client";

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

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Clear Supabase session
    // await supabase.auth.signOut();
    onOpenChange(false);
    router.push("/admin-auth/login");
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
          <Button variant="brand" className="h-11 sm:h-10" onClick={handleLogout}>
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
