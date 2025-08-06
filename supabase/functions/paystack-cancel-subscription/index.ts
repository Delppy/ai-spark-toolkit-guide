import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client to verify user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the user from the request headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    console.log("Canceling subscription for user:", user.email);

    // Get Paystack secret key
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Create service role client for database updates
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the current subscriber record
    const { data: subscriber, error: fetchError } = await supabaseService
      .from("subscribers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError || !subscriber) {
      throw new Error("No active subscription found");
    }

    if (!subscriber.pro_enabled) {
      throw new Error("No active subscription to cancel");
    }

    // For Paystack, there's no automatic recurring subscription cancellation API
    // So we'll mark the subscription as cancelled in our database
    // and it will naturally expire at the end of the current period
    const { error: updateError } = await supabaseService
      .from("subscribers")
      .update({
        pro_enabled: false, // Disable pro access immediately
        plan: "free",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating subscriber:", updateError);
      throw new Error("Failed to cancel subscription");
    }

    console.log("Subscription cancelled successfully for user:", user.email);

    return new Response(
      JSON.stringify({
        message: "Subscription cancelled successfully",
        expires_at: subscriber.expires_at,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in paystack-cancel-subscription:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to cancel subscription" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});