import { PersonInfo, useBookingStore } from '@/stores/useBookingStore';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import logger from '@/libs/logger';

import { BookingGetResponse } from '@/types/booking';
import { useApiBookingUpdateContact } from '@/hooks/api/useBooking';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import CardUpdate, { CardUpdateField } from '@/components/features/card-update/card-update';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must have 10 digits'),
  name: z.string().min(1, 'Name is required'),
});

type ContactInformationCardProps = {
  booking?: BookingGetResponse;
}

export const BOOKING_TYPE = {
  SELF: 'self',
  OTHERS: 'others',
} as const;

export type BookingType = (typeof BOOKING_TYPE)[keyof typeof BOOKING_TYPE];

const TRANSLATION_NAMESPACE = 'order.contact_info';

export default function ContactInformationCard({ booking }: ContactInformationCardProps) {
  const t = useTranslations('order.contact_info');
  const { bookingType, contactInfo, setContactInfo, setGuestInfo, setBookingType } = useBookingStore();
  const { mutateAsync: updateContact } = useApiBookingUpdateContact();

  const handleBookingTypeChange = (value: BookingType) => {
    setBookingType(value);

    if (value === BOOKING_TYPE.SELF && contactInfo) {
      setGuestInfo(contactInfo);
    }
  };

  const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
    if (!booking?.id) return;

    try {
      const contactInfo = {
        ...data,
      };

      const isSuccess = await updateContact({
        id: booking.id,
        contactInfo,
      });

      if (isSuccess) {
        setContactInfo(contactInfo);
      }

      if (isSuccess && bookingType === 'self') {
        setGuestInfo(contactInfo);
      }
    } catch (error) {
      logger.error('Failed to update booking:', error);
    }
  };

  const getContactInformation = (contactInfo: PersonInfo | null): CardUpdateField[] => {
    const bookerDetail = contactInfo || booking?.bookerDetail;

    return [
      {
        type: 'input',
        name: 'name',
        label: 'booker_name',
        defaultChildren: <span className="text-base font-semibold">{bookerDetail?.name || ''}</span>,
        defaultValue: bookerDetail?.name || '',
        placeholder: 'enter_name',
        translationNamespace: TRANSLATION_NAMESPACE,
        required: true,
      },
      {
        type: 'tel',
        name: 'phone',
        label: 'booker_phone',
        defaultChildren: <span className="text-base font-semibold">{bookerDetail?.phone || ''}</span>,
        defaultValue: bookerDetail?.phone || '',
        placeholder: 'enter_phone',
        translationNamespace: TRANSLATION_NAMESPACE,
        required: true,
      },
      {
        type: 'email',
        name: 'email',
        label: 'booker_email',
        defaultChildren: <span className="text-base font-semibold">{bookerDetail?.email || ''}</span>,
        defaultValue: bookerDetail?.email || '',
        placeholder: 'enter_email',
        translationNamespace: TRANSLATION_NAMESPACE,
        required: true,
      },
    ];
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">{t('title')}</h2>
      <CardUpdate
        className="border-none shadow-custom-blue"
        title=""
        formSchema={formSchema}
        fields={getContactInformation(contactInfo)}
        onSubmit={handleSubmit}
        footerOptions={
          <RadioGroup
            value={bookingType}
            onValueChange={(value: 'self' | 'others') => handleBookingTypeChange(value)}
            className="grid w-full grid-cols-2 items-center justify-between p-3 px-8"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="self" id="r1" />
              <Label className="text-lg" htmlFor="r1">
                {t('visitor')}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="others" id="r2" />
              <Label className="text-lg" htmlFor="r2">
                {t('order_for_others')}
              </Label>
            </div>
          </RadioGroup>
        }
      />
    </div>
  );
}
