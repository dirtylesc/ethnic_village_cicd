import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { Download, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export const TourListHeader = () => {
  const t = useTranslations('admin.tour.list');
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('tour_list_title')}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t('tour_list_description')}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" className="gap-2">
          <span className="font-medium">{t('import')}</span>
          <Download className="h-4 w-4" />
        </Button>
        <Link href={RouteConstant.admin_tour_create}>
          <Button className="gap-2">
            <span className="font-medium">{t('add_tour')}</span>
            <UserPlus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
