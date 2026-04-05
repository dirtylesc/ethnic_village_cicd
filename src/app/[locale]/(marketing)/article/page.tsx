'use client';

import ArticleContentSection from '@/components/features/article/article-list/content-section';
import ArticleFilterSection from '@/components/features/article/article-list/filter-section';
import { ArticleSearchBar } from '@/components/features/article/article-search';

export default function ArticleListPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <ArticleSearchBar className="w-full rounded-none border-0 shadow-custom-blue" />

      <div className="container flex w-full flex-col gap-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <ArticleFilterSection />
          <ArticleContentSection />
        </div>
      </div>
    </div>
  );
}
