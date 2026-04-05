import { EntityType } from '@/core/constants/entity';
import { BookmarkStatus } from '@/core/enum/bookmark.enum';

export type Bookmark = {
  id: number;
  entityType: EntityType;
  entityId: string;
  status: BookmarkStatus;
  createdAt: string;
  updatedAt: string;
}

export type BookmarkRequest = {
  entityId: string;
  entityType: EntityType;
}

export type BookmarkUpdateResponse = {
  bookmark: Bookmark;
}

export type BookmarkResponse = {
  bookmarks: Bookmark[];
  total: number;
  isBookmarked: boolean;
}
