'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { bookingApi } from '@/data/apis/booking.api';
import { AlertCircle, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRetryPaymentUrl, getTourListingUrl } from '@/components/features/payment/payment-navigation';
import { useRouter } from '@/libs/i18n-navigation';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('payment');

  const orderCode = searchParams.get('orderCode');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const softCancelBooking = async () => {
      if (!orderCode || cancelled || isCancelling) {
        return;
      }

      try {
        setIsCancelling(true);

        await bookingApi.cancelByOrderCode(orderCode).catch((error) => {
          logger.warn('Soft cancel failed, scheduler will handle it (Tier 3):', error);
        });

        setCancelled(true);
      } catch (error) {

        logger.warn('Error during soft cancel:', error);
      } finally {
        setIsCancelling(false);
      }
    };

    softCancelBooking();
  }, [orderCode, cancelled, isCancelling]);

  const handleRetryPayment = () => {
    if (orderCode) {
      router.push(getRetryPaymentUrl(orderCode));
    }
  };

  const handleBrowseTours = () => {
    router.push(getTourListingUrl());
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">{t('cancel.title')}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col justify-center space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-gray-600">{t('cancel.description')}</p>
            {orderCode && (
              <div className="rounded-lg border p-3">
                <span className="text-sm text-gray-500">{t('cancel.order_code')}:</span>{' '}
                <span className="font-mono font-semibold">{orderCode}</span>
              </div>
            )}
          </div>

          <Button onClick={handleBrowseTours} variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            {t('cancel.browse_tours')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
