import Link from 'next/link';
import { PackageSearch, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RouteConstant } from '@/core/constants/route';
import { Button } from '@/components/ui/button';

type EmptyStateNamespace = 'tour.list.empty' | 'tour.detail.similar.empty';

type EmptyStateProps = {
  namespace?: EmptyStateNamespace;
}

export function EmptyState({ namespace = 'tour.list.empty' }: EmptyStateProps) {
  const t = useTranslations(namespace);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <PackageSearch className="h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold">{t('title')}</h3>
      <p className="mt-2 text-sm text-gray-500">{t('description')}</p>
      <Button asChild className="mt-6" variant="default">
        <Link href={RouteConstant.tour}>
          <Search className="mr-2 h-4 w-4" />
          {t('browse_all_tours') || 'Xem tất cả tours'}
        </Link>
      </Button>
    </div>
  );
}
