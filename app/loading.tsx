import { PageSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return <PageSkeleton showStats={false} recordCount={3} />;
}