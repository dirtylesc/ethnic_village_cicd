'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PromotionStatus, PromotionType } from '@/types/promotion.type';
import {
  useAdminPromotions,
  useDeleteAdminPromotion,
} from '@/hooks/api/usePromotion';
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

export default function PromotionListContent() {
  const t = useTranslations('admin.promotion');
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: promotionsResponse, isLoading } = useAdminPromotions({
    page: 0,
    size: 100,
  });
  const deletePromotion = useDeleteAdminPromotion();
  const { toast } = useToast();

  const promotions = promotionsResponse?.content || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePromotion.mutateAsync(deleteId);
      toast({ title: 'Promotion deleted successfully' });
      setDeleteId(null);
    } catch {
      toast({ title: 'Failed to delete promotion', variant: 'destructive' });
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: PromotionStatus) => {
    switch (status) {
      case PromotionStatus.ACTIVE:
        return <Badge variant="default">Active</Badge>;
      case PromotionStatus.INACTIVE:
        return <Badge variant="secondary">Inactive</Badge>;
      case PromotionStatus.EXPIRED:
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: PromotionType) => {
    switch (type) {
      case PromotionType.COUPON_CODE:
        return <Badge variant="outline">Coupon Code</Badge>;
      case PromotionType.DIRECT_DISCOUNT:
        return <Badge variant="outline">Direct Discount</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotion Management</h1>
        <Button onClick={() => router.push('/admin/promotion/create')}>
          <Plus className="mr-2 size-4" />
          Add Promotion
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Max Discount</TableHead>
              <TableHead className="text-center">Usage</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map(promotion => (
              <TableRow key={promotion.id}>
                <TableCell className="font-medium">{promotion.name}</TableCell>
                <TableCell>{getTypeBadge(promotion.type)}</TableCell>
                <TableCell>
                  <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                    {promotion.code || '-'}
                  </code>
                </TableCell>
                <TableCell>{promotion.discountPercent}%</TableCell>
                <TableCell>{promotion.maxDiscountAmount.toLocaleString()} VND</TableCell>
                <TableCell className="text-center">
                  {promotion.usedCount} / {promotion.usageLimit}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(promotion.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="size-3" />
                    <span>{formatDateTime(promotion.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="size-3" />
                    <span>{formatDateTime(promotion.endDate)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/promotion/${promotion.id}/edit`)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(promotion.id)}>
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {promotions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  No promotions found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this promotion? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
