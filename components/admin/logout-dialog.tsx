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
      <DialogContent className="bg-[#fffdf8] border-[#e9ddd3] sm:max-w-[425px] rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2d1816] font-['Libre_Baskerville']">Sign out?</DialogTitle>
          <DialogDescription className="text-[#2d1816]/60">
            You will be returned to the login page and will need to sign in again to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-[#e9ddd3] text-[#2d1816] hover:bg-[#e9ddd3]/30"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#aa322b] to-[#922821] hover:from-[#922821] hover:to-[#73201c]"
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
