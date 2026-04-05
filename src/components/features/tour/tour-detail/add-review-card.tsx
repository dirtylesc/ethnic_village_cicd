import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Review } from '@/types/review.type';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type AddReviewCardProps = {
  review?: Review;
  onSubmit: (data: { rating: number; content: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AddReviewCard({ review, onSubmit, onCancel, isLoading }: AddReviewCardProps) {
  const t = useTranslations('tour.detail.reviews');
  const { isAuthenticated, user } = useAuthStore();
  const [rating, setRating] = useState(review?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState(review?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, content });

    setRating(0);
    setContent('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-500">{t('add_review')}</p>
        <Button>Đăng nhập</Button>
      </div>
    );
  }

  const renderUser = () => {
    let curUser = {
      id: review?.user.id || user?.id,
      name: review?.user.personal?.firstName + ' ' + review?.user.personal?.lastName,
      avatar: review?.user.avatar || user?.avatar,
    };

    const personal = review?.user.personal || user?.personal;
    if (personal) {
      curUser = {
        ...curUser,
        name: `${personal.firstName} ${personal.lastName}`,
        avatar: personal.avatar || curUser.avatar,
      };
    }

    return (
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
          {curUser.avatar && <img src={curUser.avatar} alt={curUser.name} className="object-cover" />}
        </div>
        <span className="font-semibold">{curUser.name}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
      {renderUser()}

      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">{t('your_rating')}</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className={cn('rounded-md p-1 hover:bg-gray-100')}
            >
              <Star
                size={24}
                className={cn(
                  'transition-colors',
                  (hoveredRating ? value <= hoveredRating : value <= rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">{t('your_review')}</span>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t('placeholder')}
          className="focus-visible:ring-none focus-visible:ring-0"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-4">
        {review && (
          <Button variant="outline" type="button" onClick={onCancel}>
            Hủy
          </Button>
        )}

        <Button type="submit" disabled={rating === 0 || isLoading}>
          {isLoading ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
