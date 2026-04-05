import type { MetadataRoute } from 'next';
import { API_ROOT } from '@/core/api';
import { routing } from '@/libs/i18n-navigation';
import { getBaseUrl } from '@/libs/i18n-url';

import { ApiResponse } from '@/types/api.type';
import { Article, ArticleListResponse } from '@/types/article.type';
import { Tour, TourListResponse } from '@/types/tour.type';

async function fetchAllTours(): Promise<Tour[]> {
  try {
    const url = `${API_ROOT}/api/v1/tour?page=0&size=1000`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as ApiResponse<TourListResponse>;
    return json.data?.content || [];
  } catch {
    return [];
  }
}

async function fetchAllArticles(): Promise<Article[]> {
  try {
    const url = `${API_ROOT}/api/v1/post?page=0&size=1000`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as ApiResponse<ArticleListResponse>;
    return json.data?.content || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const [tours, articles] = await Promise.all([
    fetchAllTours(),
    fetchAllArticles(),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;

    sitemapEntries.push({
      url: `${baseUrl}${localePrefix}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    });

    sitemapEntries.push({
      url: `${baseUrl}${localePrefix}/tour`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });

    sitemapEntries.push({
      url: `${baseUrl}${localePrefix}/article`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });

    for (const tour of tours) {
      if (tour.slug) {
        sitemapEntries.push({
          url: `${baseUrl}${localePrefix}/tour/${tour.slug}`,
          lastModified: tour.updatedAt ? new Date(tour.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    for (const article of articles) {
      if (article.slug) {
        sitemapEntries.push({
          url: `${baseUrl}${localePrefix}/article/${article.slug}`,
          lastModified: article.publishedDate ? new Date(article.publishedDate) : now,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  }

  return sitemapEntries;
}
