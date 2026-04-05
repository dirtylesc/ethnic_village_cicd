'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { cn, createSearchParams } from '@/utils';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, MapPin, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLocationList } from '@/hooks/api/useLocation';
import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type SearchBarProps = {
  className?: string;
}

type SearchData = {
  location: string;
  date: Date | undefined;
  keyword: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const t = useTranslations('search');
  const queryConfig = useQueryConfig();
  const pathname = usePathname();

  const [isOpenDate, setIsOpenDate] = useState(false);

  const isHome = pathname.endsWith(RouteConstant.home) || pathname === RouteConstant.home;

  const { data: locationRes } = useLocationList();

  const uniqueLocations =
    locationRes?.data && locationRes.data.length > 0
      ? Array.from(new Map(locationRes.data.map(location => [location.city, location])).values())
      : [];

  const [searchData, setSearchData] = useState<SearchData>({
    location: queryConfig.l?.[0] || '',
    date: queryConfig.date ? parseISO(queryConfig.date) : undefined,
    keyword: queryConfig.search || '',
  });

  const handleSearch = () => {
    const params = createSearchParams({
      ...queryConfig,
      search: searchData.keyword.trim(),
      l: [searchData.location],
      date: searchData.date ? format(searchData.date, 'yyyy-MM-dd') : undefined,
    });

    router.push(`${RouteConstant.tour}?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-stretch gap-2 rounded-xl border-[1px] border-primary-400 bg-white p-2 md:flex-row md:items-center md:px-4',
        className,
      )}
    >
      {isHome && (
        <>
          <Select
            value={searchData.location}
            onValueChange={value => {
              setSearchData({ ...searchData, location: value });
            }}
          >
            <SelectTrigger className="flex h-fit w-full gap-2 border-0 bg-transparent p-0 text-left font-semibold shadow-none focus:ring-0 focus-visible:ring-0 md:max-w-60 md:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 md:h-12 md:w-12">
                <MapPin className="h-5 w-5 text-primary-500 md:h-6 md:w-6" />
              </div>
              <SelectValue
                placeholder={t('location_placeholder')}
                className="text-sm font-semibold md:text-base"
                color="dark"
              />
            </SelectTrigger>
            <SelectContent>
              {uniqueLocations.map(location => (
                <SelectItem key={location.city} value={location.city} className="text-base font-semibold">
                  {location.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator className="mx-1 hidden h-full w-[0.5px] bg-gray-20 md:block" />
        </>
      )}

      <Popover open={isOpenDate} onOpenChange={setIsOpenDate}>
        <PopoverTrigger asChild className="h-fit w-full py-1 shadow-none hover:bg-primary-5 md:max-w-44">
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start border-0 bg-transparent p-0 text-left text-sm font-normal md:text-base',
              !searchData.date && 'text-muted-foreground',
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 md:h-12 md:w-12">
              <CalendarIcon className="h-5 w-5 text-primary-500 md:h-6 md:w-6" />
            </div>
            <span className="truncate">
              {searchData.date ? (
                format(searchData.date, 'dd/MM/yyyy', { locale: vi })
              ) : (
                <span>{t('date_placeholder')}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={searchData.date}
            onSelect={newDate => {
              setSearchData({ ...searchData, date: newDate });
              setIsOpenDate(false);
            }}
            locale={vi}
          />
        </PopoverContent>
      </Popover>

      <Separator className="mx-1 hidden h-full w-[0.5px] bg-gray-20 md:block" />

      <div className="flex w-full flex-grow items-center gap-1">
        <div className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 md:h-12 md:min-w-12">
          <Search className="h-5 w-5 text-primary-500 md:h-6 md:w-6" />
        </div>

        <Input
          type="text"
          placeholder={t('keyword_placeholder')}
          className="border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 md:text-base"
          value={searchData.keyword}
          onChange={e => {
            setSearchData({ ...searchData, keyword: e.target.value });
          }}
          onKeyPress={handleKeyPress}
        />
      </div>

      <Button
        className="h-fit w-full rounded-full bg-primary-button px-4 py-2 text-sm md:w-auto md:px-5 md:text-base"
        onClick={handleSearch}
      >
        {t('search_button')}
      </Button>
    </div>
  );
}
