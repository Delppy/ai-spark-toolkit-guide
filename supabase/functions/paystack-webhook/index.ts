
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
      case 'invoice.create':
        await handleInvoiceCreated(supabaseAdmin, event.data)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(supabaseAdmin, event.data)
        break
      default:
        console.log('Unhandled event type:', event.event)
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
  const email = data.customer.email

  if (!user_id) {
    console.error('No user_id in metadata')
    return
  }

  const expires_at = new Date()
  if (plan === 'yearly') {
    expires_at.setFullYear(expires_at.getFullYear() + 1)
  } else {
    expires_at.setMonth(expires_at.getMonth() + 1)
  }

  // First check if subscriber exists
  const { data: existingSubscriber } = await supabase
    .from('subscribers')
    .select('id')
    .eq('user_id', user_id)
    .single()

  if (existingSubscriber) {
    // Update existing subscriber
    const { error } = await supabase
      .from('subscribers')
      .update({
        email: email,
        plan: plan,
        pro_enabled: true,
        expires_at: expires_at.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)
    
    if (error) {
      console.error('Error updating subscriber record:', error)
    } else {
      console.log('Subscriber record updated successfully')
    }
  } else {
    // Insert new subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert({
        user_id: user_id,
        email: email,
        plan: plan,
        pro_enabled: true,
        expires_at: expires_at.toISOString(),
        updated_at: new Date().toISOString(),
      })
    
    if (error) {
      console.error('Error creating subscriber record:', error)
    } else {
      console.log('Subscriber record created successfully')
    }
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
