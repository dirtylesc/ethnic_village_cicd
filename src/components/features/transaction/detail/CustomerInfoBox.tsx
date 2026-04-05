import React from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CustomerInfoBoxProps = {
  booking: BookingGetResponse;
  className?: string;
}

export const CustomerInfoBox: React.FC<CustomerInfoBoxProps> = ({ booking, className = '' }) => {
  const t = useTranslations('personal.detail');

  const customerName = booking.bookerDetail?.fullName || booking.bookerDetail?.name || t('customer_info.not_updated');
  const customerEmail = booking.bookerDetail?.email || t('customer_info.not_updated');
  const customerPhone =
    booking.bookerDetail?.phoneNumber || booking.bookerDetail?.phone || t('customer_info.not_updated');

  const formatPhoneNumber = (phone: string) => {
    const notUpdated = t('customer_info.not_updated');
    if (!phone || phone === notUpdated) return notUpdated;

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getInitials = (name: string) => {
    if (!name || name === t('customer_info.not_updated')) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const createMailtoLink = () => {
    const subject = `Liên hệ về đơn đặt tour #${booking.id.slice(-8)}`;
    const tourName = booking.tour?.title || 'Tour';
    const body = `Xin chào ${customerName},\n\nChúng tôi liên hệ về đơn đặt tour "${tourName}" của bạn.\n\nTrân trọng,\nĐội ngũ hỗ trợ khách hàng`;
    return `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const createTelLink = () => {
    return `tel:${customerPhone}`;
  };

  const isValidEmail = customerEmail !== t('customer_info.not_updated');
  const isValidPhone = customerPhone !== t('customer_info.not_updated');
  const isLoyalCustomer = booking.status === 'CONFIRMED';

  return (
    <Card className={`shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <User className="h-4 w-4 text-secondary" strokeWidth={2.5} />
          </div>
          {t('customer_info.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-secondary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary font-roboto text-lg font-bold text-white">
              {getInitials(customerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-roboto font-bold text-foreground">{customerName}</h4>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {isLoyalCustomer ? t('customer_info.loyal_customer') : t('customer_info.new_customer')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Mail className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">{t('customer_info.email')}</p>
              <p className="mt-0.5 truncate font-medium text-foreground">{customerEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <Phone className="h-4 w-4 text-green-600" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">{t('customer_info.phone')}</p>
              <p className="mt-0.5 font-medium text-foreground">{formatPhoneNumber(customerPhone)}</p>
            </div>
          </div>
        </div>

        {(isValidEmail || isValidPhone) && (
          <div className="flex gap-2 border-t border-border pt-4">
            {isValidEmail && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <a href={createMailtoLink()}>
                  <Mail className="mr-2 h-4 w-4" />
                  {t('customer_info.send_email')}
                </a>
              </Button>
            )}
            {isValidPhone && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
              >
                <a href={createTelLink()}>
                  <Phone className="mr-2 h-4 w-4" />
                  {t('customer_info.make_call')}
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
