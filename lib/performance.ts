// Performance monitoring utilities - simplified for build compatibility

export function measurePerformance<T>(name: string, fn: (...args: unknown[]) => Promise<T>) {
  return async (...args: unknown[]): Promise<T> => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      const endTime = Date.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${endTime - startTime}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${name} failed in ${endTime - startTime}ms:`, error);
      }
      
      throw error;
    }
  };
}

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  label?: string;
}

export function reportWebVitals(metric: WebVitalMetric) {
  if (process.env.NODE_ENV === 'production') {
    console.log('Web Vital:', metric);
  }
}