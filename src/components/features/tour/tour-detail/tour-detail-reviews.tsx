'use client';

import { useState } from 'react';
import { calculateRatingStats } from '@/utils';
import { useTranslations } from 'next-intl';

import { Review } from '@/types/review.type';
import { Tour } from '@/types/tour.type';
import { useReview } from '@/hooks/api/useReview';
import { Button } from '@/components/ui/button';
import { ReviewItem } from '@/components/shared/review-item';

import { AddReviewCard } from './add-review-card';
import { ReviewStatsCard } from './review-stats-card';

type TourDetailReviewsProps = {
  tour: Tour;
}

export function TourDetailReviews({ tour }: TourDetailReviewsProps) {
  const t = useTranslations('tour.detail.reviews');
  const [reviews, setReviews] = useState<Review[]>(tour.reviews || []);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const {
    addReview,
    isAddingReview,
    editReview,
    isEditingReview,
    deleteReview,
    isDeletingReview,
    pinReview,
    isPinningReview,
    reportReview,
    isReportingReview,
  } = useReview();

  const stats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? calculateRatingStats(reviews).average : 0,
    ratingCounts: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      ...reviews.reduce(
        (acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      ),
    },
  };

  const handleLoadMore = () => {
    setVisibleReviews(prev => prev + 5);
  };

  const handleAddReview = async (data: { rating: number; content: string }) => {
    addReview(
      {
        ...data,
        entityId: Number(tour.id) || 0,
        entityType: 'tour',
      },
      {
        onSuccess: response => {
          if (response.data) {
            setReviews(prev => [response.data, ...prev] as Review[]);
          }
        },
      },
    );
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleSubmitEdit = (data: { rating: number; content: string }) => {
    if (!editingReview) return;

    editReview(
      {
        reviewId: editingReview.id,
        data,
      },
      {
        onSuccess: response => {
          if (response.data) {
            setReviews(
              prev => prev.map(review => (review.id === editingReview.id ? response.data : review)) as Review[],
            );
            setEditingReview(null);
          }
        },
      },
    );
  };

  const handleDeleteReview = (review: Review) => {
    deleteReview(review.id, {
      onSuccess: () => {
        setReviews(prev => prev.filter(r => r.id !== review.id));
      },
    });
  };

  const handlePinReview = (review: Review) => {
    pinReview(review.id, {
      onSuccess: response => {
        if (response.data) {
          setReviews(prev => prev.map(r => (r.id === review.id ? response.data : r)) as Review[]);
        }
      },
    });
  };

  const handleReportReview = (review: Review) => {
    reportReview(
      {
        reviewId: review.id,
        reason: 'Inappropriate content',
      },
      {
        onSuccess: () => {

        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      
      <ReviewStatsCard stats={stats} />

      <div className="rounded-2xl border px-6 py-4">
        {editingReview ? (
          <AddReviewCard
            review={editingReview}
            onSubmit={handleSubmitEdit}
            onCancel={handleCancelEdit}
            isLoading={isEditingReview}
          />
        ) : (
          <AddReviewCard onSubmit={handleAddReview} isLoading={isAddingReview} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500">{t('no_reviews')}</div>
        ) : (
          reviews
            .slice(0, visibleReviews)
            .map(review => (
              <ReviewItem
                key={review.id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onPin={handlePinReview}
                onReport={handleReportReview}
                isDeleting={isDeletingReview}
                isPinning={isPinningReview}
                isReporting={isReportingReview}
              />
            ))
        )}
      </div>

      {visibleReviews < reviews.length && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore}>{t('load_more')}</Button>
        </div>
      )}
    </div>
  );
}
