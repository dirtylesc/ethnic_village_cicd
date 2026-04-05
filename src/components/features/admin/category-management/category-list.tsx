'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CategoryStatus } from '@/types/category.type';
import { useAllCategories, useDeleteCategory, useToggleCategoryStatus } from '@/hooks/api/useCategory';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CategoryListContent() {
  const t = useTranslations('admin.category');
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading } = useAllCategories();
  const deleteCategory = useDeleteCategory();
  const toggleStatus = useToggleCategoryStatus();
  const { toast } = useToast();

  const categories = categoriesResponse?.data || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast({ title: 'Category deleted successfully' });
      setDeleteId(null);
    } catch {
      toast({ title: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast({ title: 'Category status updated' });
    } catch {
      toast({ title: 'Failed to update status. Max 5 categories can be enabled.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => router.push('/admin/category/create')}>
          <Plus className="mr-2 size-4" />
          {t('add_category')}
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('description')}</TableHead>
              <TableHead className="text-center">{t('tour_count')}</TableHead>
              <TableHead className="text-center">{t('display_order')}</TableHead>
              <TableHead className="text-center">{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                <TableCell className="text-center">{category.tourCount || 0}</TableCell>
                <TableCell className="text-center">{category.displayOrder}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={category.status === CategoryStatus.ENABLED ? 'default' : 'secondary'}>
                    {category.status === CategoryStatus.ENABLED ? 'Enabled' : 'Disabled'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(category.id)}
                      title={category.status === CategoryStatus.ENABLED ? 'Disable' : 'Enable'}
                    >
                      {category.status === CategoryStatus.ENABLED ? (
                        <ToggleRight className="size-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="size-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/category/${category.id}/edit`)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(category.id)}>
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  {t('no_categories')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete_confirm_description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
