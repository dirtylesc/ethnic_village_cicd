import { EntityType } from '@/core/constants/entity';
import { bookmarkApi } from '@/data/apis/bookmark.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { BookmarkRequest, BookmarkResponse } from '@/types/bookmark.type';

export const BOOKMARK_QUERY_KEYS = {
  all: ['bookmarks'] as const,
  lists: () => [...BOOKMARK_QUERY_KEYS.all, 'list'] as const,
  list: (type: EntityType) => [...BOOKMARK_QUERY_KEYS.lists(), type] as const,
  checks: () => [...BOOKMARK_QUERY_KEYS.all, 'check'] as const,
  check: (entityId: string, type: EntityType) => [...BOOKMARK_QUERY_KEYS.checks(), entityId, type] as const,
};

export const useApiBookmarkAdd = () => {
  return useMutation({
    mutationFn: async (request: BookmarkRequest) => {
      const data = await bookmarkApi.addBookmark(request);
      return data;
    },
  });
};

export const useApiBookmarkRemove = () => {
  return useMutation({
    mutationFn: async (request: BookmarkRequest) => {
      const data = await bookmarkApi.removeBookmark(request);
      return data;
    },
  });
};

export const useApiBookmarkList = () => {
  return useQuery({
    queryKey: BOOKMARK_QUERY_KEYS.lists(),
    queryFn: () => bookmarkApi.getBookmarks(),
    select: response => response.data as BookmarkResponse,
  });
};

export const useApiBookmarkStatus = (entityId: string, type: EntityType) => {
  return useQuery({
    queryKey: BOOKMARK_QUERY_KEYS.check(entityId, type),
    queryFn: () => bookmarkApi.checkBookmarkStatus(entityId, type),
    select: response => response.data as BookmarkResponse,
  });
};
