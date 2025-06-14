
import { Button } from "@/components/ui/button";

const ProfileAccountTab = () => {
  return (
    <div className="space-y-4">
      <Button className="w-full" variant="outline">Privacy Policy</Button>
      <Button className="w-full" variant="outline">Terms of Service</Button>
      <Button className="w-full" variant="destructive">Delete Account</Button>
    </div>
  );
};

export default ProfileAccountTab;
