
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
 * REVIEWS (reviews table)
 */
export async function getToolReviews(toolId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getToolReviewStats(toolId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("tool_id", toolId);
  
  if (error) throw error;
  
  if (!data || data.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }
  
  const totalReviews = data.length;
  const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  return { averageRating, totalReviews };
}

export async function addReview(userId: string, toolId: string, rating: number, title?: string, content?: string) {
  const { error } = await supabase.from("reviews").insert([
    { user_id: userId, tool_id: toolId, rating, title, content }
  ]);
  if (error) throw error;
}

export async function getUserReview(userId: string, toolId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("tool_id", toolId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * REVIEW VOTES (review_votes table)
 */
export async function getUserReviewVotes(userId: string) {
  const { data, error } = await supabase
    .from("review_votes")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function addReviewVote(userId: string, reviewId: string, isHelpful: boolean) {
  const { error } = await supabase.from("review_votes").insert([
    { user_id: userId, review_id: reviewId, is_helpful: isHelpful }
  ]);
  if (error) throw error;
}

export async function updateReviewVote(userId: string, reviewId: string, isHelpful: boolean) {
  const { error } = await supabase
    .from("review_votes")
    .update({ is_helpful: isHelpful })
    .eq("user_id", userId)
    .eq("review_id", reviewId);
  if (error) throw error;
}

export async function removeReviewVote(userId: string, reviewId: string) {
  const { error } = await supabase
    .from("review_votes")
    .delete()
    .eq("user_id", userId)
    .eq("review_id", reviewId);
  if (error) throw error;
}

/**
 * PROMPT USAGE - Stubbed since tables are removed
 */
export async function getPromptUsage(userId: string, category: string, period: string) {
  // No-op - everything is free
  return null;
}

export async function incrementPromptUsage(userId: string, category: string, period: string) {
  // No-op - everything is free
  return;
}

/**
 * PROMPT CREDITS - Stubbed since tables are removed
 */
export async function getPromptCredits(userId: string, period: string) {
  // No-op - everything is free
  return null;
}

export async function updatePromptCredits(userId: string, period: string, newBalance: number) {
  // No-op - everything is free
  return;
}

/**
 * USER PLAN - Stubbed since tables are removed
 */
export async function getUserPlan(userId: string) {
  // No-op - everything is free
  return null;
}

// Add, update plan, etc, can be implemented as needed
