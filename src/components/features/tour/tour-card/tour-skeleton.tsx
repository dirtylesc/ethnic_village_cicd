import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type TourSkeletonProps = {
  layout?: 'vertical' | 'horizontal';
}

export function TourSkeleton({ layout = 'vertical' }: TourSkeletonProps) {
  if (layout === 'horizontal') {
    return (
      <Card className="overflow-hidden">
        <div className="flex gap-4 p-4">
          <Skeleton className="h-[200px] w-[300px] rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full" />
      <CardContent className="space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
