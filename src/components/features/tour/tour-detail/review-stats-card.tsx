import { calculateRatingPercentage } from '@/utils';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ReviewStats } from '@/types/review.type';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/shared/star-rating';

type ReviewStatsCardProps = {
  stats: ReviewStats;
}

export function ReviewStatsCard({ stats }: ReviewStatsCardProps) {
  const t = useTranslations('tour.detail.reviews');
  const { totalReviews, averageRating, ratingCounts } = stats;
  const percentages = calculateRatingPercentage(ratingCounts, totalReviews);
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col gap-8 rounded-2xl bg-primary-10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">{averageRating.toFixed(1)}</h3>
          <StarRating average={averageRating} />
          <p className="text-sm text-gray-500">{t('total_reviews', { count: totalReviews })}</p>
        </div>

        <Separator className="m-3 h-[150px] w-[2px] bg-white-80" orientation="vertical" />

        <div className="flex flex-1 flex-col gap-3 pl-3">
          {ratings.map(rating => (
            <div key={rating} className="flex items-center gap-4">
              <div className="flex w-10 items-center gap-1">
                <span className="text-sm">{rating}</span>
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={percentages[rating]} className="h-2" />
              <span className="w-8 text-right text-sm text-gray-500">{ratingCounts[rating]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
