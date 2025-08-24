import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';

const PaymentVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserPreferences();
  const { refresh } = useSubscription(user?.id);
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const handleVerification = async () => {
      // Check if we've been redirected from the Edge Function with upgraded=true
      if (location.pathname === '/account' && searchParams.get('upgraded') === 'true') {
        // We're already on the success page after Edge Function redirect
        await refresh();
        return;
      }

      // Handle the case where we're on /payment/verify (fallback for client-side verification)
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      const paymentRef = reference || trxref;
      
      if (!paymentRef) {
        setVerifying(false);
        setSuccess(false);
        setMessage('Invalid payment reference. Please try again.');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('paystack-verify', {
          body: { reference: paymentRef },
        });

        if (error) {
          throw error;
        }

        if (data?.status === 'success') {
          setSuccess(true);
          setMessage('Payment successful! Your premium features are now active.');
          
          // Refresh subscription status
          await refresh();
          
          // Navigate to account page since Edge Function redirect didn't happen
          setTimeout(() => {
            navigate('/account?upgraded=true');
          }, 2000);
        } else {
          setSuccess(false);
          setMessage('Payment verification failed. Please contact support if you were charged.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setSuccess(false);
        setMessage('Unable to verify payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    handleVerification();
  }, [searchParams, navigate, refresh, location]);

  // If we're redirected to /account with upgraded=true, don't show this page
  if (location.pathname === '/account' && searchParams.get('upgraded') === 'true') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {verifying ? (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
            <h2 className="text-2xl font-bold text-foreground">{message}</h2>
          </>
        ) : (
          <>
            {success ? (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
            )}
            <h2 className="text-2xl font-bold text-foreground">{message}</h2>
            <div className="space-y-4">
              {success ? (
                <Button onClick={() => navigate('/account')} className="w-full">
                  Go to Account
                </Button>
              ) : (
                <>
                  <Button onClick={() => navigate('/pricing')} className="w-full">
                    Try Again
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Need help?{' '}
                    <a href="/contact" className="text-primary hover:underline">
                      Contact Support
                    </a>
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;