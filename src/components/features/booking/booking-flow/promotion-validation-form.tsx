import { formatCurrency } from '@/utils';
import { AxiosError } from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { BookingStoreResponse } from '@/types/booking';
import { PromotionValidateResponse } from '@/types/promotion.type';
import { useApiValidatePromotion } from '@/hooks/api/usePromotion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PromotionValidationFormProps = {
  booking: BookingStoreResponse;
  promotion: PromotionValidateResponse | null;
  setPromotion: (promotion: PromotionValidateResponse | null) => void;
};

const PromotionValidationForm = ({ promotion, booking, setPromotion }: PromotionValidationFormProps) => {
  const t = useTranslations('order.promotion');
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<{ code: string }>();
  const { mutateAsync: validatePromotion } = useApiValidatePromotion();

  const handlePromotionSubmit = async (params: { code: string }) => {
    await validatePromotion(
      { code: params.code, tourId: booking.tour.id },
      {
        onSuccess: data => {
          if (!data) {
            setPromotion(null);
            return;
          }

          setPromotion(data);
        },
        onError: error => {
          setPromotion(null);

          toast({
            title: error.message,
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(handlePromotionSubmit)}>
        <div className="flex gap-2">
          <Input {...register('code')} placeholder={t('promotion_code')} aria-label={t('promotion_code')} />
          <Button type="submit">{t('apply')}</Button>
        </div>
      </form>
      {promotion && (
        <div className="text-sm text-green-600">
          {t('discount')}: {promotion.discountPercent}%
          {promotion.maxDiscountAmount > 0 &&
            ` (${t('max')}: ${formatCurrency(promotion.maxDiscountAmount, {
              locale: locale,
            })})`}
        </div>
      )}
    </>
  );
};

export default PromotionValidationForm;
