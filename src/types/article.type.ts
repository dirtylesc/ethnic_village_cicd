import { ArticleStatus } from '@/core/enum/article.enum';

import { Tag } from './tag.type';

export type Article = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  summary: string;
  content: string;
  imageUrl: string;
  upvote: number;
  downvote: number;
  views: number;
  publishedDate: string | null;
  tags?: Tag[];
}

export type ArticleListRequest = {
  searchKey?: string;
  sortBy?: string;
  order?: string;
  tagIds?: string;
  page?: number;
  size?: number;
}

export type ArticleListResponse = {
  content: Article[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type ArticleAdmin = {
  createdAt: string;
  updatedAt: string;
} & Article

export type ArticleAdminListRequest = {
  searchKey?: string;
  status?: ArticleStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  order?: string;
}

export type ArticleAdminPayload = {
  title: string;
  slug?: string;
  status?: ArticleStatus;
  summary?: string;
  content: string;
  imageUrl?: string;
  publishedDate?: string | null;
  tagIds?: string[];
}

export type ArticleAdminStatusPayload = {
  status: ArticleStatus;
}
