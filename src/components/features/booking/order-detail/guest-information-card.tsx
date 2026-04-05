import { PersonInfo, useBookingStore } from '@/stores/useBookingStore';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { BookingGetResponse } from '@/types/booking';
import CardUpdate, { CardUpdateField } from '@/components/features/card-update/card-update';

import { BOOKING_TYPE } from './contact-information-card';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must have 10 digits'),
});

type GuestInformationCardProps = {
  booking?: BookingGetResponse;
}

const TRANSLATION_NAMESPACE = 'order.guest_info';

export default function GuestInformationCard({ booking }: GuestInformationCardProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const { bookingType, guestInfo, setGuestInfo } = useBookingStore();

  const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
    setGuestInfo(data);
  };

  const getGuestInformation = (guestInfo: PersonInfo | null): CardUpdateField[] => {
    const detail = guestInfo || booking?.bookerDetail || booking?.passengerDetail;

    return [
      {
        type: 'input',
        name: 'name',
        label: 'name',
        defaultChildren: <span className="text-base font-semibold">{detail?.name || ''}</span>,
        defaultValue: detail?.name || '',
        placeholder: 'enter_name',
        translationNamespace: TRANSLATION_NAMESPACE,
        required: true,
      },
      {
        type: 'tel',
        name: 'phone',
        label: 'phone',
        defaultChildren: <span className="text-base font-semibold">{detail?.phone || ''}</span>,
        defaultValue: detail?.phone || '',
        placeholder: 'enter_phone',
        translationNamespace: TRANSLATION_NAMESPACE,
        required: true,
      },
      {
        type: 'email',
        name: 'email',
        label: 'email',
        defaultChildren: <span className="text-base font-semibold">{detail?.email || ''}</span>,
        defaultValue: detail?.email || '',
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
        fields={getGuestInformation(guestInfo)}
        onSubmit={handleSubmit}
        defaultIsUpdating={bookingType === BOOKING_TYPE.OTHERS}
      />
    </div>
  );
}
