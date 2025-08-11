import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, X, Cookie } from 'lucide-react';
import { analytics } from '@/utils/analytics';

const AnalyticsConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('analytics-consent');
    const hasDeclined = localStorage.getItem('analytics-declined');
    
    if (!hasConsent && !hasDeclined) {
      // Show consent banner after a short delay
      const timer = setTimeout(() => setShowConsent(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    analytics.initialize(true);
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('analytics-declined', 'true');
    setShowConsent(false);
  };

  const handleClose = () => {
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-primary mb-2">
                Help us improve your experience
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                We use analytics to understand how you use our platform and improve your experience. 
                Your data is anonymous and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleAccept}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary flex-1"
                >
                  <Cookie className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button 
                  onClick={handleDecline}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Decline
                </Button>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="p-1 h-auto flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsConsent;