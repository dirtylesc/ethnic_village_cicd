import ArticleEditContent from '@/components/features/admin/article-management/article-edit';

type AdminArticleEditPageProps = {
  params: {
    id: string;
  };
}

export default function AdminArticleEditPage({ params }: AdminArticleEditPageProps) {
  return <ArticleEditContent id={params.id} />;
}
