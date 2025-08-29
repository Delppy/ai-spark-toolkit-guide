import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get the current origin for the redirect URL
      const resetPasswordUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetPasswordUrl,
      });

      if (error) {
        if (error.message.includes('User not found')) {
          setError('No account found with this email address.');
        } else {
          setError(error.message);
        }
        toast.error('Failed to send reset email');
      } else {
        // Send custom email via edge function with better formatting
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          // Generate the reset link (Supabase will handle the actual token generation)
          const resetLink = `${window.location.origin}/reset-password`;
          
          await supabase.functions.invoke('send-password-reset', {
            body: { 
              email,
              resetLink: resetLink
            }
          });
        } catch (emailError) {
          console.error('Failed to send custom reset email:', emailError);
          // Don't block the process if custom email fails, Supabase default email was sent
        }
        
        setResetSent(true);
        toast.success('Password reset instructions sent!');
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
        title="Forgot Password - AiToUse"
        description="Reset your AiToUse account password."
        noindex={true}
      />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {resetSent 
                ? "Check your email for reset instructions" 
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSent ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-8">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <h3 className="text-lg font-semibold">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    We've sent password reset instructions to <strong>{email}</strong>. 
                    Please check your inbox and follow the link to reset your password.
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    The link will expire in 1 hour for security reasons.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setResetSent(false);
                      setEmail('');
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the email address associated with your account
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          {!resetSent && (
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground text-center">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign up for free
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;