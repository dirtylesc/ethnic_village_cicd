'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { RouteConstant } from '@/core/constants/route';
import { useCreateAdminArticle } from '@/hooks/api/useArticleAdmin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArticleForm } from './article-form';

export default function ArticleCreateContent() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('admin.article.form');
  const createMutation = useCreateAdminArticle();

  const handleSubmit = async (payload: any) => {
    try {
      await createMutation.mutateAsync(payload);
      toast({ title: t('toast_create_success') });
      router.push(RouteConstant.admin_article);
    } catch {
      toast({ title: t('toast_create_failed'), variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title_create')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle_create')}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          {t('back')}
        </Button>
      </div>
      <ArticleForm onSubmit={handleSubmit} submitting={createMutation.isPending} />
    </div>
  );
}
