'use client';

import { useCallback, useState } from 'react';
import { promotionApi } from '@/data/apis/promotion.api';
import { cn } from '@/utils/classnames';
import { AlertCircle, CheckCircle2, Loader2, Tag, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PromotionErrorCode, PromotionStatus } from '@/types/promotion.type';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useBookingWizard } from '../booking-wizard-context';

export type PromotionCodeInputProps = {
  tourId: string;
  className?: string;
}

export function PromotionCodeInput({ tourId, className }: PromotionCodeInputProps) {
  const t = useTranslations('booking.wizard.promotion');
  const { state, actions } = useBookingWizard();
  const { bookingData, isLoading: wizardLoading } = state;

  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(!!bookingData.promotion);

  const handleApply = useCallback(async () => {
    if (!code.trim() || !tourId) return;

    setError(null);
    setIsValidating(true);

    try {
      const response = await promotionApi.validatePromotion(code.trim(), tourId);

      if (response.success && response.data) {
        const promotionData = response.data;

        if (promotionData.status !== PromotionStatus.ACTIVE) {
          if (promotionData.errorCode === PromotionErrorCode.PROMOTION_EXPIRED) {
            setError(t('errors.expired'));
          } else if (promotionData.errorCode === PromotionErrorCode.PROMOTION_NOT_ACTIVE) {
            setError(t('errors.not_active'));
          } else if (promotionData.errorCode === PromotionErrorCode.PROMOTION_OUT_OF_STOCK) {
            setError(t('errors.out_of_stock'));
          } else {
            setError(t('errors.invalid'));
          }
          return;
        }

        actions.updateBookingData({
          promotion: {
            id: promotionData.id,
            name: promotionData.name,
            discountPercent: promotionData.discountPercent,
            maxDiscountAmount: promotionData.maxDiscountAmount,
          },
        });
        setIsApplied(true);
        setError(null);
      } else {
        setError(t('errors.invalid'));
      }
    } catch {
      setError(t('errors.validation_failed'));
    } finally {
      setIsValidating(false);
    }
  }, [code, tourId, actions, t]);

  const handleRemove = useCallback(() => {
    actions.updateBookingData({ promotion: null });
    setIsApplied(false);
    setCode('');
    setError(null);
  }, [actions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isValidating && code.trim()) {
        handleApply();
      }
    },
    [handleApply, isValidating, code],
  );

  if (isApplied && bookingData.promotion) {
    return (
      <Card className={cn('border-green-200 bg-green-50', className)}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{bookingData.promotion.name}</p>
              <p className="text-sm text-green-600">
                {t('discount_applied', { percent: bookingData.promotion.discountPercent })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-green-700 hover:bg-green-100 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">{t('title')}</h3>
        </div>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={e => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('placeholder')}
            disabled={isValidating || wizardLoading}
            className={cn(error && 'border-red-500')}
          />
          <Button
            onClick={handleApply}
            disabled={!code.trim() || isValidating || wizardLoading}
            className="min-w-[80px]"
          >
            {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : t('apply')}
          </Button>
        </div>
        {error && (
          <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
