
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore && session) navigate("/");
    });
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    let hasError = false;
    let nextErrors: typeof errors = {};

    if (!validateEmail(email)) {
      nextErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }
    if (confirm !== password) {
      nextErrors.confirm = "Passwords do not match.";
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      toast({
        title: "Signup failed",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error: signupErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Disable email confirmation by not providing emailRedirectTo
        data: {
          email: email,
        }
      },
    });

    setLoading(false);

    if (signupErr) {
      console.error("Signup error:", signupErr);
      
      // Handle specific error cases
      if (signupErr.message.includes("User already registered")) {
        setErrors({ email: "An account with this email already exists. Try logging in instead." });
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Try logging in instead.",
          variant: "destructive",
        });
      } else {
        setErrors({ email: signupErr.message });
        toast({
          title: "Signup failed",
          description: signupErr.message,
          variant: "destructive",
        });
      }
      return;
    }

    // Welcome message and redirect to dashboard
    toast({
      title: "Welcome to AiToUse! 🎉",
      description: "Your account has been created successfully. Welcome aboard!",
      variant: "default",
    });
    navigate("/");
  };

  // Removed email confirmation success state since we're not using email confirmation

  return (
    <Layout>
      <div className="flex items-center justify-center w-full min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="mx-auto w-full max-w-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">Sign Up for AiToUse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" aria-label="signup form">
              <div>
                <label className="block font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-400" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-err" : undefined}
                  />
                </div>
                {errors.email && (
                  <div className="text-sm text-red-600 mt-1" id="email-err" role="alert">
                    {errors.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-400" aria-hidden="true" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "pass-err" : undefined}
                  />
                </div>
                {errors.password && (
                  <div className="text-sm text-red-600 mt-1" id="pass-err" role="alert">
                    {errors.password}
                  </div>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="confirm">
                  Confirm Password
                </label>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-400" aria-hidden="true" />
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    aria-invalid={!!errors.confirm}
                    aria-describedby={errors.confirm ? "confirm-err" : undefined}
                  />
                </div>
                {errors.confirm && (
                  <div className="text-sm text-red-600 mt-1" id="confirm-err" role="alert">
                    {errors.confirm}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent font-semibold hover:underline inline-flex items-center gap-1 focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
