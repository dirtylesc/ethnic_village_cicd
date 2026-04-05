import { Article } from '@/types/article.type';

import ArticleDetailHeader from './partials/header';
import ArticleDetailHeroImage from './partials/hero-image';
import ArticleDetailContent from './partials/content';

type ArticleDetailPageContentProps = {
  article: Article;
}

export default function ArticleDetailPageContent({ article }: ArticleDetailPageContentProps) {
  return (
    <div className="flex flex-col gap-8">
      <ArticleDetailHeader article={article} />
      <ArticleDetailHeroImage article={article} />
      <ArticleDetailContent article={article} />
    </div>
  );
}
