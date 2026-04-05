'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterConfig, FilterItem } from '@/data/mocks/filters';
import { cn, createSearchParams } from '@/utils';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type FilterCardProps = {
  filter: FilterConfig;
  isTranslated?: boolean;
  className?: string;
}

export function FilterCard({ filter, isTranslated = false, className }: FilterCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAll, setShowAll] = useState(false);
  const queryConfig = useQueryConfig();

  const selectedValues = searchParams.get(filter.name)?.split(',') || [];
  const visibleItems = showAll ? filter.items : filter.items.slice(0, filter.maxVisible);

  const handleFilterChange = (value: string, checked: boolean) => {
    let values = selectedValues;

    if (filter.isMultiSelect === false) {
      if (checked) {
        values = [value];
      } else {
        values = [];
      }
    } else {
      if (checked) {
        values = [...selectedValues, value];
      } else {
        values = selectedValues.filter(v => v !== value);
      }
    }

    const query = createSearchParams({
      ...queryConfig,
      [filter.name]: values,
    });

    router.replace(`?${query.toString()}`);
  };

  const renderFilterItem = (item: FilterItem) => {
    const isSelected = selectedValues.includes(item.value);

    if (filter.isMultiSelect === false) {
      return (
        <div key={item.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={item.value}
            id={item.value}
            checked={isSelected}
            onClick={() => handleFilterChange(item.value, !isSelected)}
          />
          <Label htmlFor={item.value} className="text-sm font-normal">
            {isTranslated ? item.label : t(item.label as any)}
          </Label>
        </div>
      );
    }

    return (
      <div key={item.value} className="flex items-center space-x-2">
        <Checkbox
          id={item.value}
          checked={isSelected}
          onCheckedChange={checked => handleFilterChange(item.value, checked as boolean)}
        />
        <Label htmlFor={item.value} className="text-sm font-normal">
          {isTranslated ? item.label : t(item.label as any)}
        </Label>
      </div>
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{t(filter.titleKey as any)}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {filter.isMultiSelect === false ? (
          <RadioGroup className="flex flex-col gap-2">{visibleItems.map(renderFilterItem)}</RadioGroup>
        ) : (
          <div className="flex flex-col gap-2">{visibleItems.map(renderFilterItem)}</div>
        )}
        {filter.items.length > filter.maxVisible && (
          <Button variant="link" className="mt-2 h-auto p-0 text-sm font-normal" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show less' : 'Show more'}{' '}
            <ChevronDown className={cn('ml-1 h-4 w-4', showAll && 'rotate-180')} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
