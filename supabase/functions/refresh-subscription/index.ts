import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the user from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log(`Refreshing subscription for user: ${user.email}`);

    // Check if user has active Paystack subscriptions
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    // Get customer from Paystack
    const customerResponse = await fetch(`https://api.paystack.co/customer/${encodeURIComponent(user.email)}`, {
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
      },
    });

    let hasActivePlan = false;
    let currentPlan = 'free';
    let expiresAt = null;

    if (customerResponse.ok) {
      const customerData = await customerResponse.json();
      console.log('Paystack customer data:', customerData);
      
      // Check for active subscriptions
      const subscriptionsResponse = await fetch(`https://api.paystack.co/subscription?customer=${customerData.data.customer_code}`, {
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      });

      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json();
        const activeSubscriptions = subscriptionsData.data.filter(
          (sub: any) => sub.status === 'active'
        );

        if (activeSubscriptions.length > 0) {
          hasActivePlan = true;
          const subscription = activeSubscriptions[0];
          currentPlan = subscription.plan.interval; // 'monthly' or 'yearly'
          expiresAt = new Date(subscription.next_payment_date).toISOString();
          console.log('Found active subscription:', subscription);
        }
      }
    }

    // Update the subscriber record
    const { error: dbError } = await supabaseClient
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email,
        plan: hasActivePlan ? currentPlan : 'free',
        pro_enabled: hasActivePlan,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('Database update error:', dbError);
      throw new Error('Failed to update subscription record');
    }

    console.log(`Subscription updated: pro_enabled=${hasActivePlan}, plan=${currentPlan}`);

    return new Response(JSON.stringify({
      success: true,
      pro_enabled: hasActivePlan,
      plan: currentPlan,
      expires_at: expiresAt,
      message: hasActivePlan ? 'Pro subscription activated' : 'No active subscription found'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in refresh-subscription:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});