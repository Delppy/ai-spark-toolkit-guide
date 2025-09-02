
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useFreeAccess";

import PricingHeader from "@/components/pricing/PricingHeader";
import BillingToggle from "@/components/pricing/BillingToggle";
import PlanCard from "@/components/pricing/PlanCard";
import { 
  proFeatures, 
  freeFeatures, 
  getUserRegion,
  getPricingForRegion,
  YEARLY_DISCOUNT_PERCENT 
} from "@/data/pricing";

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<boolean>(false);
  const [regionData, setRegionData] = useState<{ country: string; isAfrica: boolean } | null>(null);
  const [pricing, setPricing] = useState<{ currency: string; monthly: number; yearly: number; symbol: string } | null>(null);
  const { user, loading: authLoading } = useUserPreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkStatus, isPro, subscriptionStatus, refresh: refreshSubscription } = useSubscription(user?.id || null);

  // Check for payment success parameters and refresh subscription
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    
    if (paymentSuccess && user) {
      // Refresh subscription status after successful payment
      setTimeout(async () => {
        await refreshSubscription();
        console.log('Subscription refreshed after payment success');
      }, 1000);
    }

    // Also refresh when user comes back to the tab (after payment)
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location, user, refreshSubscription]);

  useEffect(() => {
    const detectRegion = async () => {
      const region = await getUserRegion();
      setRegionData(region);
      setPricing(getPricingForRegion(region.isAfrica));
    };
    detectRegion();
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      // Debug the current user context state
      console.log('User context:', { user, authLoading });
      
      // If we're still loading auth, wait for it
      if (authLoading) {
        console.log('Auth still loading, please wait...');
        toast.info('Loading user data...');
        setLoading(false);
        return;
      }
      
      // Check user context first (faster than session call)
      if (!user) {
        console.log('No user in context, redirecting to login');
        toast.error('Please log in to upgrade your account');
        navigate('/login');
        return;
      }
      
      // Get fresh session data as backup check
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Fresh session check:', { 
        hasSession: !!session, 
        hasUser: !!session?.user, 
        userEmail: session?.user?.email,
        error: sessionError 
      });
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please try logging in again.');
        navigate('/login');
        return;
      }
      
      if (!session?.user) {
        console.warn('No session user found, but context user exists. Proceeding with context user.');
      }

      console.log('Initiating payment for user:', user.email || session?.user?.email);

      // Ensure we have a fresh session and access token
      const { data: { session: freshSession }, error: sessionRefreshError } = await supabase.auth.refreshSession();
      
      if (sessionRefreshError || !freshSession?.access_token) {
        console.error('Failed to refresh session:', sessionRefreshError);
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      console.log('Using fresh session token for payment');

      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: {
          planCode: 'pro',
          billing: billing,
        },
        headers: {
          Authorization: `Bearer ${freshSession.access_token}`
        }
      });

      if (error) {
        console.error('Payment initialization error:', error);
        throw error;
      }

      console.log('Payment response:', data);
      
      // Redirect to Paystack payment page
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const proPriceDisplay = !pricing ? (
    <span className="text-2xl">Loading...</span>
  ) : billing === "monthly" ? (
    <>
      <span className="text-4xl font-extrabold">{pricing.symbol}{pricing.monthly.toFixed(2)}</span>
      <span className="text-base font-normal text-muted-foreground">/month</span>
    </>
  ) : (
    <>
      <span className="text-4xl font-extrabold">{pricing.symbol}{pricing.yearly.toFixed(2)}</span>
      <span className="text-base font-normal text-muted-foreground">/year</span>
      <div className="text-sm text-muted-foreground mt-1">
        <span className="line-through">{pricing.symbol}{(pricing.monthly * 12).toFixed(2)}</span>
        <span className="ml-2 text-accent font-semibold">
          Save {pricing.symbol}{((pricing.monthly * 12) - pricing.yearly).toFixed(2)}
        </span>
      </div>
    </>
  );
    
  const freePriceDisplay = !pricing ? (
    <span className="text-2xl">Loading...</span>
  ) : (
    <p className="text-3xl font-bold">{pricing.symbol}0<span className="text-base font-normal text-muted-foreground">/month</span></p>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col items-center justify-start py-10 px-2">
      <PricingHeader />
      
      {regionData && (
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Detected location: {regionData.country} | Currency: {pricing?.currency}
          </p>
        </div>
      )}
      
      <BillingToggle 
        billing={billing} 
        setBilling={setBilling} 
        yearlyDiscountPercent={YEARLY_DISCOUNT_PERCENT} 
      />

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl">
        <PlanCard
          planType="Free"
          billing={billing}
          price={freePriceDisplay}
          features={freeFeatures}
          isCurrentPlan={!isPro && !!user}
        />
        <PlanCard
          planType="Pro"
          billing={billing}
          price={proPriceDisplay}
          features={proFeatures}
          isPopular={true}
          onUpgrade={authLoading ? undefined : (user ? handleUpgrade : () => navigate('/login'))}
          loading={loading || !pricing || authLoading}
          yearlyDiscountPercent={YEARLY_DISCOUNT_PERCENT}
          isCurrentPlan={isPro}
        />
      </div>

      {/* Subscription Refresh Button removed since everything is free */}
      

      <div className="mt-10">
        <Link to="/">
          <Button variant="ghost" className="text-accent underline">← Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Pricing;
