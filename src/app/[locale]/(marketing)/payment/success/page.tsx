'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { bookingApi } from '@/data/apis/booking.api';
import { formatCurrency } from '@/utils/number';
import { CheckCircle, Mail, MapPin, Receipt, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import { BookingGetResponse } from '@/types/booking';
import { useRouter } from '@/libs/i18n-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrderDetailsUrl, getTourListingUrl } from '@/components/features/payment/payment-navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('payment');

  const [bookingDetails, setBookingDetails] = useState<BookingGetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderCode = searchParams.get('orderCode');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!orderCode) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await bookingApi.getByOrderCode(orderCode);
        if (response.success && response.data) {
          setBookingDetails(response.data);
        }
      } catch (error) {
        logger.error('Failed to fetch booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [orderCode]);

  const handleBrowseTours = () => {
    router.push(getTourListingUrl());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGuestCountDisplay = () => {
    if (!bookingDetails?.personCount) return '';
    const { adult = 0, child = 0 } = bookingDetails.personCount;
    const parts = [];
    if (adult > 0) parts.push(`${adult} ${t('success.adults')}`);
    if (child > 0) parts.push(`${child} ${t('success.children')}`);
    return parts.join(', ');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">{t('success.title')}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="mb-3 font-semibold text-green-800">{t('success.booking_confirmed')}</h3>
                <div className="space-y-2 text-sm">
                  {bookingDetails?.tour && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <span className="font-medium">{t('success.tour')}:</span>{' '}
                        <span className="text-gray-700">{bookingDetails.tour.title}</span>
                      </div>
                    </div>
                  )}
                  {bookingDetails?.startDate && (
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{t('success.date')}:</span>{' '}
                      <span className="text-gray-700">{formatDate(bookingDetails.startDate)}</span>
                    </div>
                  )}
                  {bookingDetails?.personCount && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{t('success.guests')}:</span>{' '}
                      <span className="text-gray-700">{getGuestCountDisplay()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('success.order_code')}:</span>
                  <span className="font-mono font-semibold">{orderCode}</span>
                </div>
                {bookingDetails?.totalPrice !== undefined && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">{t('success.total_paid')}:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(bookingDetails.totalPrice)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                <Mail className="h-4 w-4" />
                <span>{t('success.email_confirmation')}</span>
              </div>
            </>
          )}

          <div className="space-y-3">
            {orderCode && (
              <Button onClick={() => router.push(getOrderDetailsUrl(orderCode))} className="w-full" variant="default">
                <Receipt className="mr-2 h-4 w-4" />
                {t('success.view_order_details')}
              </Button>
            )}
            <Button onClick={handleBrowseTours} className="w-full" variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              {t('success.browse_more_tours')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
