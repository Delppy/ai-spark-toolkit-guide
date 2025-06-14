
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore && !session) {
        navigate("/login", { replace: true });
      }
      if (!ignore && session?.user) {
        setUser(session.user);
        setEmail(session.user.email ?? "");
      }
    });
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out.",
      variant: "default",
    });
    navigate("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Update email (if changed)
    if (email && user && email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      toast({
        title: "Email updated",
        description: "Please check your new email for confirmation.",
        variant: "default",
      });
      setUser({ ...user, email });
      setEditing(false);
      setLoading(false);
      return;
    }
    setEditing(false);
    setLoading(false);
  };

  const handleUpgrade = () => {
    // TODO: Integrate Stripe/create-checkout session.
    toast({
      title: "Coming soon",
      description: "Subscription upgrades coming soon.",
    });
  };

  const handleCancelSubscription = () => {
    // TODO: Integrate Stripe portal/cancel logic.
    toast({
      title: "Coming soon",
      description: "Subscription cancellation coming soon.",
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">Loading...</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="flex items-center justify-center w-full min-h-[80vh] py-12">
        <Card className="mx-auto w-full max-w-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4" aria-label="profile edit form">
              <div>
                <label htmlFor="profile-email" className="block font-medium mb-1">
                  Email
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!editing}
                  className={!editing ? "bg-gray-100" : ""}
                />
              </div>
              <div className="flex gap-2 mt-4">
                {!editing ? (
                  <Button type="button" variant="outline" onClick={() => setEditing(true)}>
                    Edit Email
                  </Button>
                ) : (
                  <>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditing(false);
                        setEmail(user.email);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button type="button" variant="destructive" className="ml-auto" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </form>
            <div className="mt-8 border-t pt-6">
              <div className="font-semibold mb-3">Subscription</div>
              <div className="flex flex-col gap-3">
                <Button type="button" onClick={handleUpgrade} className="w-full bg-gradient-to-r from-purple-500 to-blue-600">
                  Upgrade Subscription
                </Button>
                <Button type="button" variant="destructive" onClick={handleCancelSubscription} className="w-full">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
