'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { ArticleStatus, ArticleStatusEnum } from '@/core/enum/article.enum';
import { MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAdminArticleList, useDeleteAdminArticle, useUpdateAdminArticleStatus } from '@/hooks/api/useArticleAdmin';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shell } from '@/components/shared/shell';

export function ArticleListContent() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('admin');
  const tStatus = useTranslations('admin.status');
  const [searchKey, setSearchKey] = useState('');
  const [status, setStatus] = useState<ArticleStatus | undefined>(undefined);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useAdminArticleList({
    searchKey: searchKey || undefined,
    status,
    page,
    size: pageSize,
    sortBy: 'createdAt',
    order: 'desc',
  });

  const deleteArticle = useDeleteAdminArticle();
  const updateStatus = useUpdateAdminArticleStatus();

  const articles = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 0;
  const currentPage = data?.data?.number ?? 0;

  const statusOptions = useMemo(() => Object.values(ArticleStatusEnum), []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm(t('article.list.confirm_delete'));
    if (!confirmed) return;
    try {
      await deleteArticle.mutateAsync(id);
      toast({ title: t('article.list.toast_delete_success') });
    } catch {
      toast({ title: t('article.list.toast_delete_failed'), variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: ArticleStatus) => {
    const nextStatus = currentStatus === ArticleStatus.PUBLISHED ? ArticleStatus.DRAFT : ArticleStatus.PUBLISHED;
    try {
      await updateStatus.mutateAsync({ id, payload: { status: nextStatus } });
      toast({ title: t('article.list.toast_status_success') });
    } catch {
      toast({ title: t('article.list.toast_status_failed'), variant: 'destructive' });
    }
  };

  const goToEdit = (id: string) => {
    router.push(RouteConstant.admin_article_edit.replace(':id', id));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{t('article.list.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('article.list.description')}</p>
        </div>
        <Button onClick={() => router.push(RouteConstant.admin_article_create)}>{t('article.list.create')}</Button>
      </div>

      <Shell className="gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t('article.list.search')}</Label>
            <Input
              placeholder={t('article.list.search')}
              value={searchKey}
              onChange={e => {
                setSearchKey(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t('article.list.status')}</Label>
            <Select
              value={status ?? 'ALL'}
              onValueChange={value => {
                if (value === 'ALL') {
                  setStatus(undefined);
                } else {
                  setStatus(value as ArticleStatus);
                }
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('article.list.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('article.list.all')}</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {tStatus(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('article.list.column_title')}</TableHead>
                <TableHead>{t('article.list.column_status')}</TableHead>
                <TableHead>{t('article.list.column_created_at')}</TableHead>
                <TableHead>{t('article.list.column_updated_at')}</TableHead>
                <TableHead className="text-right">{t('article.list.column_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t('article.list.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                articles.map(article => {
                  const statusInfo = ArticleStatusEnum[article.status];
                  return (
                    <TableRow key={article.id}>
                      <TableCell className="max-w-[320px]">
                        <div className="font-semibold">{article.title}</div>
                        <div className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</div>
                      </TableCell>
                      <TableCell>
                        {statusInfo ? (
                          <Badge variant={statusInfo.variant as any}>{tStatus(statusInfo.value)}</Badge>
                        ) : (
                          article.status
                        )}
                      </TableCell>
                      <TableCell>{article.createdAt ? new Date(article.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>{article.updatedAt ? new Date(article.updatedAt).toLocaleString() : '-'}</TableCell>
                      <TableCell className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">{t('article.list.open_menu' as any)}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => goToEdit(article.id)}>
                              {t('article.list.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(article.id, article.status)}
                              disabled={updateStatus.isPending}
                            >
                              {article.status === ArticleStatus.PUBLISHED
                                ? t('article.list.unpublish')
                                : t('article.list.publish')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(article.id)}
                              disabled={deleteArticle.isPending}
                              className="text-destructive focus:text-destructive"
                            >
                              {t('article.list.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {currentPage + 1} / {Math.max(totalPages, 1)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
            >
              {t('article.list.prev')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              {t('article.list.next')}
            </Button>
          </div>
        </div>
      </Shell>
    </div>
  );
}
