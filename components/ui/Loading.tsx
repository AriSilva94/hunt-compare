// Universal Loading Component - Single source of truth for all loading states

interface LoadingProps {
  className?: string;
}

/**
 * Universal Loading Component
 * Single component used across the entire application for loading states
 */
export function Loading({ className = '' }: LoadingProps = {}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Characters/History section skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 animate-pulse">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      {/* Records grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse h-full">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            
            {/* Character info section */}
            <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <span className="text-gray-400">•</span>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <span className="text-gray-400">•</span>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-8 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto"></div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export default for convenience
export default Loading;