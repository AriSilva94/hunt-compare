// Performance monitoring utilities

export function measurePerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const startTime = performance.now();
    try {
      const result = await fn(...args);
      const endTime = performance.now();
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${name} failed in ${(endTime - startTime).toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  };
}

export function logPageLoad(pageName: string) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log(`📊 Page Load Performance - ${pageName}:`, {
        'DNS Lookup': `${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`,
        'Connect': `${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`,
        'Request': `${(perfData.responseStart - perfData.requestStart).toFixed(2)}ms`,
        'Response': `${(perfData.responseEnd - perfData.responseStart).toFixed(2)}ms`,
        'DOM Content Loaded': `${(perfData.domContentLoadedEventEnd - perfData.navigationStart).toFixed(2)}ms`,
        'Load Complete': `${(perfData.loadEventEnd - perfData.navigationStart).toFixed(2)}ms`,
      });
    });
  }
}

// Web Vitals tracking (for production monitoring)
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    // Example: gtag('event', metric.name, { value: metric.value });
    console.log('Web Vital:', metric);
  }
}