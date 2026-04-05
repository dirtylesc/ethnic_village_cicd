import { useTranslations } from 'next-intl';

export const BookingListHeader = () => {
  const t = useTranslations('admin.booking.list');

  return (
    <div className="mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t('description')}</p>
      </div>
    </div>
  );
};
