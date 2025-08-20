import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[BILLING-RECONCILIATION] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting reconciliation job");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY not configured");
    }

    // Fetch successful transactions from Paystack for last 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const paystackResponse = await fetch(`https://api.paystack.co/transaction?status=success&from=${sixtyDaysAgo.toISOString()}&perPage=100`, {
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!paystackResponse.ok) {
      throw new Error(`Paystack API error: ${paystackResponse.statusText}`);
    }

    const paystackData = await paystackResponse.json();
    const transactions = paystackData.data || [];
    
    logStep("Retrieved Paystack transactions", { count: transactions.length });

    let updatedCount = 0;
    let alreadyActiveCount = 0;
    const duplicates: any[] = [];

    for (const transaction of transactions) {
      const email = transaction.customer?.email;
      if (!email) continue;

      // Check current subscription status
      const { data: subscriber } = await supabase
        .from("subscribers")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      // Skip if already active/lifetime
      if (subscriber?.subscription_status === 'active' || subscriber?.subscription_status === 'lifetime') {
        alreadyActiveCount++;
        continue;
      }

      // Determine subscription details from transaction
      let subscriptionTier = 'monthly';
      let subscriptionStatus = 'active';
      let endsAt = new Date();
      
      const amount = transaction.amount / 100; // Paystack amount is in kobo
      
      if (amount >= 12000) { // Annual pricing
        subscriptionTier = 'annual';
        endsAt.setFullYear(endsAt.getFullYear() + 1);
      } else if (amount >= 50000) { // Lifetime pricing
        subscriptionTier = 'lifetime';
        subscriptionStatus = 'lifetime';
        endsAt = null;
      } else { // Monthly pricing
        endsAt.setMonth(endsAt.getMonth() + 1);
      }

      // Check for duplicate payments within same billing period
      const { data: existingPayments } = await supabase
        .from("subscribers")
        .select("last_payment_ref, subscription_started_at")
        .eq("email", email)
        .not("last_payment_ref", "is", null);

      if (existingPayments && existingPayments.length > 0) {
        const recentPayment = existingPayments.find(p => {
          if (!p.subscription_started_at) return false;
          const paymentDate = new Date(p.subscription_started_at);
          const transactionDate = new Date(transaction.created_at);
          const diffDays = Math.abs(transactionDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays <= 7; // Within 7 days
        });

        if (recentPayment) {
          duplicates.push({
            email,
            transaction_ref: transaction.reference,
            existing_ref: recentPayment.last_payment_ref,
            amount
          });
          continue;
        }
      }

      // Update subscription status
      const updateData = {
        subscription_status: subscriptionStatus,
        subscription_tier: subscriptionTier,
        premium_badge: true,
        subscription_started_at: new Date(transaction.created_at).toISOString(),
        subscription_ends_at: endsAt ? endsAt.toISOString() : null,
        provider_customer_id: transaction.customer?.customer_code || null,
        last_payment_ref: transaction.reference,
        pro_enabled: true,
        expires_at: endsAt ? endsAt.toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from("subscribers")
        .upsert({
          email,
          ...updateData
        }, { onConflict: 'email' });

      if (updateError) {
        logStep("Failed to update subscriber", { email, error: updateError.message });
      } else {
        updatedCount++;
        logStep("Updated subscriber", { email, status: subscriptionStatus, tier: subscriptionTier });
      }
    }

    const result = {
      total_transactions: transactions.length,
      updated_subscribers: updatedCount,
      already_active: alreadyActiveCount,
      duplicates_found: duplicates.length,
      duplicates: duplicates
    };

    logStep("Reconciliation complete", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Reconciliation error", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});