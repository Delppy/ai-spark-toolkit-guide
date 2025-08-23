import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;

    const { data: subscriber, error } = await supabase
      .from("subscribers")
      .select("premium_badge, pro_enabled, plan, subscription_status, subscription_tier, subscription_ends_at, expires_at")
      .eq("email", user.email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const is_premium = !!(subscriber?.premium_badge || subscriber?.pro_enabled);

    const payload = {
      is_premium,
      plan: subscriber?.plan ?? null,
      subscription_status: subscriber?.subscription_status ?? "none",
      subscription_tier: subscriber?.subscription_tier ?? "none",
      expires_at: subscriber?.subscription_ends_at ?? subscriber?.expires_at ?? null,
      email: user.email,
      user_id: user.id,
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
