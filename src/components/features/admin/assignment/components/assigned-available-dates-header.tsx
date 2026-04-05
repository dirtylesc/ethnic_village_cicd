'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslations } from 'next-intl';

export const AssignedAvailableDatesHeader = () => {
  const t = useTranslations('admin');
  const { user } = useAuthStore();

  const isAdmin = user?.roles?.some(role => {
    const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, '');
    return normalizedRole === 'ADMIN';
  }) ?? false;
  const title = isAdmin ? t('tour.assigned_dates.all_assignments') : t('tour.assigned_dates.my_assignments');
  const description = isAdmin
    ? t('tour.assigned_dates.all_assignments_description')
    : t('tour.assigned_dates.my_assignments_description');

  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-base text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
