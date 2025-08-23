
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Paystack initialize function starting up')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { amount, email, plan, callback_url, currency } = await req.json()
    const reference = crypto.randomUUID()

    if (!amount || !email || !plan || !currency) {
      return new Response(JSON.stringify({ error: 'Missing required fields: amount, email, plan, currency' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is not set in environment variables');
      return new Response(JSON.stringify({ error: 'Payment processor not configured.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo/pesewas
        currency,
        callback_url,
        reference,
        metadata: {
          user_id: user.id,
          plan,
        },
      }),
    })

    if (!paystackResponse.ok) {
        const errorBody = await paystackResponse.text();
        console.error('Paystack API error:', errorBody);
        return new Response(JSON.stringify({ error: 'Failed to initialize payment with Paystack.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: paystackResponse.status,
        });
    }

    const responseData = await paystackResponse.json()

    return new Response(JSON.stringify(responseData.data), {
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
