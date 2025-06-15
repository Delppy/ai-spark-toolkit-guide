
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useSubscription } from '@/hooks/useSubscription';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUserPreferences();
  const { refresh: refreshSubscription } = useSubscription(user?.id);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        toast.error('Payment reference not found.');
        navigate('/pricing');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('paystack-verify', {
          body: { reference },
        });

        if (error) {
          throw error;
        }

        if (data.status === 'success') {
          await refreshSubscription();
          toast.success('Payment successful! Your account has been upgraded to Pro.');
          const redirectTo = localStorage.getItem("afterProRedirect") || "/profile";
          localStorage.removeItem("afterProRedirect");
          navigate(redirectTo);
        } else {
          toast.error(`Payment failed: ${data.message || 'Unknown error'}`);
          navigate('/pricing');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        toast.error(error.message || 'An error occurred during payment verification.');
        navigate('/pricing');
      }
    };

    if (user?.id) {
      verifyPayment();
    }
  }, [searchParams, navigate, user, refreshSubscription]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Verifying your payment...</h1>
        <p className="text-slate-600">Please do not close this window.</p>
      </div>
    </Layout>
  );
};

export default PaymentVerify;
