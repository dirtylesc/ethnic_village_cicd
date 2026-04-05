'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Article } from '@/types/article.type';
import { Badge } from '@/components/ui/badge';

type ArticleDetailHeaderProps = {
  article: Article;
}

export default function ArticleDetailHeader({ article }: ArticleDetailHeaderProps) {
  const tItem = useTranslations('article.item');

  const { title, summary, tags, views, upvote, publishedDate, content } = article;

  let formattedDate: string | null = null;
  if (publishedDate) {
    const date = dayjs(publishedDate);
    if (date.isValid()) {
      formattedDate = date.format('DD/MM/YYYY');
    }
  }

  const wordCount = content ? content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <header className="flex flex-col gap-4">
      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              shape="rounded"
              size="sm"
              style={{
                backgroundColor: tag.color || '#6B7280',
                color: '#FFFFFF',
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      ) : null}

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {formattedDate ? <span>{tItem('published_on', { date: formattedDate })}</span> : null}
        <span>•</span>
        <span>{tItem('views', { count: views || 0 })}</span>
        <span>•</span>
        <span>{tItem('upvotes', { count: upvote || 0 })}</span>
        <span>•</span>
        <span>{tItem('read_time', { minutes: readTime })}</span>
      </div>

      {summary ? <p className="max-w-2xl text-base text-muted-foreground">{summary}</p> : null}
    </header>
  );
}
