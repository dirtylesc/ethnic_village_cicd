import { cn } from '@/utils';
import { LayoutGrid, List } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type TourHeaderProps = {
  sortBy: string;
  onSortByChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  disabled?: boolean;
}

export const SORT_OPTIONS = {
  DEFAULT: {
    sortBy: 'default',
    order: 'desc',
    labelKey: 'sort.default',
  },
  PRICE_ASC: {
    sortBy: 'adultPrice',
    order: 'asc',
    labelKey: 'sort.price_low_high',
  },
  PRICE_DESC: {
    sortBy: 'adultPrice',
    order: 'desc',
    labelKey: 'sort.price_high_low',
  },
  RATING_DESC: {
    sortBy: 'rating',
    order: 'desc',
    labelKey: 'sort.rating',
  },
} as const;

export function TourHeader({ sortBy, onSortByChange, viewMode, onViewModeChange, disabled }: TourHeaderProps) {
  const t = useTranslations('tour.list');

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={onSortByChange} disabled={disabled}>
          <SelectTrigger className="w-[180px] focus:ring-0 focus-visible:ring-0">
            <SelectValue placeholder={t('sort.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SORT_OPTIONS).map(option => (
              <SelectItem key={option.sortBy + option.order} value={`${option.sortBy}-${option.order}`}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
            
          </SelectContent>
        </Select>

        <Separator className="mx-1 h-8 w-[0.5px] bg-gray-20" />

        <div className="flex items-center rounded-full border-[1px] border-gray-500">
          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-l-full text-gray-500 hover:text-primary-500', {
              'bg-gray-100 text-primary-500': viewMode === 'grid',
            })}
            onClick={() => onViewModeChange('grid')}
            disabled={disabled}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Separator className="h-5 w-[0.5px] bg-gray-20" />
          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-r-full text-gray-500 hover:text-primary-500', {
              'bg-gray-100 text-primary-500': viewMode === 'list',
            })}
            onClick={() => onViewModeChange('list')}
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
