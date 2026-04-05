import React from 'react';
import { MapPin, Clock, DollarSign, CheckCircle2, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type TourDetailsBoxProps = {
  booking: BookingGetResponse;
  className?: string;
}

export const TourDetailsBox: React.FC<TourDetailsBoxProps> = ({ booking, className = '' }) => {
  const t = useTranslations('personal.detail');
  const { tour } = booking;

  const formatDuration = (days: number) => {
    if (days === 1) return t('format.single_day');
    return t('format.day_night', { days, nights: days - 1 });
  };

  const formatLocation = (location: any) => {
    const notSpecified = t('format.not_specified');
    if (!location) return notSpecified;
    return `${location.city || location.province || location.name || notSpecified}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!tour) {
    return (
      <Card className={`shadow-sm ${className}`}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">{t('tour_info.tour_not_available')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green/20">
            <MapPin className="h-4 w-4 text-green-700" strokeWidth={2.5} />
          </div>
          {t('tour_info.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="overflow-hidden rounded-lg">
          {tour.imageUrl ? (
            <img src={tour.imageUrl} alt={tour.title} className="h-40 w-full object-cover" />
          ) : (
            <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <MapPin className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div>
          <h4 className="font-roboto font-bold text-foreground">{tour.title}</h4>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" strokeWidth={2} />
            <span>{formatLocation(tour.pickUpLocation)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
              <span className="text-sm font-medium text-muted-foreground">Thời gian</span>
            </div>
            <span className="font-semibold text-foreground">{formatDuration(tour.duration)}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" strokeWidth={2.5} />
              <span className="text-sm font-medium text-muted-foreground">Giá người lớn</span>
            </div>
            <span className="font-semibold text-primary">{formatPrice(tour.adultPrice)}</span>
          </div>

          {tour.childPrice && tour.childPrice > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="text-sm font-medium text-muted-foreground">Giá trẻ em</span>
              </div>
              <span className="font-semibold text-primary">{formatPrice(tour.childPrice)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h5 className="mb-3 font-roboto text-sm font-bold text-foreground">{t('tour_info.highlights')}</h5>
          <div className="space-y-2">
            {[
              t('tour_info.professional_guide'),
              t('tour_info.transportation'),
              t('tour_info.travel_insurance'),
              t('tour_info.support_24_7'),
            ].map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" strokeWidth={2.5} />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <ExternalLink className="h-4 w-4" />
            {t('tour_info.view_tour_details')}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <MapPin className="h-4 w-4" />
            {t('tour_info.similar_tours')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
