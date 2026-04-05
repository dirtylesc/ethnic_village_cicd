import { API } from '@/core/api';
import api from '@/core/api/api';
import { EntityType } from '@/core/constants/entity';

import { ApiResponse } from '@/types/api.type';
import { BookmarkRequest, BookmarkResponse, BookmarkUpdateResponse } from '@/types/bookmark.type';

export const bookmarkApi = {
  addBookmark: async (data: BookmarkRequest) => {
    try {
      const response = await api.post<ApiResponse<BookmarkUpdateResponse>>(API.BOOKMARK.BASE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeBookmark: async (data: BookmarkRequest) => {
    try {
      const response = await api.delete<ApiResponse<BookmarkUpdateResponse>>(API.BOOKMARK.BASE, { data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookmarks: async () => {
    try {
      const response = await api.get<ApiResponse<BookmarkResponse>>(API.BOOKMARK.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkBookmarkStatus: async (entityId: string, type: EntityType) => {
    try {
      const response = await api.get<ApiResponse<BookmarkResponse>>(API.BOOKMARK.CHECK, {
        params: { entityId, type },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
