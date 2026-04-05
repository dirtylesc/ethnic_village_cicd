import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';
import { formatTimeAgo } from '@/utils/date';
import { Loader2, MoreHorizontal, PinIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Review } from '@/types/review.type';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddReviewCard } from '../features/tour/tour-detail/add-review-card';
import StarRating from './star-rating';

type ReviewItemProps = {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onPin?: (review: Review) => void;
  onReport?: (review: Review) => void;
  isDeleting?: boolean;
  isPinning?: boolean;
  isReporting?: boolean;
}

export function ReviewItem({
  review,
  onEdit,
  onDelete,
  onPin,
  onReport,
  isDeleting,
  isPinning,
  isReporting,
}: ReviewItemProps) {
  const t = useTranslations('tour.detail.reviews');

  const [isEditing, setIsEditing] = useState(false);
  const { user: currentUser } = useAuthStore();
  const isOwner = currentUser?.id === review.user.id;

  const handleSubmit = ({ rating, content }: { rating: number; content: string }) => {
    const newReview = {
      ...review,
      rating,
      content,
    };

    onEdit?.(newReview);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const userName = review.user.personal
    ? `${review.user.personal.firstName} ${review.user.personal.lastName}`
    : t('no_name');

  const userAvatar = review.user.personal?.avatar || review.user.avatar;

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border px-6 py-4',
        review.isPinned && 'border-primary-500 bg-primary-5',
      )}
    >
      {isEditing ? (
        <AddReviewCard review={review} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              
              <div className="relative h-full w-10 overflow-hidden rounded-full bg-gray-100">
                {userAvatar && <img src={userAvatar} alt={userName} className="object-cover" />}
              </div>

              <div className="flex flex-col">
                <h4 className="font-semibold">{userName}</h4>
                <StarRating average={review.rating} readOnly />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isOwner && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2">
                      <PinIcon className="h-4 w-4" />
                      {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(review)}
                      className="gap-2 text-destructive hover:text-destructive focus:text-destructive"
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2Icon className="h-4 w-4" />}
                      {t('delete')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {currentUser?.id && (
                  <>
                    <DropdownMenuItem onClick={() => onPin?.(review)} className="gap-2" disabled={isPinning}>
                      {isPinning ? <Loader2 className="h-4 w-4 animate-spin" /> : <PinIcon className="h-4 w-4" />}
                      {review.isPinned ? t('unpin') : t('pin')}
                    </DropdownMenuItem>
                    {!isOwner && (
                      <DropdownMenuItem
                        onClick={() => onReport?.(review)}
                        className="gap-2 text-destructive"
                        disabled={isReporting}
                      >
                        {isReporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2Icon className="h-4 w-4" />
                        )}
                        {t('report')}
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-gray-600">{review.content}</p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {review.isPinned && (
              <>
                <PinIcon className="h-4 w-4" />
                <span>{t('pin')}</span>
                <span>•</span>
              </>
            )}
            <span className="capitalize">{formatTimeAgo(new Date(review.createdAt))}</span>
            {review.updatedAt > review.createdAt && (
              <>
                <span>•</span>
                <span>{t('edit')}</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
