import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import TitleSection from '../title-section';
import ArticleList from './article-list';

const ArticleSection = () => {
  const t = useTranslations('common');
  const tArticle = useTranslations('home.article');
  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection title={tArticle('title')} description={tArticle('description')} />
      <ArticleList />
      <Button asChild>
        <Link href={`${RouteConstant.article}`}>
          {t('view_more')}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
};

export default ArticleSection;
