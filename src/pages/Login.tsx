import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserPreferences();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Get the intended destination from state or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email before logging in. Check your inbox for the confirmation link.');
        } else {
          setError(error.message);
        }
        toast.error('Login failed');
      } else if (data?.user) {
        // Store additional persistent session data only if remember me is checked
        if (rememberMe) {
          localStorage.setItem('aitouse-user-authenticated', 'true');
          localStorage.setItem('aitouse-last-login', Date.now().toString());
          toast.success('Welcome back! You\'ll stay signed in for 30 days.');
        } else {
          // Clear any existing persistent data if user doesn't want to be remembered
          localStorage.removeItem('aitouse-user-authenticated');
          localStorage.removeItem('aitouse-last-login');
          toast.success('Welcome back!');
        }
        
        // Navigate to the intended destination or home
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Login - AiToUse"
        description="Sign in to your AiToUse account to access premium AI tools and features."
        noindex={true}
      />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access all premium features for free
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                />
                <Label 
                  htmlFor="remember-me" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                state={{ from: location.state?.from }}
                className="text-primary hover:underline font-medium"
              >
                Sign up for free
              </Link>
            </div>
            <Link 
              to="/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;