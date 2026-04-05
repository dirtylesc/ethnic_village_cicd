import { useEffect, useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { useTranslations } from 'next-intl';

import { BookingGetResponse } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type AdditionalInformationCardProps = {
  booking?: BookingGetResponse;
}

export default function AdditionalInformationCard({ booking }: AdditionalInformationCardProps) {
  const [content, setContent] = useState<string>('');
  const t = useTranslations('order.additional_info');
  const { setAdditionalInfo } = useBookingStore();

  useEffect(() => {
    if (booking?.additionalInformation) {
      setContent(booking.additionalInformation);
    }
  }, [booking]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setAdditionalInfo(newContent);
  };

  return (
    <Card className="rounded-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 py-3">
        <CardTitle className="text-xl">{t('title')}</CardTitle>
      </CardHeader>
      <Separator className="h-px w-full bg-gray-20" />
      <CardContent className="px-5 py-3">
        <Textarea
          value={content}
          onChange={e => handleContentChange(e.target.value)}
          placeholder={t('placeholder')}
          className="focus-visible:ring-none h-28 resize-none border-primary-500 focus-visible:ring-0"
        />
        <p className="mt-2 text-xs font-bold text-gray-500">{t('format_note')}</p>
      </CardContent>
    </Card>
  );
}
