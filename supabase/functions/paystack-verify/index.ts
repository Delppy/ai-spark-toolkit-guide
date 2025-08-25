
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Paystack verify function starting up')

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
    // Support both GET and POST
    let reference: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      reference = url.searchParams.get('reference');
    } else {
      const body = await req.json();
      reference = body.reference;
    }
    
    if (!reference) {
      return new Response(JSON.stringify({ error: 'Missing reference' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    console.log(`Verifying payment with reference: ${reference}`);
    
    // Determine which key to use based on environment and headers
    const origin = req.headers.get('origin') || '';
    const referer = req.headers.get('referer') || '';
    const hasProdHint = origin.includes('aitouse.app') || referer.includes('aitouse.app');
    
    let paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (hasProdHint && Deno.env.get('PAYSTACK_SECRET_KEY_LIVE')) {
      paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY_LIVE');
      console.log('Using LIVE Paystack key for verification (prod hint)');
    } else if (!origin && !referer && Deno.env.get('PAYSTACK_SECRET_KEY_LIVE')) {
      // No origin/referer (direct callback) – prefer LIVE key
      paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY_LIVE');
      console.log('Using LIVE Paystack key for verification (no origin)');
    } else if (!hasProdHint && Deno.env.get('PAYSTACK_SECRET_KEY_TEST')) {
      paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY_TEST');
      console.log('Using TEST Paystack key for verification (non-prod)');
    }
    
    if (!paystackSecretKey) {
      console.error('No Paystack secret key found');
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
    
    console.log(`Payment verification result: ${verificationData.status} for reference: ${reference}`);

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
      if (plan === 'yearly' || plan === 'annual') {
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

      console.log(`Upserting subscriber record for email: ${email}, user_id: ${user_id}`);

      // Use email as the conflict key since it's unique in the schema
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
          { onConflict: 'email' } // Changed from 'user_id' to 'email'
        );
      
      if (dbError) {
        console.error('Error updating subscriber record:', dbError);
        // Don't fail the verification, proceed with redirect
      } else {
        console.log('Successfully updated subscriber record');
      }

      // Return a 302 redirect to the success page
      const baseUrl = isProduction ? 'https://aitouse.app' : (origin || 'https://aitouse.app');
      const redirectUrl = `${baseUrl}/account?upgraded=true`;
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl,
        },
      });
    } else {
      // Payment failed - redirect to retry page
      const redirectUrl = isProduction 
        ? 'https://aitouse.app/pricing?payment_status=failed&reason=verify_failed'
        : `${origin}/pricing?payment_status=failed&reason=verify_failed`;
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl,
        },
      });
    }

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
