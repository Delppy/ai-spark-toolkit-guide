import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

export const usePromptCredits = (userId?: string) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isPro } = useSubscription(userId);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchCredits();
  }, [userId]);

  const fetchCredits = async () => {
    try {
      if (!userId) return;

      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format

      const { data, error } = await supabase
        .from('prompt_credits')
        .select('credit_balance')
        .eq('user_id', userId)
        .eq('usage_period', currentPeriod)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create initial credits for new user
        const { data: newCredit, error: insertError } = await supabase
          .from('prompt_credits')
          .insert({
            user_id: userId,
            credit_balance: 3,
            usage_period: currentPeriod
          })
          .select('credit_balance')
          .single();

        if (insertError) throw insertError;
        setCredits(newCredit.credit_balance);
      } else {
        setCredits(data.credit_balance);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    if (isPro) return true; // Pro users have unlimited access
    
    if (credits <= 0) {
      toast.error('No credits remaining. Upgrade to Pro for unlimited access!');
      return false;
    }

    try {
      if (!userId) return false;

      const currentPeriod = new Date().toISOString().slice(0, 7);

      const { error } = await supabase
        .from('prompt_credits')
        .update({ 
          credit_balance: credits - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('usage_period', currentPeriod);

      if (error) throw error;

      setCredits(prev => prev - 1);
      toast.success(`Credit used! ${credits - 1} credits remaining this month.`);
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast.error('Failed to use credit');
      return false;
    }
  };

  return {
    credits,
    loading,
    useCredit,
    hasCredits: credits > 0 || isPro,
    isPro
  };
};