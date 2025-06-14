
import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type ProfileModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ open, setOpen, children }) => (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetContent 
      side="bottom" 
      className={cn(
        "max-h-[80vh] overflow-y-auto rounded-t-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        "data-[state=closed]:duration-300 data-[state=open]:duration-500",
        "transition-all ease-in-out"
      )}
    >
      <div className="pt-2 animate-fade-in">{children}</div>
    </SheetContent>
  </Sheet>
);

export default ProfileModal;
