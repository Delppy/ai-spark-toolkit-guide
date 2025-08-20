import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[BILLING-CRON] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting billing cron job");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const now = new Date();
    let processedReminders = 0;
    let expiredSubscriptions = 0;

    // Process billing reminders
    const { data: dueReminders } = await supabase
      .from("billing_reminders")
      .select("*")
      .lte("scheduled_at", now.toISOString())
      .is("sent_at", null);

    if (dueReminders && dueReminders.length > 0) {
      logStep("Processing due reminders", { count: dueReminders.length });
      
      for (const reminder of dueReminders) {
        // Mark reminder as sent
        await supabase
          .from("billing_reminders")
          .update({ sent_at: now.toISOString() })
          .eq("id", reminder.id);

        processedReminders++;
        logStep("Processed reminder", { type: reminder.reminder_type, email: reminder.email });
      }
    }

    // Auto-downgrade expired monthly subscriptions
    const graceHours = 24;
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setHours(gracePeriodEnd.getHours() - graceHours);

    const { data: expiredSubs } = await supabase
      .from("subscribers")
      .select("*")
      .eq("subscription_tier", "monthly")
      .in("subscription_status", ["active", "past_due"])
      .lt("subscription_ends_at", gracePeriodEnd.toISOString());

    if (expiredSubs && expiredSubs.length > 0) {
      logStep("Processing expired subscriptions", { count: expiredSubs.length });
      
      for (const sub of expiredSubs) {
        await supabase
          .from("subscribers")
          .update({
            subscription_status: 'expired',
            premium_badge: false,
            pro_enabled: false,
            updated_at: now.toISOString()
          })
          .eq("id", sub.id);

        expiredSubscriptions++;
        logStep("Expired subscription", { email: sub.email, endsAt: sub.subscription_ends_at });
      }
    }

    // Schedule upcoming reminders for active monthly subscriptions
    const { data: activeMonthly } = await supabase
      .from("subscribers")
      .select("*")
      .eq("subscription_tier", "monthly")
      .eq("subscription_status", "active")
      .not("subscription_ends_at", "is", null);

    let scheduledReminders = 0;
    if (activeMonthly && activeMonthly.length > 0) {
      for (const sub of activeMonthly) {
        const endsAt = new Date(sub.subscription_ends_at);
        
        // Schedule 3-day reminder
        const reminder3d = new Date(endsAt);
        reminder3d.setDate(reminder3d.getDate() - 3);
        
        // Schedule 1-day reminder
        const reminder1d = new Date(endsAt);
        reminder1d.setDate(reminder1d.getDate() - 1);
        
        // Schedule renewal day reminder
        const reminderToday = new Date(endsAt);

        const reminders = [
          { type: 'renewal_3d', scheduledAt: reminder3d },
          { type: 'renewal_1d', scheduledAt: reminder1d },
          { type: 'renewal_today', scheduledAt: reminderToday }
        ];

        for (const reminder of reminders) {
          // Check if reminder already exists
          const { data: existing } = await supabase
            .from("billing_reminders")
            .select("id")
            .eq("user_id", sub.user_id)
            .eq("reminder_type", reminder.type)
            .gte("scheduled_at", now.toISOString())
            .maybeSingle();

          if (!existing && reminder.scheduledAt > now) {
            await supabase
              .from("billing_reminders")
              .insert({
                user_id: sub.user_id,
                email: sub.email,
                reminder_type: reminder.type,
                scheduled_at: reminder.scheduledAt.toISOString()
              });
            
            scheduledReminders++;
          }
        }
      }
    }

    const result = {
      processed_reminders: processedReminders,
      expired_subscriptions: expiredSubscriptions,
      scheduled_reminders: scheduledReminders,
      timestamp: now.toISOString()
    };

    logStep("Cron job complete", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Cron job error", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});