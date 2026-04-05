'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { RouteConstant } from '@/core/constants/route';
import { useAdminArticleDetail, useUpdateAdminArticle } from '@/hooks/api/useArticleAdmin';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArticleForm } from './article-form';

type ArticleEditContentProps = {
  id: string;
};

export default function ArticleEditContent({ id }: ArticleEditContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('admin.article.form');
  const { data, isLoading } = useAdminArticleDetail(id);
  const updateMutation = useUpdateAdminArticle();

  const handleSubmit = async (payload: any) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      toast({ title: t('toast_update_success') });
      router.push(RouteConstant.admin_article);
    } catch {
      toast({ title: t('toast_update_failed'), variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const article = data?.data;

  if (!article) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <p className="text-sm text-muted-foreground">{t('not_found')}</p>
        <Button variant="outline" onClick={() => router.push(RouteConstant.admin_article)}>
          {t('back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title_edit')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle_edit')}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          {t('back')}
        </Button>
      </div>
      <ArticleForm initialData={article} onSubmit={handleSubmit} submitting={updateMutation.isPending} />
    </div>
  );
}
