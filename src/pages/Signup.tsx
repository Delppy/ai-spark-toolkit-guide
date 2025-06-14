
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle signup logic here...
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Layout>
      <div className="flex items-center justify-center w-full min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="mx-auto w-full max-w-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">Sign Up for AiToUse</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium mb-1" htmlFor="email">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="password">Password</label>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="confirm">Confirm Password</label>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-400" />
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-lg" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
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
