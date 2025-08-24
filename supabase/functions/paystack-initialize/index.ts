
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Paystack initialize function starting up')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-store',
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

    // Check if user is already premium
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('subscription_status, premium_badge, pro_enabled')
      .eq('email', user.email)
      .maybeSingle();

    if (subscriber && (subscriber.subscription_status === 'active' || subscriber.subscription_status === 'lifetime' || subscriber.premium_badge || subscriber.pro_enabled)) {
      return new Response(JSON.stringify({ error: 'You already have an active premium subscription' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 409,
      })
    }

    const { amount, email, plan, currency } = await req.json()
    const reference = crypto.randomUUID()

    console.log(`Initializing payment for user ${user.id}, email: ${email}, plan: ${plan}, reference: ${reference}`)

    if (!amount || !email || !plan || !currency) {
      return new Response(JSON.stringify({ error: 'Missing required fields: amount, email, plan, currency' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Determine which key to use based on environment
    const origin = req.headers.get('origin') || '';
    const isProduction = origin.includes('aitouse.app');
    
    let paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (isProduction && Deno.env.get('PAYSTACK_SECRET_KEY_LIVE')) {
      paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY_LIVE');
      console.log('Using LIVE Paystack key for production environment');
    } else if (!isProduction && Deno.env.get('PAYSTACK_SECRET_KEY_TEST')) {
      paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY_TEST');
      console.log('Using TEST Paystack key for development environment');
    }
    
    if (!paystackSecretKey) {
      console.error('No Paystack secret key found in environment variables');
      return new Response(JSON.stringify({ error: 'Payment processor not configured.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Use server-side callback URL to avoid SPA 404s
    const callback_url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/paystack-verify`;

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
