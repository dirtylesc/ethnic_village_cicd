'use client';

import { cn } from '@/utils';

import { useArticleList } from '@/hooks/useArticle';

import ArticleItem from '../../article/article-item';

type ArticleListProps = {
  className?: string;
}

const ArticleList = ({ className }: ArticleListProps) => {
  const { data, isLoading } = useArticleList({ page: 0, size: 4 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const articles = data?.data?.content || [];

  return (
    <div
      className={cn(
        `grid grid-cols-1 items-stretch justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`,
        className,
      )}
    >
      {articles.map(article => {
        const { id, content, ...articleProps } = article as any;
        return <ArticleItem key={article.slug || String(id)} layout="vertical" {...(articleProps as any)} />;
      })}
    </div>
  );
};

export default ArticleList;
