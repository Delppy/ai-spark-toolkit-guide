
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileActivity = () => {
  // Placeholder
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-6 text-center">Prompt usage and activity stats coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default ProfileActivity;
