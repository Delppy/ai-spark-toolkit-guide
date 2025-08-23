
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Paystack verify function starting up')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()
    if (!reference) {
      return new Response(JSON.stringify({ error: 'Missing reference' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is not set');
      return new Response(JSON.stringify({ error: 'Payment processor not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const verificationResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    if (!verificationResponse.ok) {
        const errorBody = await verificationResponse.text()
        console.error('Paystack verification API error:', errorBody)
        return new Response(JSON.stringify({ error: 'Failed to verify payment with Paystack' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: verificationResponse.status,
        })
    }

    const { data: verificationData } = await verificationResponse.json()

    if (verificationData.status === 'success') {
      const { user_id, plan } = verificationData.metadata;
      const email = verificationData.customer.email;

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Determine subscription details
      const now = new Date();
      let ends_at: Date | null = new Date(now);
      let subscription_status = 'active';
      let subscription_tier = 'monthly';
      if (plan === 'yearly') {
        ends_at!.setFullYear(ends_at!.getFullYear() + 1);
        subscription_tier = 'annual';
      } else if (plan === 'lifetime') {
        subscription_status = 'lifetime';
        subscription_tier = 'lifetime';
        ends_at = null;
      } else {
        ends_at!.setMonth(ends_at!.getMonth() + 1);
        subscription_tier = 'monthly';
      }

      const last_payment_ref = verificationData.reference;
      const provider_customer_id = verificationData.customer?.customer_code || null;

      const { error: dbError } = await supabaseAdmin
        .from('subscribers')
        .upsert(
          { 
            user_id: user_id,
            email: email,
            plan: plan,
            pro_enabled: true,
            premium_badge: true,
            subscription_status: subscription_status,
            subscription_tier: subscription_tier,
            subscription_started_at: now.toISOString(),
            subscription_ends_at: ends_at ? ends_at.toISOString() : null,
            expires_at: ends_at ? ends_at.toISOString() : null,
            last_payment_ref: last_payment_ref,
            provider_customer_id: provider_customer_id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      
      if (dbError) {
        console.error('Error updating subscriber record:', dbError);
      }
    }
    
    return new Response(JSON.stringify(verificationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
