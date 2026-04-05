import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Users, Receipt } from 'lucide-react';

import { BookingGetResponse } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type BookingInfoBoxProps = {
  booking: BookingGetResponse;
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
  highlight?: boolean;
}> = ({ label, value, valueClass = 'font-semibold text-foreground', highlight = false }) => (
  <div
    className={`flex items-center justify-between py-2.5 ${!highlight ? 'border-b border-border' : 'rounded-lg bg-primary/5 px-4 py-3'}`}
  >
    <span className="font-medium text-muted-foreground">{label}:</span>
    <span className={valueClass}>{value}</span>
  </div>
);

export const BookingInfoBox: React.FC<BookingInfoBoxProps> = ({ booking }) => {
  const t = useTranslations('personal.detail');

  const formatPersonCount = (count: any) => {
    if (!count) return t('format.not_specified');
    const parts = [];

    const adultCount = count.adult || count.adults || 0;
    const childCount = count.child || count.children || 0;
    const infantCount = count.infant || count.infants || 0;

    if (adultCount > 0) parts.push(`${adultCount} ${t('format.adults')}`);
    if (childCount > 0) parts.push(`${childCount} ${t('format.children')}`);
    if (infantCount > 0) parts.push(`${infantCount} ${t('format.infants')}`);

    return parts.join(', ') || t('format.not_specified');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" strokeWidth={2.5} />
          </div>
          {t('booking_info.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        
        <InfoRow label={t('booking_info.booking_id')} value={`#${booking.id.slice(-8)}`} />
        <InfoRow label={t('booking_info.booking_date')} value={formatDate(booking.bookingDate)} />
        <InfoRow label={t('booking_info.start_date')} value={formatDate(booking.startDate)} />
        <InfoRow label={t('booking_info.end_date')} value={formatDate(booking.endDate)} />
        <InfoRow label={t('booking_info.guest_count')} value={formatPersonCount(booking.personCount)} />

        <Separator className="my-4" />
        <div>
          <h4 className="mb-3 font-roboto font-semibold text-foreground">{t('booking_info.payment_info')}</h4>
          {booking.discountAmountApplied > 0 && (
            <>
              <InfoRow
                label={t('booking_info.original_price')}
                value={formatCurrency(booking.totalPrice + booking.discountAmountApplied)}
                valueClass="text-muted-foreground line-through"
              />
              <InfoRow
                label={t('booking_info.discount')}
                value={`-${formatCurrency(booking.discountAmountApplied)}`}
                valueClass="font-semibold text-green-600"
              />
            </>
          )}

          <InfoRow
            label={t('booking_info.total_amount')}
            value={formatCurrency(booking.totalPrice)}
            valueClass="text-xl font-bold text-primary"
            highlight
          />
        </div>

        {booking.paymentExpiredDate && booking.status === 'PENDING_PAYMENT' && (
          <div className="mt-4 rounded-lg border border-yellow/30 bg-yellow/10 p-3">
            <p className="text-sm text-foreground">
              <span className="font-medium">{t('booking_info.payment_deadline')}: </span>
              {formatDateTime(booking.paymentExpiredDate)}
            </p>
          </div>
        )}

        {booking.additionalInformation && (
          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="mb-1 text-sm text-muted-foreground">{t('booking_info.additional_info')}:</p>
            <p className="text-sm text-foreground">{booking.additionalInformation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
