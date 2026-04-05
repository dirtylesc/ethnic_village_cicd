import { reviewApi } from '@/data/apis/review.api';
import { handleError } from '@/utils/handle-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/use-toast';

export const useReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addReviewMutation = useMutation({
    mutationFn: reviewApi.addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour'] });
      toast({
        title: 'Thêm đánh giá thành công',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      handleError(error, toast);
    },
  });

  const editReviewMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: { rating: number; content: string } }) =>
      reviewApi.editReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour'] });
      toast({
        title: 'Cập nhật đánh giá thành công',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      handleError(error, toast);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: reviewApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour'] });
      toast({
        title: 'Xóa đánh giá thành công',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      handleError(error, toast);
    },
  });

  const pinReviewMutation = useMutation({
    mutationFn: reviewApi.pinReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour'] });
      toast({
        title: 'Ghim đánh giá thành công',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      handleError(error, toast);
    },
  });

  const reportReviewMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: number; reason: string }) =>
      reviewApi.reportReview(reviewId, reason),
    onSuccess: () => {
      toast({
        title: 'Báo cáo đánh giá thành công',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      handleError(error, toast);
    },
  });

  return {
    addReview: addReviewMutation.mutate,
    isAddingReview: addReviewMutation.isPending,
    editReview: editReviewMutation.mutate,
    isEditingReview: editReviewMutation.isPending,
    deleteReview: deleteReviewMutation.mutate,
    isDeletingReview: deleteReviewMutation.isPending,
    pinReview: pinReviewMutation.mutate,
    isPinningReview: pinReviewMutation.isPending,
    reportReview: reportReviewMutation.mutate,
    isReportingReview: reportReviewMutation.isPending,
  };
};
