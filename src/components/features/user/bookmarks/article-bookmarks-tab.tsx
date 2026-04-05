'use client';

import { memo, useMemo } from 'react';
import { MOCK_ARTICLES } from '@/data/mocks/articles';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Bookmark } from '@/types/bookmark.type';
import { Button } from '@/components/ui/button';
import ArticleItem from '@/components/features/article/article-item';

type ArticleBookmarksTabProps = {
  bookmarks?: Bookmark[];
  visibleItems: number;
  onLoadMore: () => void;
}

function ArticleBookmarksTab({ bookmarks, visibleItems, onLoadMore }: ArticleBookmarksTabProps) {
  const t = useTranslations('personal.bookmark');

  const articles = useMemo(() => MOCK_ARTICLES.slice(0, visibleItems), [visibleItems]);

  const hasMoreItems = visibleItems < (bookmarks?.length || 0);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {articles.map(article => {
          const { id, content, ...articleProps } = article as any;
          return <ArticleItem key={article.slug || String(id)} {...(articleProps as any)} layout="horizontal" />;
        })}
      </div>
      {hasMoreItems && (
        <div className="mt-8 flex justify-center">
          <Button onClick={onLoadMore} variant="outline" className="gap-2 px-8">
            {t('view_more')}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default memo(ArticleBookmarksTab);
