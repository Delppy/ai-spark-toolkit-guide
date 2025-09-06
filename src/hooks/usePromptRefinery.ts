import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromptUsageData {
  allowed: boolean;
  is_paid: boolean;
  used_today: number;
  remaining: number;
  limit: number;
  reset_at?: string;
  error?: string;
}

interface PromptUsageStatus {
  allowed: boolean;
  isPaidPro: boolean;
  usedToday: number;
  remaining: number;
  limit: number;
  resetAt?: string;
  loading: boolean;
}

export function usePromptRefinery() {
  const [usageStatus, setUsageStatus] = useState<PromptUsageStatus>({
    allowed: false,
    isPaidPro: false,
    usedToday: 0,
    remaining: 0,
    limit: 0,
    loading: true,
  });

  // Check current usage status
  const checkUsage = async () => {
    try {
      const { data, error } = await supabase.rpc('rpc_check_prompt_usage');
      
      if (error) {
        console.error('Error checking prompt usage:', error);
        return;
      }

      const usageData = data as unknown as PromptUsageData;
      
      setUsageStatus({
        allowed: usageData.allowed,
        isPaidPro: usageData.is_paid,
        usedToday: usageData.used_today || 0,
        remaining: usageData.remaining || 0,
        limit: usageData.limit || 0,
        resetAt: usageData.reset_at,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to check prompt usage:', err);
      setUsageStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Use a prompt credit
  const useCredit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('rpc_use_prompt_credit');
      
      if (error) {
        console.error('Error using prompt credit:', error);
        toast.error('Failed to process prompt request');
        return false;
      }

      const usageData = data as unknown as PromptUsageData;

      if (!usageData.allowed) {
        toast.error(`Daily limit reached (${usageData.limit}/day). Upgrade to PRO for unlimited access!`);
        setUsageStatus({
          allowed: false,
          isPaidPro: usageData.is_paid,
          usedToday: usageData.used_today || 0,
          remaining: 0,
          limit: usageData.limit || 0,
          resetAt: usageData.reset_at,
          loading: false,
        });
        return false;
      }

      setUsageStatus({
        allowed: true,
        isPaidPro: usageData.is_paid,
        usedToday: usageData.used_today || 0,
        remaining: usageData.remaining || 0,
        limit: usageData.limit || 0,
        resetAt: usageData.reset_at,
        loading: false,
      });

      // Show remaining credits for free users
      if (!usageData.is_paid && usageData.remaining > 0 && usageData.remaining <= 3) {
        toast.info(`${usageData.remaining} prompt refinements remaining today`);
      }

      return true;
    } catch (err) {
      console.error('Failed to use prompt credit:', err);
      toast.error('An error occurred. Please try again.');
      return false;
    }
  };

  useEffect(() => {
    checkUsage();
    
    // Refresh usage status when user logs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUsage();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    ...usageStatus,
    checkUsage,
    useCredit,
    isUnlimited: usageStatus.isPaidPro,
  };
}