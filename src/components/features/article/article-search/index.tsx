'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { cn, createSearchParams } from '@/utils';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ArticleSearchBarProps = {
  className?: string;
}

export function ArticleSearchBar({ className }: ArticleSearchBarProps) {
  const router = useRouter();
  const t = useTranslations('article.search');
  const queryConfig = useQueryConfig();

  const [searchKey, setSearchKey] = useState(queryConfig.search || '');

  const handleSearch = () => {
    const params = createSearchParams({
      ...queryConfig,
      search: searchKey.trim(),
    });

    router.push(`${RouteConstant.article}?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={cn('flex items-center gap-2 rounded-xl border-[1px] border-primary-400 bg-white p-2 px-4', className)}
    >
      <div className="flex w-full flex-grow items-center gap-1">
        <div className="flex h-12 min-w-12 items-center justify-center rounded-full bg-primary-5">
          <Search className="h-6 w-6 text-primary-500" />
        </div>

        <Input
          type="text"
          placeholder={t('placeholder')}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <Button className="h-fit rounded-full bg-primary-button px-5 py-2" onClick={handleSearch}>
        {t('button')}
      </Button>
    </div>
  );
}
