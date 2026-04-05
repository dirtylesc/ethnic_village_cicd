import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';

type GuildProfileCardProps = {
  tour: Tour;
};

const GuildProfileCard = ({ tour }: GuildProfileCardProps) => {
  const t = useTranslations('tour.detail.guild_profile');

  const contacts = (tour.contacts as Record<string, string>) || {};
  const contactPhone = contacts.phone || contacts.zalo || contacts.whatsapp;
  const contactEmail = contacts.email;
  const contactZalo = contacts.zalo;
  const contactWhatsapp = contacts.whatsapp;
  const pickupLocation = tour.pickUpLocation?.city || tour.pickUpLocation?.province || '';

  const contactRows = [
    pickupLocation && { label: t('pickup_location'), value: pickupLocation },
    contactPhone && { label: t('contact_phone'), value: contactPhone },
    contactEmail && { label: t('contact_email'), value: contactEmail },
    contactZalo && { label: t('contact_zalo'), value: contactZalo },
    contactWhatsapp && { label: t('contact_whatsapp'), value: contactWhatsapp },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex w-full flex-col gap-3 rounded-[20px] border border-gray-20 bg-white p-5 shadow-custom-gray sm:p-[30px] xl:w-[360px]">
      <div className="flex flex-col gap-1">
        <p className="text-base font-bold sm:text-lg">{t('contact_title')}</p>
        <p className="text-sm text-gray-500 sm:text-base">{t('description')}</p>
      </div>

      <div className="space-y-2">
        {contactRows.length > 0 ? (
          contactRows.map(row => (
            <div key={row.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-600">{row.label}</span>
              <span className="text-sm font-semibold text-dark">{row.value}</span>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{t('contact_missing')}</div>
        )}
      </div>
    </div>
  );
};

export default GuildProfileCard;
