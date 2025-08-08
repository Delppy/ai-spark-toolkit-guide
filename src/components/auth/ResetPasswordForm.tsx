
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the proper parameters for password reset
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token || !email) {
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, find the user by email and sign them in temporarily to allow password update
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: decodeURIComponent(email),
        password: 'temporary_password_that_will_fail'
      });

      // This will fail, but that's expected. We'll use a different approach.
      // Let's use the admin API through an edge function to update the password
      const response = await supabase.functions.invoke('update-user-password', {
        body: {
          email: decodeURIComponent(email),
          newPassword: password,
          token
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to update password");
      }

      setLoading(false);

      toast({
        title: "Password updated!",
        description: "Your password has been successfully updated. You can now log in.",
        variant: "default",
      });

      navigate("/login");

    } catch (error: any) {
      console.error("Password update error:", error);
      setLoading(false);
      toast({
        title: "Reset failed",
        description: "Failed to update password. The reset link may have expired.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold">Set New Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="new-password">
              New Password
            </label>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-400" />
              <div className="relative flex-1">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-400" />
              <div className="relative flex-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
