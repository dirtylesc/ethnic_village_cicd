'use client';

import { useMemo, useState } from 'react';
import { EntityType } from '@/core/constants/entity';
import { useUserStore } from '@/stores/useUserStore';
import { useTranslations } from 'next-intl';

import { Bookmark } from '@/types/bookmark.type';

import TourBookmarksTab from './tour-bookmarks-tab';

const ITEMS_PER_PAGE = 5;

type BookmarkMap = {
  [EntityType.TOUR]: Bookmark[];
  [EntityType.ARTICLE]: Bookmark[];
};

export default function BookmarkTabContent() {
  const t = useTranslations('personal.bookmark');
  const [visibleTourItems, setVisibleTourItems] = useState(ITEMS_PER_PAGE);
  const { details } = useUserStore();

  const sortedBookmarks = useMemo(() => {
    if (!details?.bookmarks) {
      return {
        [EntityType.TOUR]: [],
      };
    }

    const bookmarks = details.bookmarks.reduce((acc, bookmark) => {
      if (!acc[bookmark.entityType]) {
        acc[bookmark.entityType] = [];
      }

      acc[bookmark.entityType].push(bookmark);
      return acc;
    }, {} as BookmarkMap) || { [EntityType.TOUR]: [] };

    Object.keys(bookmarks).forEach(type => {
      bookmarks[type as EntityType].sort((a, b) => {
        const statusOrder = { ACTIVE: 0, INACTIVE: 1, DELETED: 2 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];

        if (statusDiff !== 0) {
          return statusDiff;
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    });

    return bookmarks;
  }, [details?.bookmarks]);

  const handleLoadMoreTours = () => {
    setVisibleTourItems(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <TourBookmarksTab
        bookmarks={sortedBookmarks[EntityType.TOUR]}
        visibleItems={visibleTourItems}
        onLoadMore={handleLoadMoreTours}
      />
    </div>
  );
}
