import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const SubscriptionRefreshButton: React.FC = () => {
  const { user } = useUserPreferences();
  const { refresh, loading } = useSubscription(user?.id);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      // Call the refresh-subscription edge function
      const { data, error } = await supabase.functions.invoke('refresh-subscription');
      
      if (error) throw error;
      
      // Refresh the local subscription state
      await refresh();
      
      if (data.pro_enabled) {
        toast.success('🎉 Pro subscription activated! You now have access to all premium features.');
      } else {
        toast.info('No active subscription found. Please complete your payment to activate Pro features.');
      }
    } catch (error) {
      toast.error('Failed to refresh subscription status');
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      onClick={handleRefresh}
      disabled={loading || isRefreshing}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
      {(loading || isRefreshing) ? 'Refreshing...' : 'Refresh Status'}
    </Button>
  );
};