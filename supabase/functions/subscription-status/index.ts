import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

const logStep = (step: string, details?: any) => {
  console.log(`[SUBSCRIPTION-STATUS] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Checking subscription status");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get subscription status
    const { data: subscriber, error: fetchError } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Failed to fetch subscription: ${fetchError.message}`);
    }

    const now = new Date();
    let isActive = false;
    let isPremium = false;
    let status = 'none';

    if (subscriber) {
      status = subscriber.subscription_status || 'none';
      isPremium = !!subscriber.premium_badge;
      
      // Check if subscription is still active
      if (status === 'active' && subscriber.subscription_ends_at) {
        const endsAt = new Date(subscriber.subscription_ends_at);
        isActive = now <= endsAt;
        
        // Auto-expire if past end date
        if (!isActive && status === 'active') {
          logStep("Auto-expiring subscription", { email: user.email, endsAt: subscriber.subscription_ends_at });
          
          await supabase
            .from("subscribers")
            .update({
              subscription_status: 'expired',
              premium_badge: false,
              pro_enabled: false,
              updated_at: now.toISOString()
            })
            .eq("email", user.email);
            
          status = 'expired';
          isPremium = false;
        }
      } else if (status === 'lifetime') {
        isActive = true;
        isPremium = true;
      }
    }

    const response = {
      subscription_status: status,
      subscription_tier: subscriber?.subscription_tier || 'none',
      premium_badge: isPremium,
      is_active: isActive,
      subscription_ends_at: subscriber?.subscription_ends_at,
      last_updated: now.toISOString()
    };

    logStep("Status check complete", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Status check error", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});