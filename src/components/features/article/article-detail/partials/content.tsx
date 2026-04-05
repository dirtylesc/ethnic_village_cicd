import { Article } from '@/types/article.type';
import { Card, CardContent } from '@/components/ui/card';

type ArticleDetailContentProps = {
  article: Article;
}

export default function ArticleDetailContent({ article }: ArticleDetailContentProps) {
  const { content } = article;

  return (
    <Card className="border-none bg-card/80 shadow-none">
      <CardContent className="p-0 py-8">
        <article
          className="article-content"
          dangerouslySetInnerHTML={{
            __html: content || '',
          }}
        />
      </CardContent>
    </Card>
  );
}
