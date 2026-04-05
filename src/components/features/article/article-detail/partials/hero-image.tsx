import Image from 'next/image';

import { Article } from '@/types/article.type';

type ArticleDetailHeroImageProps = {
  article: Article;
}

export default function ArticleDetailHeroImage({ article }: ArticleDetailHeroImageProps) {
  const { title, imageUrl } = article;

  return (
    <div className="overflow-hidden rounded-2xl bg-muted">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={imageUrl || '/images/blog-card-thumbnail.png'}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
