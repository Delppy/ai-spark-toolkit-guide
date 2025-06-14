
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
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
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      toast({
        title: "Login failed",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast({
        title: "Login failed",
        description: "Please enter a valid password.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error: loginErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (loginErr) {
      setError(loginErr.message);
      toast({
        title: "Login failed",
        description: loginErr.message,
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Login successful!",
        description: "Welcome back to AiToUse.",
        variant: "default",
      });
      setEmail("");
      setPassword("");
      // Redirect after successful login
      setTimeout(() => {
        navigate("/");
      }, 400);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center w-full min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="mx-auto w-full max-w-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">Login to AiToUse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" aria-label="login form">
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
                    aria-invalid={!!error && error.toLowerCase().includes("email")}
                    aria-describedby={!!error && error.toLowerCase().includes("email") ? "login-email-err" : undefined}
                  />
                </div>
                {!!error && error.toLowerCase().includes("email") && (
                  <div className="text-sm text-red-600 mt-1" id="login-email-err" role="alert">
                    {error}
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
                    autoComplete="current-password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    aria-invalid={!!error && error.toLowerCase().includes("password")}
                    aria-describedby={!!error && error.toLowerCase().includes("password") ? "login-pass-err" : undefined}
                  />
                </div>
                {!!error && error.toLowerCase().includes("password") && (
                  <div className="text-sm text-red-600 mt-1" id="login-pass-err" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-1 focus-visible:outline focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <UserPlus className="w-4 h-4" /> Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
