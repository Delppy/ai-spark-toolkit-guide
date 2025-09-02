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
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Verify Paystack signature
    const paystackSignature = req.headers.get("x-paystack-signature");
    const body = await req.text();
    
    // Use Web Crypto API for HMAC verification
    const encoder = new TextEncoder();
    const keyData = encoder.encode(paystackSecretKey);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign", "verify"]
    );
    
    const messageData = encoder.encode(body);
    const signature = await crypto.subtle.sign("HMAC", key, messageData);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (paystackSignature !== expectedSignature) {
      console.log("Invalid signature:", paystackSignature, "Expected:", expectedSignature);
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Received Paystack webhook:", event.event, "Reference:", event.data?.reference);

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (event.event === "charge.success") {
      const { reference, id: transaction_id, amount, currency, paid_at, customer } = event.data;
      
      // Get payment record
      const { data: payment } = await supabaseService
        .from("payments")
        .select("*")
        .eq("paystack_reference", reference)
        .single();

      if (!payment) {
        console.error("Payment not found for reference:", reference);
        return new Response("Payment not found", { status: 404 });
      }

      // Update payment status
      await supabaseService
        .from("payments")
        .update({
          status: "success",
          paystack_transaction_id: transaction_id,
          paid_at: new Date(paid_at).toISOString(),
          payment_method: customer?.risk_action || "card",
        })
        .eq("paystack_reference", reference);

      // Create or update subscription
      const { data: existingSubscription } = await supabaseService
        .from("subscriptions")
        .select("*")
        .eq("user_id", payment.user_id)
        .single();

      const planCode = "pro"; // You can extract this from metadata if needed
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1); // Add 1 month

      if (existingSubscription) {
        // Update existing subscription
        await supabaseService
          .from("subscriptions")
          .update({
            status: "active",
            next_payment_date: nextPaymentDate.toISOString(),
          })
          .eq("user_id", payment.user_id);
      } else {
        // Create new subscription
        await supabaseService
          .from("subscriptions")
          .insert({
            user_id: payment.user_id,
            plan_code: planCode,
            status: "active",
            amount: amount,
            currency: currency,
            next_payment_date: nextPaymentDate.toISOString(),
          });
      }

      console.log(`User ${payment.user_id} upgraded to Pro successfully`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing Paystack IPN:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});