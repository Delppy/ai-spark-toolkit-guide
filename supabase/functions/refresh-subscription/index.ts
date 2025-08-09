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

    // Get the existing subscriber record
    const { data: existingSubscriber, error: fetchError } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching subscriber:', fetchError);
      throw new Error('Failed to fetch subscription record');
    }

    console.log('Existing subscriber:', existingSubscriber);

    // Update the subscriber record with pro enabled
    const updateData = {
      pro_enabled: true,
      plan: 'monthly',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    let dbError;
    if (existingSubscriber) {
      // Update existing record
      const { error } = await supabaseClient
        .from('subscribers')
        .update(updateData)
        .eq('id', existingSubscriber.id);
      dbError = error;
    } else {
      // Insert new record
      const { error } = await supabaseClient
        .from('subscribers')
        .insert({
          ...updateData,
          user_id: user.id,
          email: user.email,
        });
      dbError = error;
    }

    if (dbError) {
      console.error('Database update error:', dbError);
      throw new Error('Failed to update subscription record');
    }

    console.log(`Subscription updated: pro_enabled=true, plan=monthly`);

    return new Response(JSON.stringify({
      success: true,
      pro_enabled: true,
      plan: 'monthly',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Pro subscription activated'
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