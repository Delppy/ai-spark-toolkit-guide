
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

      const expires_at = new Date();
      if (plan === 'yearly') {
        expires_at.setFullYear(expires_at.getFullYear() + 1);
      } else {
        expires_at.setMonth(expires_at.getMonth() + 1);
      }

      const { error: dbError } = await supabaseAdmin
        .from('subscribers')
        .upsert(
          { 
            user_id: user_id,
            email: email,
            plan: plan,
            pro_enabled: true,
            expires_at: expires_at.toISOString(),
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
