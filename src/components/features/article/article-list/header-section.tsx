import { useTranslations } from 'next-intl';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SORT_OPTIONS = {
  NEWEST: { sortBy: 'published_date', order: 'desc' },
  OLDEST: { sortBy: 'published_date', order: 'asc' },
  MOST_VIEWED: { sortBy: 'views', order: 'desc' },
  MOST_VOTED: { sortBy: 'upvote', order: 'desc' },
  RELEVANCE: { sortBy: 'relevance', order: 'desc' },
};

type ArticleHeaderProps = {
  sortBy: string;
  onSortByChange: (value: string) => void;
  disabled?: boolean;
  hasSearchKey?: boolean;
}

export function ArticleHeader({ sortBy, onSortByChange, disabled, hasSearchKey }: ArticleHeaderProps) {
  const t = useTranslations('article.list');

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={onSortByChange} disabled={disabled}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('sort.newest')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              disabled={!hasSearchKey}
              value={`${SORT_OPTIONS.RELEVANCE.sortBy}-${SORT_OPTIONS.RELEVANCE.order}`}
            >
              {t('sort.relevance')}
            </SelectItem>
            <SelectItem defaultChecked value={`${SORT_OPTIONS.NEWEST.sortBy}-${SORT_OPTIONS.NEWEST.order}`}>
              {t('sort.newest')}
            </SelectItem>
            <SelectItem value={`${SORT_OPTIONS.OLDEST.sortBy}-${SORT_OPTIONS.OLDEST.order}`}>
              {t('sort.oldest')}
            </SelectItem>
            <SelectItem value={`${SORT_OPTIONS.MOST_VIEWED.sortBy}-${SORT_OPTIONS.MOST_VIEWED.order}`}>
              {t('sort.most_viewed')}
            </SelectItem>
            <SelectItem value={`${SORT_OPTIONS.MOST_VOTED.sortBy}-${SORT_OPTIONS.MOST_VOTED.order}`}>
              {t('sort.most_voted')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
