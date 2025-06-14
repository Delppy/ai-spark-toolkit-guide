
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileFavorites = () => {
  // Placeholder
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-6 text-center">Your saved prompts and tools will show here soon!</p>
      </CardContent>
    </Card>
  );
};

export default ProfileFavorites;
