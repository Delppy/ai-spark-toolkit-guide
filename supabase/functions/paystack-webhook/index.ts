
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

console.log('Paystack Webhook handler starting up')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Webhook request received')
    
    // Get the Paystack secret key for webhook verification
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is not set');
      return new Response('Webhook not configured', { status: 500 })
    }

    // Get the signature from headers
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) {
      console.error('No signature provided')
      return new Response('No signature', { status: 400 })
    }

    // Get the request body
    const body = await req.text()
    console.log('Request body received:', body.substring(0, 100) + '...')

    // Verify the webhook signature
    const hash = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      hash,
      new TextEncoder().encode(body)
    )
    
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedSignatureHex) {
      console.error('Invalid signature')
      return new Response('Invalid signature', { status: 400 })
    }

    console.log('Signature verified successfully')

    // Parse the webhook payload
    const event = JSON.parse(body)
    console.log('Event type:', event.event)
    console.log('Event data:', JSON.stringify(event.data, null, 2))

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Idempotency: store and check processed events
    const provider_event_id = String(event.data?.id ?? event.data?.reference ?? crypto.randomUUID())
    const event_type = String(event.event ?? 'unknown')

    const { data: existingEvent, error: checkErr } = await supabaseAdmin
      .from('webhook_events')
      .select('id, processed')
      .eq('provider', 'paystack')
      .eq('provider_event_id', provider_event_id)
      .maybeSingle()

    if (checkErr) {
      console.error('Error checking webhook_events:', checkErr)
    }

    if (existingEvent?.processed) {
      console.log('Webhook already processed, skipping:', provider_event_id)
      return new Response(JSON.stringify({ received: true, idempotent: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Insert event row if it does not exist yet
    if (!existingEvent) {
      const { error: insertErr } = await supabaseAdmin
        .from('webhook_events')
        .insert({
          raw_payload: event,
          processed: false,
          provider: 'paystack',
          event_type,
          provider_event_id,
        })

      if (insertErr) {
        console.error('Failed to insert webhook_events row:', insertErr)
      }
    }

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(supabaseAdmin, event.data)
        break
      case 'subscription.create':
        await handleSubscriptionCreated(supabaseAdmin, event.data)
        break
      case 'subscription.disable':
        await handleSubscriptionDisabled(supabaseAdmin, event.data)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(supabaseAdmin, event.data)
        break
      default:
        console.log('Unhandled event type:', event.event)
    }

    // Mark event as processed
    const { error: markErr } = await supabaseAdmin
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('provider', 'paystack')
      .eq('provider_event_id', provider_event_id)

    if (markErr) {
      console.error('Failed to mark webhook as processed:', markErr)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function handleSuccessfulPayment(supabase: any, data: any) {
  console.log('Processing successful payment:', data.reference)
  
  const { user_id, plan } = data.metadata || {}
  const email = data.customer?.email
  const provider_customer_id = data.customer?.customer_code || null
  const last_payment_ref = data.reference

  if (!user_id || !email) {
    console.error('Missing user_id or email in webhook payload')
    return
  }

  // Determine subscription fields
  const now = new Date()
  let ends_at: Date | null = new Date(now)
  let subscription_status = 'active'
  let subscription_tier = 'monthly'

  if (plan === 'yearly') {
    ends_at!.setFullYear(ends_at!.getFullYear() + 1)
    subscription_tier = 'annual'
  } else if (plan === 'lifetime') {
    subscription_status = 'lifetime'
    subscription_tier = 'lifetime'
    ends_at = null
  } else {
    ends_at!.setMonth(ends_at!.getMonth() + 1)
    subscription_tier = 'monthly'
  }

  const upsertPayload = {
    user_id,
    email,
    plan: plan ?? 'monthly',
    pro_enabled: true,
    premium_badge: true,
    subscription_status,
    subscription_tier,
    subscription_started_at: now.toISOString(),
    subscription_ends_at: ends_at ? ends_at.toISOString() : null,
    expires_at: ends_at ? ends_at.toISOString() : null,
    last_payment_ref,
    provider_customer_id,
    updated_at: now.toISOString(),
  }

  const { error } = await supabase
    .from('subscribers')
    .upsert(upsertPayload, { onConflict: 'user_id' })

  if (error) {
    console.error('Error upserting subscriber record from webhook:', error)
  } else {
    console.log('Subscriber upserted from webhook successfully')
  }
}

async function handleSubscriptionCreated(supabase: any, data: any) {
  console.log('Processing subscription created:', data.subscription_code)
  
  // Handle subscription creation logic here
  // This might involve updating subscriber status, setting up billing cycles, etc.
}

async function handleSubscriptionDisabled(supabase: any, data: any) {
  console.log('Processing subscription disabled:', data.subscription_code)
  
  const email = data.customer.email
  
  const { error } = await supabase
    .from('subscribers')
    .update({ 
      pro_enabled: false,
      updated_at: new Date().toISOString(),
    })
    .eq('email', email)
  
  if (error) {
    console.error('Error disabling subscription:', error)
  } else {
    console.log('Subscription disabled successfully')
  }
}

async function handleInvoiceCreated(supabase: any, data: any) {
  console.log('Processing invoice created:', data.invoice_code)
  
  // Handle invoice creation logic here
  // This might involve logging billing events, sending notifications, etc.
}

async function handlePaymentFailed(supabase: any, data: any) {
  console.log('Processing payment failed:', data.invoice_code)
  
  // Handle payment failure logic here
  // This might involve notifying users, updating payment status, etc.
  const email = data.customer.email
  
  // You might want to mark the subscription as having payment issues
  const { error } = await supabase
    .from('subscribers')
    .update({ 
      updated_at: new Date().toISOString(),
    })
    .eq('email', email)
  
  if (error) {
    console.error('Error updating payment failure:', error)
  }
}
