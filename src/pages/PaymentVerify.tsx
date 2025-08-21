import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUserPreferences();
  const { checkStatus, refresh } = useSubscription(user?.id);
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const upgraded = searchParams.get('upgraded');
      
      if (!reference) {
        setSuccess(false);
        setMessage('No payment reference found');
        setVerifying(false);
        return;
      }

      try {
        // Verify payment with Paystack
        const { data, error } = await supabase.functions.invoke('paystack-verify', {
          body: { reference }
        });

        if (error) throw error;

        if (data?.status === 'success') {
          // Payment successful - refresh subscription status
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for webhook processing
          
          const status = await checkStatus();
          await refresh();
          
          if (status?.premium_badge) {
            setSuccess(true);
            setMessage('🎉 Premium activated! Ads removed and full access granted.');
            
            // Redirect to account with upgraded flag
            setTimeout(() => {
              navigate('/dashboard?upgraded=true');
            }, 3000);
          } else {
            setSuccess(true);
            setMessage('Payment processed. Premium activation in progress...');
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          }
        } else {
          setSuccess(false);
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setSuccess(false);
        setMessage('Payment verification failed. Please try again or contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, checkStatus, refresh, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {verifying && (
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
          )}
          {success === true && (
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          )}
          {success === false && (
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {verifying ? 'Verifying Payment' : success ? 'Payment Successful!' : 'Payment Failed'}
        </h1>

        <p className="text-muted-foreground mb-6">
          {message}
        </p>

        {!verifying && (
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
              variant={success ? "default" : "outline"}
            >
              Go to Dashboard
            </Button>
            
            {success === false && (
              <Button 
                onClick={() => navigate('/pricing')} 
                className="w-full"
                variant="default"
              >
                Try Again
              </Button>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Having issues? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;