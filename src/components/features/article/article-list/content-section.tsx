'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useFilteredArticleList } from '@/hooks/api/useFilteredArticleList';
import { useQueryConfig } from '@/hooks/use-query-config';
import ArticleItem from '@/components/features/article/article-item';
import PaginationClient from '@/components/shared/pagination-client';

import { EmptyState } from './empty-state';
import { ArticleHeader, SORT_OPTIONS } from './header-section';

const ITEM_PER_PAGE = 10;

export default function ArticleContentSection() {
  const t = useTranslations('article.list');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryConfig = useQueryConfig();

  const sortBy = searchParams.get('sortBy') || 'published_date';
  const order = searchParams.get('order') || 'desc';
  const searchKey = searchParams.get('search') || '';
  const currentSort = `${sortBy}-${order}`;

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const [newSortBy, newOrder] = value.split('-');

    if (newSortBy === SORT_OPTIONS.NEWEST.sortBy && newOrder === SORT_OPTIONS.NEWEST.order) {
      newParams.delete('sortBy');
      newParams.delete('order');
    } else {
      newParams.set('sortBy', newSortBy);
      newParams.set('order', newOrder);
    }

    router.push(`?${newParams.toString()}`);
  };

  const { articles, totalPages, totalElements, isLoading } = useFilteredArticleList(ITEM_PER_PAGE);
  const isEmpty = !isLoading && articles.length === 0;

  return (
    <div className="flex-1">
      <ArticleHeader
        sortBy={currentSort}
        onSortByChange={handleSortChange}
        disabled={isEmpty}
        hasSearchKey={!!searchKey}
      />

      {!isLoading && articles.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">{t('results_count', { count: totalElements })}</p>
        </div>
      )}

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              <span className="text-gray-600">{t('searching')}</span>
            </div>
          </div>
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {articles.map(article => {
                const { id, content, ...articleProps } = article as any;
                return <ArticleItem key={article.slug || String(id)} {...(articleProps as any)} layout="horizontal" />;
              })}
            </div>

            {totalPages > 1 && (
              <PaginationClient queryConfig={queryConfig} pageSize={totalPages} range={ITEM_PER_PAGE} showFirstLast />
            )}
          </>
        )}
      </div>
    </div>
  );
}
