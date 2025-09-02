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
    // Get JWT token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No valid authorization header");
    }

    const jwt = authHeader.replace("Bearer ", "");
    
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);
    
    if (userError || !user?.email) {
      console.error("User authentication error:", userError);
      throw new Error("User not authenticated");
    }

    console.log(`Authenticated user: ${user.email} (${user.id})`);

    const { planCode, billing } = await req.json();
    
    // Get pricing based on plan and billing cycle
    const amounts = {
      monthly: { NGN: 499900, USD: 4999 }, // ₦4,999 or $49.99
      yearly: { NGN: 4799000, USD: 4799 }   // ₦47,990 or $47.99 
    };
    
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Determine currency and amount based on user location
    const currency = "NGN"; // Default to NGN, you can add geo-detection later
    const amount = amounts[billing as keyof typeof amounts][currency];
    
    // Generate unique reference
    const reference = `aitouse_${user.id}_${Date.now()}`;
    
    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount,
        currency: currency,
        reference: reference,
        callback_url: `${req.headers.get("origin")}/payment-success`,
        metadata: {
          user_id: user.id,
          plan_code: planCode,
          billing: billing,
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    
    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    // Store payment record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseService.from("payments").insert({
      user_id: user.id,
      paystack_reference: reference,
      amount: amount,
      currency: currency,
      status: "pending",
    });

    console.log(`Payment initialized for user ${user.id}, reference: ${reference}`);

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error initializing payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});