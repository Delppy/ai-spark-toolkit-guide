
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SubscriptionRefreshButton } from "@/components/SubscriptionRefreshButton";

import PricingHeader from "@/components/pricing/PricingHeader";
import BillingToggle from "@/components/pricing/BillingToggle";
import PlanCard from "@/components/pricing/PlanCard";
import { 
  proFeatures, 
  freeFeatures, 
  MONTHLY_PRICE, 
  YEARLY_PRICE, 
  YEARLY_DISCOUNT_PERCENT 
} from "@/data/pricing";

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUserPreferences();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpgrade = async () => {
    if (!user || !user.email) {
      localStorage.setItem("afterProRedirect", location.pathname);
      toast.error("Please sign in to upgrade.");
      navigate("/login");
      return;
    }

    setLoading(true);

    const price = billing === "monthly" ? MONTHLY_PRICE : YEARLY_PRICE;
    const callback_url = `${window.location.origin}/payment/verify`;

    try {
      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: {
          email: user.email,
          amount: price,
          plan: billing,
          callback_url: callback_url,
          currency: 'GHS'
        },
      });

      if (error) {
        throw error;
      }
      
      if (data && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error("Could not initiate payment. Please try again.");
        setLoading(false);
      }

    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast.error(error.message || "An unexpected error occurred during payment initiation.");
      setLoading(false);
    }
  };

  const proPriceDisplay = billing === "monthly"
    ? (
      <>
        <span className="text-4xl font-extrabold">GHS {MONTHLY_PRICE.toFixed(2)}</span>
        <span className="text-base font-normal text-muted-foreground">/month</span>
      </>
    ) : (
      <>
        <span className="text-4xl font-extrabold">GHS {YEARLY_PRICE.toFixed(2)}</span>
        <span className="text-base font-normal text-muted-foreground">/year</span>
        <div className="text-sm text-muted-foreground mt-1">
          <span className="line-through">GHS {(MONTHLY_PRICE * 12).toFixed(2)}</span>
          <span className="ml-2 text-accent font-semibold">
            Save GHS {((MONTHLY_PRICE * 12) - YEARLY_PRICE).toFixed(2)}
          </span>
        </div>
      </>
    );
    
  const freePriceDisplay = (
    <p className="text-3xl font-bold">GHS 0<span className="text-base font-normal text-muted-foreground">/month</span></p>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col items-center justify-start py-10 px-2">
      <PricingHeader />
      
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
          isCurrentPlan={true}
        />
        <PlanCard
          planType="Pro"
          billing={billing}
          price={proPriceDisplay}
          features={proFeatures}
          isPopular={true}
          onUpgrade={handleUpgrade}
          loading={loading}
          yearlyDiscountPercent={YEARLY_DISCOUNT_PERCENT}
        />
      </div>

      {/* Subscription Refresh Button */}
      {user && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Just completed a payment? Refresh your subscription status:
          </p>
          <SubscriptionRefreshButton />
        </div>
      )}

      <div className="mt-10">
        <Link to="/">
          <Button variant="ghost" className="text-accent underline">← Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Pricing;
