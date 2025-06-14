
import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type ProfileModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ open, setOpen, children }) => (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-lg animate-fade-in">
      <div className="pt-2">{children}</div>
    </SheetContent>
  </Sheet>
);

export default ProfileModal;
