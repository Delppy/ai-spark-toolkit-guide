// Basic monitoring and error tracking utility
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  url: string;
}

class MonitoringService {
  private errors: ErrorReport[] = [];
  private performance: PerformanceMetric[] = [];
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupErrorTracking();
      this.setupPerformanceTracking();
      this.setupUnhandledRejectionTracking();
    }
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }

  private setupUnhandledRejectionTracking() {
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        additionalData: {
          type: 'unhandledrejection',
          reason: event.reason
        }
      });
    });
  }

  private setupPerformanceTracking() {
    // Use basic performance tracking (web-vitals would need to be installed)
    this.trackBasicPerformance();
  }


  private trackBasicPerformance() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
          
          this.trackPerformance('page_load_time', pageLoadTime);
          this.trackPerformance('dom_content_loaded', domContentLoadedTime);
        }, 0);
      });
    }
  }

  reportError(error: ErrorReport) {
    if (!this.isEnabled) return;

    console.error('Error reported:', error);
    
    // Store error locally
    this.errors.push(error);
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('monitoring-errors', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }

    // In production, you would send this to your monitoring service
    // Example: Sentry, LogRocket, or custom endpoint
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(error);
    }
  }

  trackPerformance(name: string, value: number) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.performance.push(metric);
    
    // Keep only last 100 metrics
    if (this.performance.length > 100) {
      this.performance = this.performance.slice(-100);
    }

    console.log(`Performance metric: ${name} = ${value}ms`);

    // Store in localStorage
    try {
      localStorage.setItem('monitoring-performance', JSON.stringify(this.performance));
    } catch (e) {
      console.warn('Failed to store performance metric:', e);
    }
  }

  private sendToMonitoringService(error: ErrorReport) {
    // In a real application, you would send to a service like:
    // - Sentry
    // - LogRocket  
    // - Custom monitoring endpoint
    // - Analytics service
    
    // Example placeholder for external service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }).catch(() => {
      // Silently fail if monitoring endpoint is not available
    });
  }

  // Health check to monitor app status
  healthCheck() {
    const healthData = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorCount: this.errors.length,
      performanceMetricsCount: this.performance.length,
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };

    console.log('Health check:', healthData);
    return healthData;
  }

  // Get error reports for debugging
  getErrorReports() {
    return [...this.errors];
  }

  // Get performance metrics
  getPerformanceMetrics() {
    return [...this.performance];
  }

  // Clear stored data
  clearData() {
    this.errors = [];
    this.performance = [];
    localStorage.removeItem('monitoring-errors');
    localStorage.removeItem('monitoring-performance');
  }

  // Enable/disable monitoring
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

// React hook for monitoring
export const useMonitoring = () => {
  return {
    reportError: monitoring.reportError.bind(monitoring),
    trackPerformance: monitoring.trackPerformance.bind(monitoring),
    healthCheck: monitoring.healthCheck.bind(monitoring),
    getErrorReports: monitoring.getErrorReports.bind(monitoring),
    getPerformanceMetrics: monitoring.getPerformanceMetrics.bind(monitoring),
    clearData: monitoring.clearData.bind(monitoring)
  };
};
