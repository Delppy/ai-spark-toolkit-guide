
import { supabase } from "@/integrations/supabase/client";

/**
 * FAVORITES (favorites table)
 */
export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, itemId: string) {
  const { error } = await supabase.from("favorites").insert([{ user_id: userId, item_id: itemId }]);
  if (error) throw error;
}

export async function removeFavorite(userId: string, itemId: string) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);
  if (error) throw error;
}

/**
 * PROMPT USAGE (prompt_usage table)
 * Uses (userId, category, usagePeriod) as unique key
 */
export async function getPromptUsage(userId: string, category: string, period: string) {
  const { data, error } = await supabase
    .from("prompt_usage")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .eq("usage_period", period)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function incrementPromptUsage(userId: string, category: string, period: string) {
  // Fetch existing usage row
  const row = await getPromptUsage(userId, category, period);
  if (!row) {
    // Insert new usage
    const { error } = await supabase.from("prompt_usage").insert([
      { user_id: userId, category, usage_period: period, prompt_count: 1, last_used: new Date().toISOString() }
    ]);
    if (error) throw error;
  } else {
    // Update existing usage row (increment)
    const { error } = await supabase
      .from("prompt_usage")
      .update({ 
        prompt_count: row.prompt_count + 1, 
        last_used: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq("id", row.id);
    if (error) throw error;
  }
}

/**
 * PROMPT CREDITS (prompt_credits table)
 */
export async function getPromptCredits(userId: string, period: string) {
  const { data, error } = await supabase
    .from("prompt_credits")
    .select("*")
    .eq("user_id", userId)
    .eq("usage_period", period)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updatePromptCredits(userId: string, period: string, newBalance: number) {
  // Try to update, insert if not exists
  const row = await getPromptCredits(userId, period);
  if (!row) {
    const { error } = await supabase.from("prompt_credits").insert([
      { user_id: userId, usage_period: period, credit_balance: newBalance, updated_at: new Date().toISOString() }
    ]);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("prompt_credits")
      .update({ credit_balance: newBalance, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) throw error;
  }
}

/**
 * USER PLAN (user_plan table)
 */
export async function getUserPlan(userId: string) {
  const { data, error } = await supabase
    .from("user_plan")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Add, update plan, etc, can be implemented as needed

