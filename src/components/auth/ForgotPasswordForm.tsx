
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && emailSent) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, emailSent]);

  const sendResetEmail = async (email: string, isResend = false) => {
    setLoading(true);
    
    const redirectUrl = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Send custom email via our edge function
    try {
      const resetLink = `${redirectUrl}#access_token=dummy&refresh_token=dummy`;
      
      const response = await supabase.functions.invoke('send-password-reset', {
        body: {
          email,
          resetLink: redirectUrl
        }
      });

      if (response.error) {
        console.error("Email sending error:", response.error);
      }
    } catch (error) {
      console.error("Edge function error:", error);
    }

    setLoading(false);
    setEmailSent(true);
    setCanResend(false);
    setCountdown(60);
    
    toast({
      title: isResend ? "Email resent!" : "Reset email sent!",
      description: "Check your email for password reset instructions.",
      variant: "default",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    await sendResetEmail(email);
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    await sendResetEmail(email, true);
  };

  if (emailSent) {
    return (
      <Card className="mx-auto w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-slate-600">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="text-sm text-slate-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleResend}
              variant="outline"
              className="w-full"
              disabled={!canResend || loading}
            >
              {loading ? (
                "Sending..."
              ) : canResend ? (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Email
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Resend in {countdown}s
                </>
              )}
            </Button>
            <Button 
              onClick={() => {
                setEmailSent(false);
                setCanResend(false);
                setCountdown(0);
              }}
              variant="ghost"
              className="w-full"
            >
              Try Different Email
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="reset-email">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-400" />
              <Input
                id="reset-email"
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
