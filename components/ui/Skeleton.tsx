import { Card } from "@/components/ui/Card";

interface SkeletonProps {
  variant?: "records" | "stats" | "simple" | "home-stats" | "home-records";
  count?: number;
}

export function Skeleton({ variant = "records", count = 6 }: SkeletonProps) {
  if (variant === "simple") {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>
    );
  }

  if (variant === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "home-stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "home-records") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex justify-between items-start mb-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="text-center p-2 bg-gray-50 rounded">
                  <div className="h-3 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
              ))}
            </div>

            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>

            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Default: records variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="mb-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="bg-gray-50 p-2 rounded">
                <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Componente completo para loading de página
interface PageSkeletonProps {
  showStats?: boolean;
  recordCount?: number;
}

export function PageSkeleton({ showStats = false, recordCount = 6 }: PageSkeletonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton variant="simple" />
      </div>

      {/* Stats skeleton (optional) */}
      {showStats && (
        <div className="mb-8">
          <Skeleton variant="stats" />
        </div>
      )}

      {/* Records skeleton */}
      <Skeleton variant="records" count={recordCount} />
    </div>
  );
}

// Componente específico para loading da home
export function HomeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-72 animate-pulse"></div>
      </div>

      {/* Stats skeleton */}
      <div className="mb-8">
        <Skeleton variant="home-stats" />
      </div>

      {/* How it works card skeleton */}
      <div className="mb-8">
        <Card className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Records header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Records skeleton */}
      <Skeleton variant="home-records" count={3} />
    </div>
  );
}