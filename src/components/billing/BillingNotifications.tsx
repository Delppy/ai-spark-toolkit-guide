import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const BillingNotifications: React.FC = () => {
  const { user } = useUserPreferences();
  const { subscriptionStatus, subscriptionEndsAt, premiumBadge, subscriptionTier } = useSubscription(user?.id);

  if (!user || !subscriptionEndsAt) return null;

  const now = new Date();
  const endsAt = new Date(subscriptionEndsAt);
  const daysUntilExpiry = Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Show notifications based on subscription status and timing
  const getNotification = () => {
    if (subscriptionStatus === 'past_due') {
      return {
        type: 'warning' as const,
        icon: <AlertTriangle className="w-4 h-4" />,
        title: 'Payment Issue Detected',
        message: 'We couldn\'t process your payment. We\'ll hold your Premium for 24 hours—please retry to avoid downgrade.',
        action: 'Update Payment'
      };
    }

    if (subscriptionStatus === 'expired') {
      return {
        type: 'error' as const,
        icon: <XCircle className="w-4 h-4" />,
        title: 'Premium Expired',
        message: 'Your monthly Premium expired and your account was moved to the free plan. You can upgrade anytime.',
        action: 'Upgrade Again'
      };
    }

    if (subscriptionStatus === 'active' && subscriptionTier === 'monthly') {
      if (daysUntilExpiry <= 1) {
        return {
          type: 'warning' as const,
          icon: <Clock className="w-4 h-4" />,
          title: 'Renewal Tomorrow',
          message: 'Your aitouse Premium renews tomorrow. Update payment if needed.',
          action: 'Manage Billing'
        };
      }

      if (daysUntilExpiry <= 3) {
        return {
          type: 'info' as const,
          icon: <Clock className="w-4 h-4" />,
          title: 'Renewal Reminder',
          message: `Your aitouse Premium renews in ${daysUntilExpiry} days. Please ensure payment is set to continue ad-free.`,
          action: 'Manage Billing'
        };
      }
    }

    // Show success notification if recently upgraded
    if (premiumBadge && subscriptionStatus === 'active') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('upgraded') === 'true') {
        return {
          type: 'success' as const,
          icon: <CheckCircle className="w-4 h-4" />,
          title: 'Premium Activated',
          message: 'Premium activated. Ads removed.',
          action: null
        };
      }
    }

    return null;
  };

  const notification = getNotification();
  if (!notification) return null;

  const getAlertVariant = () => {
    switch (notification.type) {
      case 'success': return 'default';
      case 'warning': return 'destructive';
      case 'error': return 'destructive';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  return (
    <Alert variant={getAlertVariant()} className="mb-4">
      <div className="flex items-center gap-2">
        {notification.icon}
        <div className="flex-1">
          <div className="font-semibold">{notification.title}</div>
          <AlertDescription className="mt-1">
            {notification.message}
          </AlertDescription>
        </div>
        {notification.action && (
          <Button variant="outline" size="sm">
            {notification.action}
          </Button>
        )}
      </div>
    </Alert>
  );
};