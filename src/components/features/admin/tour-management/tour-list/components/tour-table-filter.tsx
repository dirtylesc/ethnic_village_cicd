'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TourStatusEnum } from '@/core/enum/tour.enum';
import { useMetaStore } from '@/stores/useMetaStore';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Option } from '@/types/data-table';
import { Button } from '@/components/ui/button';
import { EthnicFilter, SearchFilter, StatusFilter } from '@/components/shared/filter';

type TourTableFilterProps = {
  className?: string;
}

export function TourTableFilter({ className }: TourTableFilterProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const searchParams = useSearchParams();
  const ethnics = useMetaStore(state => state.ethnics);
  const locations = useMetaStore(state => state.locations);

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status')?.split(',') || [];
  const currentEthnic = searchParams.get('e')?.split(',') || [];

  const statusOptions: Option[] = Object.values(TourStatusEnum).map(status => ({
    label: t(('status.' + status.value) as any),
    value: status.value,
  }));

  const ethnicOptions: Option[] = React.useMemo(() => {
    if (!ethnics) return [];
    return ethnics.map(ethnic => ({
      label: ethnic.name,
      value: ethnic.code,
    }));
  }, [ethnics]);

  const updateFilters = React.useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      });

      params.set('page', '0');

      const newUrl = `?${params.toString()}`;

      router.push(newUrl, { scroll: false });
    },
    [router, searchParams],
  );

  const handleStatusChange = React.useCallback(
    (values: string[]) => {
      updateFilters({ status: values.length > 0 ? values : undefined });
    },
    [updateFilters],
  );

  const handleEthnicChange = React.useCallback(
    (values: string[]) => {
      updateFilters({ e: values.length > 0 ? values : undefined });
    },
    [updateFilters],
  );

  const handleReset = React.useCallback(() => {
    updateFilters({ search: undefined, status: undefined, e: undefined });
  }, [updateFilters]);

  const hasActiveFilters = currentSearch || currentStatus.length > 0 || currentEthnic.length > 0;

  return (
    <div className={`flex w-full items-start justify-between gap-2 p-1 ${className || ''}`}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        
        <SearchFilter title={t('tour.list.search_tour')} defaultValue={currentSearch} onChange={updateFilters} />

        <StatusFilter
          title={t('tour.list.status')}
          options={statusOptions}
          selectedValues={currentStatus}
          onSelectionChange={handleStatusChange}
        />

        <EthnicFilter
          title={t('tour.list.ethnic')}
          options={ethnicOptions}
          selectedValues={currentEthnic}
          onSelectionChange={handleEthnicChange}
        />

        {hasActiveFilters && (
          <Button
            aria-label={t('tour.list.reset_filters')}
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
