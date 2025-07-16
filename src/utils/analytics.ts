// Analytics utility for tracking user interactions
interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean = false;
  private userId?: string;

  constructor() {
    // Enable analytics only in production and when consent is given
    this.isEnabled = typeof window !== 'undefined' && 
                    window.location.hostname !== 'localhost' &&
                    this.hasUserConsent();
  }

  // Initialize analytics with user consent
  initialize(consent: boolean = false) {
    this.isEnabled = consent && typeof window !== 'undefined';
    
    if (this.isEnabled) {
      // Store consent in localStorage
      localStorage.setItem('analytics-consent', 'true');
      
      // Initialize Google Analytics if gtag is available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    }
  }

  // Check if user has given consent
  private hasUserConsent(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('analytics-consent') === 'true';
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.userId = userId;
    
    if (this.isEnabled && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    const event = {
      event: 'page_view',
      page_path: path,
      page_title: title || document.title,
      user_id: this.userId,
      timestamp: new Date().toISOString()
    };

    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: path,
        page_title: title
      });
    }

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Page View', event);
    }

    // Store locally for debugging
    this.storeEvent(event);
  }

  // Track custom events
  trackEvent({ event, category, label, value, properties }: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const analyticsEvent = {
      event,
      event_category: category,
      event_label: label,
      value,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
      ...properties
    };

    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: category,
        event_label: label,
        value,
        ...properties
      });
    }

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Event', analyticsEvent);
    }

    // Store locally for debugging
    this.storeEvent(analyticsEvent);
  }

  // Track user interactions
  trackClick(elementName: string, location?: string) {
    this.trackEvent({
      event: 'click',
      category: 'engagement',
      label: elementName,
      properties: { location }
    });
  }

  // Track search queries
  trackSearch(query: string, resultsCount?: number) {
    this.trackEvent({
      event: 'search',
      category: 'engagement',
      label: query,
      value: resultsCount,
      properties: { search_term: query }
    });
  }

  // Track tool usage
  trackToolUsage(toolId: string, toolName: string, action: 'view' | 'click' | 'favorite') {
    this.trackEvent({
      event: 'tool_interaction',
      category: 'tools',
      label: `${action}_${toolName}`,
      properties: { 
        tool_id: toolId,
        tool_name: toolName,
        action 
      }
    });
  }

  // Track user authentication
  trackAuth(action: 'login' | 'signup' | 'logout') {
    this.trackEvent({
      event: 'auth',
      category: 'user',
      label: action,
      properties: { auth_action: action }
    });
  }

  // Track errors
  trackError(error: string, page: string, userId?: string) {
    this.trackEvent({
      event: 'error',
      category: 'errors',
      label: error,
      properties: { 
        error_message: error,
        page,
        user_id: userId || this.userId
      }
    });
  }

  // Store events locally for debugging and backup
  private storeEvent(event: any) {
    if (typeof window === 'undefined') return;

    try {
      const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
      events.push(event);
      
      // Keep only last 100 events
      const recentEvents = events.slice(-100);
      localStorage.setItem('analytics-events', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to store analytics event:', error);
    }
  }

  // Get stored events for debugging
  getStoredEvents() {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('analytics-events') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored events
  clearStoredEvents() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics-events');
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackToolUsage: analytics.trackToolUsage.bind(analytics),
    trackAuth: analytics.trackAuth.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    initialize: analytics.initialize.bind(analytics)
  };
};
