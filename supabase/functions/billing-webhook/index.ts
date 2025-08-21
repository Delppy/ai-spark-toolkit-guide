import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache", 
  "Expires": "0"
};

interface WebhookPayload {
  event: string;
  data: {
    reference?: string;
    customer?: { email: string; customer_code: string };
    plan?: { name: string; plan_code: string };
    subscription?: { subscription_code: string };
    authorization?: { last4: string };
    amount?: number;
    currency?: string;
    status?: string;
  };
}

const logStep = (step: string, details?: any) => {
  console.log(`[BILLING-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const payload: WebhookPayload = await req.json();
    const eventId = payload.data.reference || `${payload.event}_${payload.data.customer?.email}_${payload.data.amount}`;
    
    logStep("Processing event", { eventType: payload.event, eventId });

    // Check for duplicate webhook using idempotency
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("provider_event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      logStep("Duplicate webhook ignored", { eventId });
      return new Response(JSON.stringify({ status: "duplicate_ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Store webhook event for audit
    await supabase.from("webhook_events").insert({
      provider_event_id: eventId,
      provider: "paystack",
      event_type: payload.event,
      raw_payload: payload,
      processed: false,
    });

    const email = payload.data.customer?.email;
    if (!email) {
      throw new Error("No customer email in webhook");
    }

    // Process webhook in transaction
    const { error: processError } = await supabase.rpc('process_billing_webhook', {
      p_event_type: payload.event,
      p_customer_email: email,
      p_customer_id: payload.data.customer?.customer_code || null,
      p_payment_ref: payload.data.reference || null,
      p_amount: payload.data.amount || 0,
      p_status: payload.data.status || '',
      p_plan_code: payload.data.plan?.plan_code || null,
      p_event_id: eventId
    });

    if (processError) {
      throw processError;
    }

    // Mark webhook as processed
    await supabase
      .from("webhook_events")
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq("provider_event_id", eventId);

    logStep("Webhook processed successfully", { eventType: payload.event, email });

    return new Response(JSON.stringify({ status: "processed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Webhook processing error", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Create the billing webhook processing function
async function createWebhookProcessor() {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  await supabase.rpc(`
    CREATE OR REPLACE FUNCTION process_billing_webhook(
      p_event_type TEXT,
      p_customer_email TEXT,
      p_customer_id TEXT DEFAULT NULL,
      p_payment_ref TEXT DEFAULT NULL,
      p_amount INTEGER DEFAULT 0,
      p_status TEXT DEFAULT '',
      p_plan_code TEXT DEFAULT NULL,
      p_event_id TEXT DEFAULT NULL
    )
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      subscription_tier_val TEXT := 'monthly';
      subscription_status_val TEXT := 'none';
      premium_badge_val BOOLEAN := false;
      ends_at_val TIMESTAMPTZ := NULL;
    BEGIN
      -- Determine subscription details based on event and plan
      IF p_event_type IN ('charge.success', 'subscription.create') AND p_status = 'success' THEN
        IF p_plan_code LIKE '%annual%' OR p_plan_code LIKE '%yearly%' THEN
          subscription_tier_val := 'annual';
          ends_at_val := now() + interval '1 year';
        ELSIF p_plan_code LIKE '%lifetime%' THEN
          subscription_tier_val := 'lifetime';
          subscription_status_val := 'lifetime';
          ends_at_val := NULL;
        ELSE
          subscription_tier_val := 'monthly';
          ends_at_val := now() + interval '1 month';
        END IF;
        
        IF subscription_tier_val != 'lifetime' THEN
          subscription_status_val := 'active';
        END IF;
        premium_badge_val := true;
        
      ELSIF p_event_type = 'invoice.payment_failed' OR p_status = 'failed' THEN
        subscription_status_val := 'past_due';
        premium_badge_val := false;
        
      ELSIF p_event_type = 'subscription.disable' THEN
        subscription_status_val := 'expired';
        premium_badge_val := false;
      END IF;

      -- Update subscriber record
      INSERT INTO public.subscribers (
        email, provider_customer_id, subscription_status, subscription_tier,
        premium_badge, subscription_started_at, subscription_ends_at, last_payment_ref,
        pro_enabled, expires_at, updated_at
      )
      VALUES (
        p_customer_email, p_customer_id, subscription_status_val, subscription_tier_val,
        premium_badge_val, now(), ends_at_val, p_payment_ref,
        premium_badge_val, ends_at_val, now()
      )
      ON CONFLICT (email)
      DO UPDATE SET
        provider_customer_id = COALESCE(EXCLUDED.provider_customer_id, subscribers.provider_customer_id),
        subscription_status = EXCLUDED.subscription_status,
        subscription_tier = EXCLUDED.subscription_tier,
        premium_badge = EXCLUDED.premium_badge,
        subscription_started_at = COALESCE(EXCLUDED.subscription_started_at, subscribers.subscription_started_at),
        subscription_ends_at = EXCLUDED.subscription_ends_at,
        last_payment_ref = COALESCE(EXCLUDED.last_payment_ref, subscribers.last_payment_ref),
        pro_enabled = EXCLUDED.pro_enabled,
        expires_at = EXCLUDED.expires_at,
        updated_at = now();
    END;
    $$
  `);
}