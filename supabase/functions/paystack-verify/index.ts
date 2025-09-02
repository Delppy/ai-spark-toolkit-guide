import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();
    
    if (!reference) {
      throw new Error("Payment reference is required");
    }

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const paystackData = await paystackResponse.json();
    
    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to verify payment");
    }

    const transactionData = paystackData.data;
    console.log("Payment verification result:", transactionData.status, "Reference:", reference);

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update payment status in database
    const { data: payment } = await supabaseService
      .from("payments")
      .select("*")
      .eq("paystack_reference", reference)
      .single();

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (transactionData.status === "success") {
      // Update payment record
      await supabaseService
        .from("payments")
        .update({
          status: "success",
          paystack_transaction_id: transactionData.id,
          paid_at: new Date(transactionData.paid_at).toISOString(),
        })
        .eq("paystack_reference", reference);

      // Create or update subscription
      const { data: existingSubscription } = await supabaseService
        .from("subscriptions")
        .select("*")
        .eq("user_id", payment.user_id)
        .single();

      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      if (existingSubscription) {
        await supabaseService
          .from("subscriptions")
          .update({
            status: "active",
            next_payment_date: nextPaymentDate.toISOString(),
          })
          .eq("user_id", payment.user_id);
      } else {
        await supabaseService
          .from("subscriptions")
          .insert({
            user_id: payment.user_id,
            plan_code: "pro",
            status: "active",
            amount: transactionData.amount,
            currency: transactionData.currency,
            next_payment_date: nextPaymentDate.toISOString(),
          });
      }
    } else {
      // Update payment as failed
      await supabaseService
        .from("payments")
        .update({
          status: "failed",
          paystack_transaction_id: transactionData.id,
        })
        .eq("paystack_reference", reference);
    }

    return new Response(
      JSON.stringify({
        status: transactionData.status,
        message: transactionData.gateway_response || "Payment processed",
        amount: transactionData.amount,
        currency: transactionData.currency,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});